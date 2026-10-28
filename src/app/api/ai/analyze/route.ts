import { NextRequest, NextResponse } from 'next/server';
import { runDeterministicATSAnalysis } from '@/lib/ats-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const resumeText = String(body.resumeText || '').trim();
    const jobDescription = String(body.jobDescription || '').trim();
    const jobTitle = String(body.jobTitle || 'Специалист').trim();
    const companyName = String(body.companyName || 'Компания').trim();
    const language: 'ru' | 'en' = body.language === 'en' ? 'en' : 'ru';

    if (resumeText.length < 80) {
      return NextResponse.json(
        { error: 'Текст резюме слишком короткий (минимум 80 символов). Загрузите полное резюме.' },
        { status: 400 }
      );
    }

    if (jobDescription.length < 40) {
      return NextResponse.json(
        { error: 'Описание вакансии слишком короткое (минимум 40 символов).' },
        { status: 400 }
      );
    }

    // 1. Всегда выполняем точный детерминированный расчёт по тексту (никаких галлюцинаций в цифрах)
    const baseResult = runDeterministicATSAnalysis({
      resumeText,
      jobDescription,
      jobTitle,
      companyName,
      language,
    });

    // 2. Если настроен OPENAI_API_KEY, дополнительно улучшаем сопроводительное письмо и советы через LLM
    const openAiKey = process.env.OPENAI_API_KEY;
    if (openAiKey) {
      try {
        const llmResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            temperature: 0.15,
            response_format: { type: 'json_object' },
            messages: [
              {
                role: 'system',
                content: `Ты — экспертный карьерный ассистент. Напиши персонализированное сопроводительное письмо и 3 точечных улучшения формулировок СТРОГО по фактам резюме кандидата. Никогда не приписывай кандидату навыки из списка отсутствующих (${baseResult.missingHardSkills.join(', ')}). Верни JSON: { "coverLetter": string, "improvements": [{ "section": string, "originalSnippet": string, "suggestedRewrite": string, "reason": string }] }`,
              },
              {
                role: 'user',
                content: `Вакансия: ${jobTitle} в ${companyName}\nОписание вакансии:\n${jobDescription.slice(0, 3000)}\n\nРезюме кандидата:\n${resumeText.slice(0, 4000)}`,
              },
            ],
          }),
        });

        if (llmResponse.ok) {
          const data = await llmResponse.json();
          const parsed = JSON.parse(data.choices[0].message.content);
          if (parsed.coverLetter) baseResult.coverLetter = parsed.coverLetter;
          if (Array.isArray(parsed.improvements) && parsed.improvements.length > 0) {
            baseResult.improvements = parsed.improvements;
          }
          baseResult.engineUsed = 'ai_verified';
        }
      } catch (aiErr) {
        console.warn('[AI Enrichment Fallback to Deterministic NLP]:', aiErr);
      }
    }

    return NextResponse.json(baseResult);
  } catch (error) {
    console.error('[ATS Analyze Error]:', error);
    return NextResponse.json(
      { error: 'Не удалось обработать запрос анализа резюме.' },
      { status: 500 }
    );
  }
}
