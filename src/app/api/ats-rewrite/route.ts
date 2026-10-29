import { NextRequest, NextResponse } from "next/server";
import { cleanAIMarkdownArtifacts } from "@/lib/monetization";
import { createGroqClient, GROQ_MODELS } from "@/lib/server-ai-keys";
import { injectUserProfileIntoResume, extractCandidateName } from "@/lib/profile-utils";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action || "full_rewrite";
    const resumeText: string = (body.resumeText || body.resume || "").trim();
    const vacancyText: string = (body.vacancyText || body.jobDescription || body.jobDesc || "").trim();
    const missingSkills: string[] = Array.isArray(body.missingSkills) ? body.missingSkills : [];
    const skillToEmbed: string = (body.skillToEmbed || body.skill || "").trim();
    const candidateName: string = (
      body.candidateName ||
      body.name ||
      extractCandidateName(resumeText) ||
      ""
    ).trim();
    const candidateEmail: string = (body.candidateEmail || body.email || "").trim();
    const candidatePhone: string = (body.candidatePhone || body.phone || "").trim();
    const userApiKey: string = (
      body.userApiKey ||
      body.apiKey ||
      req.headers.get("x-groq-key") ||
      ""
    ).trim();

    if (!resumeText) {
      return NextResponse.json(
        { error: "Текст резюме обязателен" },
        { status: 400 }
      );
    }

    const groq = createGroqClient(userApiKey);

    // MODE 1: Single Skill Embedding
    if (action === "embed_skill") {
      if (!skillToEmbed) {
        return NextResponse.json(
          { error: "Параметр skillToEmbed обязателен" },
          { status: 400 }
        );
      }

      const systemPrompt = `You are an elite career strategist and technical recruiter.
Generate 1-2 realistic, high-impact bullet points for the candidate's work experience section that naturally demonstrate their practical mastery of the specified skill according to Google's X-Y-Z formula: "Accomplished [X] measured by [Y] doing [Z]".

STRICT RULES:
1. Write plain Russian text only. NEVER use Markdown asterisks (**), hashtags (#), or code blocks.
2. Start each bullet with "• ".
3. Include realistic quantifiable metrics (%, руб, млн, тыс, ч, x, сроки).
4. Seamlessly match the tone of the candidate's profession.`;

      const userPrompt = `Ключевой навык для внедрения: «${skillToEmbed}»
Целевая вакансия:
${vacancyText.slice(0, 1000) || "Профильная позиция"}

Контекст резюме кандидата (${candidateName || "Соискатель"}):
${resumeText.slice(0, 1200)}

Сгенерируй 1-2 мощных буллета для блока «Опыт работы», доказывающих практическое применение навыка «${skillToEmbed}» с оцифрованным бизнес-результатом по формуле X-Y-Z.`;

      for (const model of GROQ_MODELS) {
        try {
          const resp = await groq.chat.completions.create({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.3,
          });

          const bullet = resp.choices?.[0]?.message?.content?.trim();
          if (bullet) {
            return NextResponse.json({
              success: true,
              generatedBullet: cleanAIMarkdownArtifacts(bullet),
              skill: skillToEmbed,
              provider: `groq (${model})`,
            });
          }
        } catch (err: any) {
          console.warn(`[Groq embed_skill ${model} failed]:`, err?.message || err);
        }
      }

      // Fallback bullet if Groq was temporarily unreachable
      return NextResponse.json({
        success: true,
        generatedBullet: `• Успешно стандартизировал и применил инструменты «${skillToEmbed}» в ключевых рабочих процессах, сократив операционные издержки на 28% и обеспечив 100% выполнение целевых показателей.`,
        skill: skillToEmbed,
        provider: "deterministic_fallback",
      });
    }

    // MODE 2: Full ATS Resume Rewrite (Standard 88-96% Score)
    const skillsListStr =
      missingSkills.length > 0
        ? missingSkills.slice(0, 8).join(", ")
        : "ключевые требования и инструменты вакансии";

    const systemPrompt = `You are an elite executive career architect and ATS optimization engine.
Your task is to completely rewrite and elevate the candidate's resume for the target job description to achieve an 88-96% ATS match score.

STRICT RULES:
1. Output plain human Russian text only. NEVER use Markdown asterisks (**), hashtags (#), or code fences.
2. Structure in clean Harvard ATS single-column layout:
   - Первая строка: СТРОГО ФИО кандидата «${candidateName || "Сохрани имя из резюме"}» (КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО выдумывать чужие имена!)
   - Вторая строка: Должность и Контактная информация
   - ПРОФЕССИОНАЛЬНОЕ РЕЗЮМЕ / SUMMARY (3-4 high-impact lines with metrics)
   - ОПЫТ РАБОТЫ / EXPERIENCE (Keep real companies/dates intact; rewrite all bullets using Google X-Y-Z formula with quantified %, $, руб, млн, time metrics)
   - КЛЮЧЕВЫЕ КОМПЕТЕНЦИИ И НАВЫКИ / SKILLS (organically include: ${skillsListStr})
   - ОБРАЗОВАНИЕ / EDUCATION
3. Weave all missing requirements (${skillsListStr}) naturally into the experience bullets so the ATS engine verifies quotes in context.
4. Keep the candidate's real companies, roles, and dates intact. Elevate verbs to active achievements.`;

    const userPrompt = `ТАРГЕТ-ВАКАНСИЯ:
${vacancyText.slice(0, 2500) || "Профильная позиция"}

ОТСУТСТВУЮЩИЕ НАВЫКИ ДЛЯ ОРГАНИЧНОЙ ИНТЕГРАЦИИ В ОПЫТ:
${skillsListStr}

ФИО КАНДИДАТА: СТРОГО «${candidateName || "Сохрани имя из первой строки"}»

ТЕКУЩЕЕ РЕЗЮМЕ КАНДИДАТА:
${resumeText.slice(0, 3500)}

Перепиши резюме целиком в эталонный Harvard ATS стандарт, оцифруй результаты по формуле Google X-Y-Z и органично вплети все недостающие навыки внутрь опыта работы. Без звездочек (**) и решеток (#). Сохраняй точное ФИО кандидата!`;

    for (const model of GROQ_MODELS) {
      try {
        const resp = await groq.chat.completions.create({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.2,
        });

        const text = resp.choices?.[0]?.message?.content?.trim();
        if (text && text.length > 100) {
          let cleaned = cleanAIMarkdownArtifacts(text);
          if (candidateName) {
            cleaned = injectUserProfileIntoResume(cleaned, {
              name: candidateName,
              email: candidateEmail,
              phone: candidatePhone,
            });
          }
          return NextResponse.json({
            success: true,
            rewrittenResume: cleaned,
            provider: `groq (${model})`,
          });
        }
      } catch (err: any) {
        console.warn(`[Groq full_rewrite ${model} failed]:`, err?.message || err);
      }
    }

    return NextResponse.json(
      { error: "Не удалось переписать резюме через Groq" },
      { status: 502 }
    );
  } catch (error: any) {
    console.error("[ATS Rewrite Error]:", error);
    return NextResponse.json(
      { error: "Ошибка при улучшении резюме", details: error?.message },
      { status: 500 }
    );
  }
}
