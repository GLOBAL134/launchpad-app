import { NextRequest, NextResponse } from "next/server";
import { createGroqClient } from "@/lib/server-ai-keys";
import { cleanAIMarkdownArtifacts } from "@/lib/monetization";
import { buildPrBatchWave, PR_FEATURES } from "@/lib/pr-generator";

export const maxDuration = 45;

function extractContent(item: any, defaultTitle: string): { title: string; content: string } {
  if (!item) return { title: defaultTitle, content: "" };
  if (typeof item === "string") {
    const lines = item.trim().split("\n");
    if (lines[0].startsWith("#") || (lines[0].length < 90 && lines.length > 1)) {
      const title = lines[0].replace(/^#+\s*/, "").trim();
      const content = lines.slice(1).join("\n").trim();
      return { title: title || defaultTitle, content: content || item.trim() };
    }
    return { title: defaultTitle, content: item.trim() };
  }
  const content = item.content || item.text || item.body || item.post || "";
  const title = item.title || item.heading || defaultTitle;
  return { title, content };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const role: string = (body.role || body.targetRole || "Специалист").trim();
    const featureId: string = body.featureId || body.feature || "ats_55";
    const tone: "viral" | "case_study" | "guide" = body.tone || "viral";
    const customKey: string = (
      body.userApiKey ||
      body.apiKey ||
      req.headers.get("x-groq-key") ||
      ""
    ).trim();

    const featureObj = PR_FEATURES.find((f) => f.id === featureId) || PR_FEATURES[0];

    const systemPrompt = `You are an elite Chief PR Strategist, Viral Growth Marketer, and Head of Content for LaunchPad AI PRO.
Your goal is to generate a comprehensive multi-channel marketing wave consisting of 7 distinct, ready-to-publish posts for 7 platforms.

CRITICAL PLATFORM-SPECIFIC COMPLIANCE RULES:
1. "pikabu":
   - STRICT RULE: ZERO LINKS OR URLS (any link leads to immediate moderator ban!).
   - Format: Engaging first-person storytelling ("Как я искал работу...", "Почему сильных спецов разворачивают...").
   - Mention service by plain text: "LaunchPad AI PRO".
   - Promo code: "START30" (gives 30% discount on PRO).

2. "tenchat":
   - Format: Business expert breakdown with structured insights and bullet points.
   - Tone: Professional B2B thought leadership for the Zeus algorithm.
   - STRICT RULE: Do not put direct links in text. Always include reminder: "🔗 Ссылку на интерактивный сканер резюме и разбор оставлю в первом комментарии к посту 👇".
   - Closing: Open-ended engaging question to trigger comments.

3. "linkedin":
   - Format: Viral punchy 2-line hook before "...see more".
   - Contrast bullets with ❌ (Before / Mistakes) and ✅ (After / Solutions).
   - Comment-bait call to action: "Напишите в комментариях вашу специальность — сделаю экспресс-разбор скрытых навыков для резюме!".
   - Relevant hashtags (#career #ats #jobsearch #резюме #карьера).

4. "vc":
   - Format: In-depth analytical case study with real numbers.
   - Story: How candidate went from 50-60% to 92-95% ATS match score and received offers.
   - Breakdown of Google X-Y-Z formula ("Accomplished [X] measured by [Y] doing [Z]").
   - Actionable takeaways for candidates and employers.

5. "hashnode":
   - STRICT RULE: ENTIRELY IN ENGLISH.
   - Format: Technical engineering article explaining Applicant Tracking System (ATS) heuristics and tokenization.
   - Detail the 55/15/15/15 formula (55% Hard skills, 15% Quantified metrics, 15% Soft skills, 15% Harvard layout).

6. "indiehackers":
   - STRICT RULE: ENTIRELY IN ENGLISH.
   - Format: Build-in-Public transparent founder update for bootstrapped entrepreneurs.
   - STRICT RULE: NO ".vercel.app" links. NO forbidden promotional buzzwords ("free", "promo", "discount") which cause shadowbans.
   - Discuss tech stack (Next.js 16, Groq AI cascade), organic referral loops, retention, and MRR growth.

7. "creative":
   - Part 1: Nano Banana / Midjourney / Flux prompt (photorealistic 8k octane render, cinematic lighting, futuristic holographic HUD interfaces showing ATS scores and data nodes, tailored to the target profession, --ar 16:9).
   - Part 2: 10-Second Viral Video Storyboard (for Reels / Shorts / TikTok / Google Veo):
     • 0:00 - 0:03 (Хук): Visual + On-screen text + Voiceover
     • 0:03 - 0:07 (Боль и решение): Visual + On-screen text + Voiceover
     • 0:07 - 0:10 (Призыв к действию): Visual + On-screen text (START30) + Voiceover.

YOU MUST OUTPUT STRICTLY A VALID JSON OBJECT MATCHING THIS SCHEMA:
{
  "pikabu": { "title": "String", "content": "Full post text strictly without links" },
  "tenchat": { "title": "String", "content": "Full post text with first-comment reminder and question" },
  "linkedin": { "title": "String", "content": "Full post text with hook, bullets with emojis, comment-bait" },
  "vc": { "title": "String", "content": "Full case study text with metrics and X-Y-Z formula" },
  "hashnode": { "title": "English title", "content": "Full technical article in English" },
  "indiehackers": { "title": "English title", "content": "Full Build in Public update in English without vercel links" },
  "creative": { "title": "Промпт + видеосценарий", "content": "Full Midjourney prompt + 10-second vertical video storyboard" }
}`;

    const userPrompt = `TARGET PROFESSION: ${role}
FEATURE FOCUS: ${featureObj.label} (${featureObj.desc})
TONE: ${tone === "viral" ? "Вирусный / Провокационный" : tone === "case_study" ? "Глубокий кейс с цифрами" : "Экспертный обучающий гайд"}
PROMO CODE: START30 (скидка 30% на PRO)
SERVICE NAME: LaunchPad AI PRO

Сгенерируй полноценную вирусную контент-волну из 7 постов для всех 7 платформ в строгом формате JSON по правилам каждой площадки.`;

    const groq = createGroqClient(customKey);
    let generatedJson: any = null;
    let usedModel = "";

    // Models that support larger context output for complete 7-post batches
    const prModels = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b"];

    for (const model of prModels) {
      try {
        const maxTokens = model.includes("qwen") ? 950 : 4500;
        const resp = await groq.chat.completions.create({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
          max_tokens: maxTokens,
        });

        const raw = resp.choices?.[0]?.message?.content;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object" && (parsed.pikabu || parsed.linkedin || parsed.vc)) {
            generatedJson = parsed;
            usedModel = model;
            break;
          }
        }
      } catch (err: any) {
        console.warn(`[PR Generate Groq model ${model} failed]:`, err?.message || err);
      }
    }

    // Dynamic Fallback Generator for any missing platform
    const fallbackBatch = buildPrBatchWave(role, featureId, undefined, tone);

    if (generatedJson) {
      const getPostData = (key: string, fallbackName: string, badge: string, rulesHint: string) => {
        const raw = generatedJson[key];
        const extracted = extractContent(raw, `${fallbackName}: «${role}»`);
        const fallbackContent = fallbackBatch.channels[key]?.content || "";

        // If LLM returned empty or too short, use dynamic rich fallback
        const finalContent =
          extracted.content.trim().length > 40
            ? cleanAIMarkdownArtifacts(extracted.content)
            : fallbackContent;

        return {
          id: key,
          title: extracted.title,
          platformName: fallbackName,
          badge,
          rulesHint,
          content: finalContent,
        };
      };

      const channels = {
        pikabu: getPostData(
          "pikabu",
          "Пикабу",
          "БЕЗ ССЫЛОК • ПРОМО START30",
          "Строго без ссылок (бан). Живой язык от 1-го лица, промокод START30 на 30% скидку."
        ),
        tenchat: getPostData(
          "tenchat",
          "TenChat",
          "ССЫЛКА В 1-Й КОММЕНТ • ЗЕВС",
          "Деловой разбор, буллеты, напоминание оставить ссылку в 1-м комментарии, вопрос в конце."
        ),
        linkedin: getPostData(
          "linkedin",
          "LinkedIn",
          "ХУК • БУЛЛЕТЫ С ✅ • БАЙТ",
          "Хук до кнопки «еще», буллеты с ✅, байт в комментариях: «Напишите должность — разберу»."
        ),
        vc: getPostData(
          "vc",
          "VC.ru / DTF",
          "КЕЙС 58% -> 94% • GOOGLE X-Y-Z",
          "Оцифрованные метрики, разбор ошибок, наглядный кейс до/после и результаты воронки."
        ),
        hashnode: getPostData(
          "hashnode",
          "Hashnode / Medium",
          "ENGLISH • TECHNICAL ARCHITECTURE",
          "In-depth English article on ATS heuristics, 55/15/15/15 formula, and parser architecture."
        ),
        indiehackers: getPostData(
          "indiehackers",
          "Indie Hackers",
          "BUILD IN PUBLIC • NO VERCEL LINKS",
          "Strictly NO .vercel.app links, NO forbidden promotional words ('free', 'discount'). MRR & tech focus."
        ),
        creative: getPostData(
          "creative",
          "Креативы (AI Image & Video)",
          "NANO BANANA • VEO / REELS 10 SEC",
          "Готовый арт-промпт для Nano Banana/Midjourney + покадровый сценарий вертикального ролика."
        ),
      };

      return NextResponse.json({
        success: true,
        source: "groq_llm",
        provider: `Groq AI (${usedModel.replace("openai/", "")})`,
        roleName: role,
        featureName: featureObj.label,
        tone,
        createdAt: new Date().toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
        }),
        channels,
      });
    }

    return NextResponse.json({
      success: true,
      source: "local_engine",
      provider: "LaunchPad Dynamic Engine",
      roleName: fallbackBatch.roleName,
      featureName: fallbackBatch.featureName,
      tone: fallbackBatch.tone,
      createdAt: fallbackBatch.createdAt,
      channels: fallbackBatch.channels,
    });
  } catch (err: any) {
    console.error("[PR Generate API Error]:", err);
    return NextResponse.json(
      { error: "Ошибка при генерации контент-пачки", details: err?.message },
      { status: 500 }
    );
  }
}
