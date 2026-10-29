/**
 * Client helper for invoking the free LLM cascade:
 * /api/ai -> (Groq / Gemini / Pollinations POST / Pollinations GET / Local NLP)
 */

import { cleanAIMarkdownArtifacts } from "./monetization";

export interface AICallOptions {
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  mode?: "text" | "json";
}

export interface AICallResponse {
  text: string;
  provider: string;
}

export async function callAI(options: AICallOptions): Promise<AICallResponse> {
  const { systemPrompt, userPrompt, temperature = 0.3, mode = "text" } = options;

  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemPrompt,
        userPrompt,
        temperature,
        mode,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        text: cleanAIMarkdownArtifacts(data.text || ""),
        provider: data.provider || "api",
      };
    }
  } catch (err) {
    console.warn("[Client callAI failed to reach /api/ai]:", err);
  }

  // Direct client-side Pollinations GET backup if server endpoint is unreachable
  try {
    const combined = `${systemPrompt || "You are a career assistant"}\n\n${userPrompt}`;
    const url = `https://text.pollinations.ai/${encodeURIComponent(combined.slice(0, 600))}?model=openai-fast`;
    const clientRes = await fetch(url);
    if (clientRes.ok) {
      const text = await clientRes.text();
      if (text && !text.includes("Free limit reached") && !text.includes("SERVICE_UNAVAILABLE")) {
        return {
          text: cleanAIMarkdownArtifacts(text),
          provider: "client_pollinations",
        };
      }
    }
  } catch {
    // ignore
  }

  // Graceful fallback
  return {
    text: "• Успешно оптимизировал профильные рабочие процессы, увеличив операционную эффективность на 30% и обеспечив своевременное выполнение плановых нормативов.",
    provider: "client_fallback",
  };
}
