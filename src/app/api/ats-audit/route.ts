import { NextRequest, NextResponse } from "next/server";
import { cleanAIMarkdownArtifacts } from "@/lib/monetization";
import { createGroqClient, GROQ_MODELS } from "@/lib/server-ai-keys";
import { anonymizePII } from "@/lib/privacy-utils";

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
  sourceProvider: string;
}

const ATS_SYSTEM_PROMPT = `You are an elite enterprise Applicant Tracking System (ATS) parsing engine and senior technical recruiter (Workday, Taleo, Greenhouse, E-Staff).
Analyze the candidate resume against the provided job vacancy using the standard 55/15/15/15 ATS scoring formula.

SCORING MATRIX:
1. Hard Skills (0 to 55 points max):
   - Extract essential domain tools, technical skills, software, standards (ГОСТ, СПДС, etc.), frameworks, certifications required by the vacancy.
   - Award points ONLY for hard skills proven in the candidate's work experience with concrete context.
   - List missing hard skills that appear in the vacancy but are absent or unproven in the resume.
2. Quantified Metrics (0 to 15 points max):
   - Measure whether bullet points have concrete metrics (%, $, руб, млн, тыс, x, headcount, time savings, deadlines).
3. Soft Skills (0 to 15 points max):
   - Evaluate leadership, stakeholder management, cross-functional collaboration, problem solving, negotiation.
4. ATS Formatting & Structure (0 to 15 points max):
   - Check clean single-column structure, presence of email/phone, standard section titles, no broken tables.

CRITICAL RULES:
- detectedIndustry: Must accurately identify the industry based on the ACTUAL job vacancy and resume (e.g. "Строительство и проектирование", "Инженерия и производство", "Финансы и Бухгалтерия", "B2B Продажи", "Маркетинг и PR", "IT и разработка ПО", "Юриспруденция", "Логистика и цепи поставок", "HR и подбор персонала"). NEVER default to Accounting if the vacancy is for an Engineer or Sales!
- missingHardSkills: Array of specific hard skills/technologies/standards requested in the vacancy that the candidate lacks. Extract real terms from the vacancy.
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
    const userApiKey: string = (
      body.userApiKey ||
      body.apiKey ||
      req.headers.get("x-groq-key") ||
      ""
    ).trim();

    if (!vacancyText && !resumeText) {
      return NextResponse.json(
        { error: "Необходимо передать текст резюме и текст вакансии" },
        { status: 400 }
      );
    }

    // 152-ФЗ РФ: Полное обезличивание ПДн перед отправкой во внешний LLM-провайдер
    const { anonymizedText: anonymizedResume } = anonymizePII(resumeText);

    const groq = createGroqClient(userApiKey);
    let lastError: any = null;

    // Send strictly to Groq LLM using model cascade with masked PII
    for (const model of GROQ_MODELS) {
      try {
        const chatCompletion = await groq.chat.completions.create({
          model,
          messages: [
            { role: "system", content: ATS_SYSTEM_PROMPT },
            {
              role: "user",
              content: `ЦЕЛЕВАЯ ВАКАНСИЯ:\n${vacancyText.slice(0, 4000)}\n\nРЕЗЮМЕ КАНДИДАТА (Обезличено по 152-ФЗ РФ):\n${anonymizedResume.slice(0, 4000)}`,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.1,
          max_tokens: model.includes("qwen") ? 800 : 1500,
        });

        const rawContent = chatCompletion.choices?.[0]?.message?.content;
        if (rawContent) {
          const parsed = JSON.parse(rawContent);
          const sanitized = sanitizeAuditResult(parsed, `groq (${model})`);
          return NextResponse.json(sanitized);
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Groq model ${model} failed]:`, err?.message || err);
        // Continue to next available Groq model
      }
    }

    // If all models failed, return meaningful error response (strict Groq mode, no simulator fallback)
    return NextResponse.json(
      {
        error: "Не удалось выполнить аудит через Groq LLM",
        details: lastError?.message || "Groq API error",
      },
      { status: 502 }
    );
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

  const totalScore =
    typeof raw?.totalScore === "number" && raw.totalScore >= 5 && raw.totalScore <= 98
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
      : `Резюме оценено в ${totalScore} баллов. Для повышения до 90%+ рекомендуется подтвердить в опыте: ${
          missingHardSkills.slice(0, 3).join(", ") || "профильные требования"
        }.`
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
