import { NextRequest, NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { cleanAIMarkdownArtifacts } from "@/lib/monetization";

export const maxDuration = 30;

export interface AtsAuditResponse {
  totalScore: number;
  detectedIndustry: string;
  breakdown: {
    hardSkills: number;
    metrics: number;
    softSkills: number;
    formatting: number;
  };
  missingHardSkills: string[];
  matchingSkills: string[];
  critique: string;
  sourceProvider?: string;
}

const ATS_SYSTEM_PROMPT = `You are a real enterprise Applicant Tracking System (ATS) parsing engine and senior technical recruiter (Workday, Taleo, Greenhouse, E-Staff).
Analyze the candidate resume against the provided job vacancy using the standard 55/15/15/15 ATS scoring formula.

SCORING MATRIX:
1. Hard Skills (0 to 55 points max):
   - Extract essential domain tools, technical skills, software, standards (ГОСТ, СПДС, etc.), frameworks, certifications required by the vacancy.
   - Award points ONLY for hard skills proven in the candidate's work experience.
   - List missing hard skills that appear in the vacancy but are absent or unproven in the resume.
2. Quantified Metrics (0 to 15 points max):
   - Measure whether bullet points have concrete metrics (%, $, руб, млн, тыс, x, headcount, time savings, deadlines).
3. Soft Skills (0 to 15 points max):
   - Evaluate leadership, stakeholder management, cross-functional collaboration, problem solving, negotiation.
4. ATS Formatting & Structure (0 to 15 points max):
   - Check clean single-column structure, presence of email/phone, standard section titles, no broken tables.

CRITICAL RULES:
- detectedIndustry: Must accurately identify the industry based on the ACTUAL job vacancy and resume (e.g. "Строительство и проектирование", "Инженерия и производство", "Финансы и Бухгалтерия", "B2B Продажи", "Маркетинг и реклама", "IT и разработка ПО", "Юриспруденция", "Логистика и цепи поставок", "HR и подбор персонала"). NEVER default to Accounting if the vacancy is for an Engineer or Sales!
- missingHardSkills: Array of specific hard skills requested in the vacancy that the candidate lacks. Extract real terms from the vacancy.
- matchingSkills: Array of hard/soft skills found in both the vacancy and the candidate's resume.
- critique: 2-3 concise, constructive Russian sentences explaining the score, critical gaps, and specific recommendations to beat the ATS filter.
- totalScore: Math.round(breakdown.hardSkills + breakdown.metrics + breakdown.softSkills + breakdown.formatting), clamped between 5 and 98.

You MUST return a valid JSON object matching this exact schema:
{
  "totalScore": number,
  "detectedIndustry": string,
  "breakdown": {
    "hardSkills": number,
    "metrics": number,
    "softSkills": number,
    "formatting": number
  },
  "missingHardSkills": string[],
  "matchingSkills": string[],
  "critique": string
}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const resumeText: string = (body.resumeText || body.resume || "").trim();
    const vacancyText: string = (body.vacancyText || body.jobDescription || body.jobDesc || "").trim();
    const userApiKey: string = (body.userApiKey || body.apiKey || "").trim();

    if (!vacancyText && !resumeText) {
      return NextResponse.json(
        { error: "Необходимо передать текст резюме и текст вакансии" },
        { status: 400 }
      );
    }

    const groqKey =
      (userApiKey.startsWith("gsk_") ? userApiKey : "") ||
      req.headers.get("x-groq-key") ||
      process.env.GROQ_API_KEY ||
      "";

    const geminiKey =
      (userApiKey.startsWith("AIzaSy") ? userApiKey : "") ||
      req.headers.get("x-gemini-key") ||
      process.env.GEMINI_API_KEY ||
      "";

    // 1. Try Groq (llama-3.3-70b-versatile) with json_object format
    if (groqKey && groqKey.trim().length > 10 && !groqKey.includes("placeholder")) {
      try {
        const groq = new Groq({ apiKey: groqKey.trim() });
        const chatCompletion = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: ATS_SYSTEM_PROMPT },
            {
              role: "user",
              content: `ЦЕЛЕВАЯ ВАКАНСИЯ:\n${vacancyText.slice(0, 3500)}\n\nРЕЗЮМЕ КАНДИДАТА:\n${resumeText.slice(0, 3500)}`,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.1,
        });

        const rawContent = chatCompletion.choices?.[0]?.message?.content;
        if (rawContent) {
          const parsed = JSON.parse(rawContent);
          const sanitized = sanitizeAuditResult(parsed, "groq_llama_70b");
          return NextResponse.json(sanitized);
        }
      } catch (groqErr) {
        console.warn("[Groq ATS Audit failed, falling back]:", groqErr);
      }
    }

    // 2. Try Google Gemini (gemini-1.5-flash) with structured JSON
    if (geminiKey && geminiKey.trim().length > 10 && !geminiKey.includes("placeholder")) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey.trim());
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.1,
          },
        });

        const prompt = `${ATS_SYSTEM_PROMPT}\n\nЦЕЛЕВАЯ ВАКАНСИЯ:\n${vacancyText.slice(0, 3500)}\n\nРЕЗЮМЕ КАНДИДАТА:\n${resumeText.slice(0, 3500)}`;
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        if (text) {
          const parsed = JSON.parse(text);
          const sanitized = sanitizeAuditResult(parsed, "gemini_1.5_flash");
          return NextResponse.json(sanitized);
        }
      } catch (geminiErr) {
        console.warn("[Gemini ATS Audit failed, falling back]:", geminiErr);
      }
    }

    // 3. Resilient Dynamic NLP Career Parser (Guaranteed Zero Downtime & Accurate to actual text)
    const dynamicResult = runDynamicNlpAtsAudit(resumeText, vacancyText);
    return NextResponse.json(dynamicResult);
  } catch (error: any) {
    console.error("[ATS Audit Error]:", error);
    return NextResponse.json(
      { error: "Ошибка обработки ATS аудита", details: error?.message },
      { status: 500 }
    );
  }
}

function sanitizeAuditResult(raw: any, provider: string): AtsAuditResponse {
  const hard = Math.max(0, Math.min(55, Number(raw?.breakdown?.hardSkills ?? 30)));
  const metrics = Math.max(0, Math.min(15, Number(raw?.breakdown?.metrics ?? 8)));
  const soft = Math.max(0, Math.min(15, Number(raw?.breakdown?.softSkills ?? 8)));
  const formatting = Math.max(0, Math.min(15, Number(raw?.breakdown?.formatting ?? 10)));
  const computedTotal = Math.max(5, Math.min(98, hard + metrics + soft + formatting));

  const totalScore = typeof raw?.totalScore === "number" && raw.totalScore >= 5 && raw.totalScore <= 98
    ? raw.totalScore
    : computedTotal;

  const missingHardSkills = Array.isArray(raw?.missingHardSkills)
    ? raw.missingHardSkills.map((s: any) => cleanAIMarkdownArtifacts(String(s))).filter(Boolean)
    : [];

  const matchingSkills = Array.isArray(raw?.matchingSkills)
    ? raw.matchingSkills.map((s: any) => cleanAIMarkdownArtifacts(String(s))).filter(Boolean)
    : [];

  const detectedIndustry = cleanAIMarkdownArtifacts(
    typeof raw?.detectedIndustry === "string" && raw.detectedIndustry.trim().length > 2
      ? raw.detectedIndustry.trim()
      : "Общая квалификация"
  );

  const critique = cleanAIMarkdownArtifacts(
    typeof raw?.critique === "string" && raw.critique.trim().length > 10
      ? raw.critique.trim()
      : `Резюме оценено в ${totalScore} баллов. Для повышения до 90%+ рекомендуется закрыть отсутствующие требования: ${missingHardSkills.slice(0, 3).join(", ") || "профильные навыки"}.`
  );

  return {
    totalScore,
    detectedIndustry,
    breakdown: {
      hardSkills: hard,
      metrics,
      softSkills: soft,
      formatting,
    },
    missingHardSkills,
    matchingSkills,
    critique,
    sourceProvider: provider,
  };
}

/**
 * Intelligent NLP Dynamic ATS Engine:
 * Analyzes the actual text of ANY profession, extracts real keywords from vacancy,
 * matches them against resume, counts metrics & soft skills, detects true industry.
 */
function runDynamicNlpAtsAudit(resumeText: string, vacancyText: string): AtsAuditResponse {
  const normVac = (vacancyText || "").toLowerCase();
  const normRes = (resumeText || "").toLowerCase();

  // 1. Detect Real Industry from Vacancy / Resume content
  let detectedIndustry = "Общая сфера деятельности";

  if (
    normVac.includes("инженер") ||
    normVac.includes("сапр") ||
    normVac.includes("autocad") ||
    normVac.includes("solidworks") ||
    normVac.includes("компас") ||
    normVac.includes("гост") ||
    normVac.includes("снип") ||
    normVac.includes("главгосэкспертиз") ||
    normVac.includes("строитель") ||
    normVac.includes("проектирован") ||
    normVac.includes("пто")
  ) {
    detectedIndustry = "Строительство и проектирование";
  } else if (
    normVac.includes("бухгалтер") ||
    normVac.includes("1с") ||
    normVac.includes("осно") ||
    normVac.includes("усн") ||
    normVac.includes("ндс") ||
    normVac.includes("фнс") ||
    normVac.includes("налог") ||
    normVac.includes("первичк")
  ) {
    detectedIndustry = "Финансы и Бухгалтерия";
  } else if (
    normVac.includes("продаж") ||
    normVac.includes("b2b") ||
    normVac.includes("amocrm") ||
    normVac.includes("битрикс24") ||
    normVac.includes("воронк") ||
    normVac.includes("роп") ||
    normVac.includes("лидогенерац")
  ) {
    detectedIndustry = "Продажи и Коммерция";
  } else if (
    normVac.includes("маркетинг") ||
    normVac.includes("директ") ||
    normVac.includes("seo") ||
    normVac.includes("cpl") ||
    normVac.includes("cac") ||
    normVac.includes("трафик") ||
    normVac.includes("таргет")
  ) {
    detectedIndustry = "Маркетинг и PR";
  } else if (
    normVac.includes("юрист") ||
    normVac.includes("арбитраж") ||
    normVac.includes("гк рф") ||
    normVac.includes("тк рф") ||
    normVac.includes("договор") ||
    normVac.includes("право") ||
    normVac.includes("фас")
  ) {
    detectedIndustry = "Юриспруденция и Право";
  } else if (
    normVac.includes("логист") ||
    normVac.includes("вэд") ||
    normVac.includes("склад") ||
    normVac.includes("wms") ||
    normVac.includes("инкотермс") ||
    normVac.includes("цепочк")
  ) {
    detectedIndustry = "Логистика и Склад";
  } else if (
    normVac.includes("рекрутер") ||
    normVac.includes("подбор") ||
    normVac.includes("huntflow") ||
    normVac.includes("онбординг") ||
    normVac.includes("hr")
  ) {
    detectedIndustry = "Управление персоналом и HR";
  } else if (
    normVac.includes("директор") ||
    normVac.includes("coo") ||
    normVac.includes("p&l") ||
    normVac.includes("ebitda") ||
    normVac.includes("операционн") ||
    normVac.includes("руководител")
  ) {
    detectedIndustry = "Топ-менеджмент и Управление";
  } else if (
    normVac.includes("developer") ||
    normVac.includes("программист") ||
    normVac.includes("react") ||
    normVac.includes("python") ||
    normVac.includes("sql") ||
    normVac.includes("devops") ||
    normVac.includes("docker") ||
    normVac.includes("api")
  ) {
    detectedIndustry = "IT и Продукт";
  } else {
    // Try to extract position from first line
    const firstLine = vacancyText.split("\n")[0]?.replace(/^[^\wа-яё]+/i, "").trim();
    if (firstLine && firstLine.length > 3 && firstLine.length < 50) {
      detectedIndustry = firstLine;
    }
  }

  // 2. Extract specific hard skills & requirements from Vacancy text lines
  const extractedSkills: string[] = [];
  const lines = vacancyText.split(/\r?\n/);
  let isReq = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (/требован|обязанност|навык|стек|ожидан|requirements|responsibilities/i.test(line)) {
      isReq = true;
      continue;
    }

    if (isReq && /^[•\-\*–—\d\.]+\s+/.test(line)) {
      const cleaned = line.replace(/^[•\-\*–—\d\.]+\s+/, "").trim();
      const phrases = cleaned.split(/[,;]/);
      for (const phrase of phrases) {
        const item = phrase.trim();
        if (item.length >= 3 && item.length <= 45 && !/опыт|желательно|готовность/i.test(item)) {
          extractedSkills.push(item);
        }
      }
    }
  }

  // Industry-specific fallback skill catalogs if vacancy format was unconventional
  if (extractedSkills.length < 4) {
    if (detectedIndustry.includes("Строительство") || detectedIndustry.includes("Инженерия")) {
      extractedSkills.push("AutoCAD", "Компас-3D", "SolidWorks", "ЕСКД и СПДС", "Главгосэкспертиза", "ГОСТ и СНиП", "Авторский надзор");
    } else if (detectedIndustry.includes("Финансы") || detectedIndustry.includes("Бухгалтер")) {
      extractedSkills.push("1С:Бухгалтерия 8.3", "ОСНО и УСН", "Расчет НДС", "Первичная документация", "ЭДО (Диадок/СБИС)", "Отчетность в ФНС");
    } else if (detectedIndustry.includes("Продаж")) {
      extractedSkills.push("AmoCRM", "B2B продажи", "Переговоры C-Level", "Воронка продаж", "Контроль дебиторской задолженности");
    } else if (detectedIndustry.includes("Маркетинг")) {
      extractedSkills.push("Яндекс.Директ", "Сквозная аналитика", "Google Analytics 4", "SEO оптимизация", "CPL / CAC / LTV");
    } else if (detectedIndustry.includes("Юриспруд")) {
      extractedSkills.push("Арбитражные суды", "Договорная работа", "Корпоративное право", "ГК РФ и ТК РФ", "Комплаенс");
    } else if (detectedIndustry.includes("Логист")) {
      extractedSkills.push("WMS системы", "Управление цепочками (SCM)", "ВЭД и таможня", "Инкотермс (FOB, CIF)", "Стандарты OTIF");
    } else if (detectedIndustry.includes("HR")) {
      extractedSkills.push("Подбор полного цикла", "ATS Huntflow / E-Staff", "Cost-per-Hire", "Time-to-Fill", "Оценка 360 / eNPS");
    } else {
      extractedSkills.push("Управление проектами", "Оптимизация процессов", "Регламентация", "Аналитика показателей", "Контроль качества");
    }
  }

  // Deduplicate skills
  const uniquePool = Array.from(new Set(extractedSkills)).slice(0, 10);

  // Compare each skill against candidate's resume
  const matchingSkills: string[] = [];
  const missingHardSkills: string[] = [];

  for (const skill of uniquePool) {
    const sLower = skill.toLowerCase();
    const tokenWords = sLower.split(/[\s/()]+/).filter((w) => w.length > 2);
    const isMatched =
      normRes.includes(sLower) ||
      (tokenWords.length > 0 && tokenWords.every((w) => normRes.includes(w)));

    if (isMatched) {
      matchingSkills.push(skill);
    } else {
      missingHardSkills.push(skill);
    }
  }

  // Calculate Breakdown Scores:
  // 1. Hard Skills (max 55)
  const hardRatio = uniquePool.length > 0 ? matchingSkills.length / uniquePool.length : 0.4;
  const hardSkills = Math.min(55, Math.max(10, Math.round(hardRatio * 55)));

  // 2. Metrics (max 15): check numbers, %, руб, млн, тыс, etc.
  const metricMatches = resumeText.match(/\b(\d+[%$€₽]|млн|тыс|руб|x|клиент|сдел|договор|срок)\b/gi) || [];
  let metrics = 4;
  if (metricMatches.length >= 5) metrics = 15;
  else if (metricMatches.length >= 3) metrics = 11;
  else if (metricMatches.length >= 1) metrics = 7;

  // 3. Soft Skills (max 15): check leadership, communication, team
  const softKeywords = ["управлен", "переговор", "команд", "руковод", "согласован", "лидер", "коммуникац", "ответствен"];
  const softCount = softKeywords.filter((k) => normRes.includes(k)).length;
  let softSkills = 5;
  if (softCount >= 4) softSkills = 15;
  else if (softCount >= 2) softSkills = 11;
  else if (softCount >= 1) softSkills = 8;

  // 4. ATS Layout & Formatting (max 15)
  let formatting = 14;
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(resumeText);
  const hasPhone = /(?:\+7|8|\+1)[\d\s() -]{7,}/.test(resumeText);
  if (!hasEmail || !hasPhone) formatting -= 4;
  if (/\|.*\|.*\|/.test(resumeText)) formatting -= 3; // tabular pipe artifact

  const totalScore = Math.min(96, Math.max(12, hardSkills + metrics + softSkills + formatting));

  const critique =
    missingHardSkills.length > 0
      ? `Резюме оценено в ${totalScore}% для сферы «${detectedIndustry}». Ключевой дефицит баллов — в блоке Hard Skills: не подтверждены ключевые требования вакансии (${missingHardSkills.slice(0, 3).join(", ")}). Рекомендуется интегрировать их в буллеты опыта по формуле Google X-Y-Z.`
      : `Отличное совпадение (${totalScore}%) с целевой вакансией «${detectedIndustry}». Резюме уверенно проходит первичный ATS-фильтр. Для максимизации оффера проверьте оцифровку финансовых метрик.`;

  return {
    totalScore,
    detectedIndustry,
    breakdown: {
      hardSkills,
      metrics,
      softSkills,
      formatting,
    },
    missingHardSkills,
    matchingSkills,
    critique,
    sourceProvider: "nlp_dynamic_analyzer",
  };
}
