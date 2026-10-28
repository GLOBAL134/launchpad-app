import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { cleanAIMarkdownArtifacts } from '@/lib/monetization';
import { analyzeATSDeterministically } from '@/lib/ats-engine';

const SYSTEM_PROMPT = `You are a world-class Applicant Tracking System (ATS) auditor and executive career strategist.
Write plain human text only. NEVER use Markdown asterisks (**), hashtags (#), or backticks in the output.

Compare the provided candidate resume with the target job description.
Return a STRICT raw JSON response (no backticks, no code fence, no Markdown) adhering to this schema:
{
  "score": number (0-100),
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "criticalIssues": string[],
  "improvements": [
    {
      "category": string,
      "original": string,
      "suggested": string,
      "reason": string
    }
  ],
  "coverLetter": string
}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      resumeText,
      jobDescription,
      jobTitle = 'Специалист',
      companyName = 'Компания',
      language = 'ru',
    } = body;

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Необходимо передать текст резюме и описание вакансии' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim().length > 10 && !apiKey.includes('placeholder')) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const prompt = `${SYSTEM_PROMPT}

Target Job Title: ${jobTitle}
Company: ${companyName}
Desired Language: ${language}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}`;

        const response = await model.generateContent(prompt);
        const rawText = response.response.text();
        const cleanedJsonText = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
        const data = JSON.parse(cleanedJsonText);

        const cleanResult = {
          score: Number(data.score) || 75,
          matchedKeywords: Array.isArray(data.matchedKeywords) ? data.matchedKeywords : [],
          missingKeywords: Array.isArray(data.missingKeywords) ? data.missingKeywords : [],
          criticalIssues: (Array.isArray(data.criticalIssues) ? data.criticalIssues : []).map(
            (s: string) => cleanAIMarkdownArtifacts(String(s))
          ),
          improvements: (Array.isArray(data.improvements) ? data.improvements : []).map(
            (imp: { category?: string; original?: string; suggested?: string; reason?: string }) => ({
              category: cleanAIMarkdownArtifacts(String(imp.category || '')),
              original: cleanAIMarkdownArtifacts(String(imp.original || '')),
              suggested: cleanAIMarkdownArtifacts(String(imp.suggested || '')),
              reason: cleanAIMarkdownArtifacts(String(imp.reason || '')),
            })
          ),
          coverLetter: cleanAIMarkdownArtifacts(String(data.coverLetter || '')),
        };

        return NextResponse.json(cleanResult);
      } catch (geminiError) {
        console.warn('[Gemini Analyze Fallback]:', geminiError);
      }
    }

    const fallbackResult = analyzeATSDeterministically({
      resumeText,
      jobDescription,
      jobTitle,
      companyName,
      language,
    });

    return NextResponse.json(fallbackResult);
  } catch (error) {
    console.error('[Analyze API Error]:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера при анализе резюме' },
      { status: 500 }
    );
  }
}
