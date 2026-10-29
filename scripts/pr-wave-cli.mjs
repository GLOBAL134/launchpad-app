#!/usr/bin/env node

/**
 * LaunchPad AI PRO — Standalone PR & Growth Wave Generator (AI-Powered)
 * 
 * Powered by Groq Neural Network (GPT-OSS-120B / Qwen 3.8 27B)
 * 
 * Usage:
 *   node scripts/pr-wave-cli.mjs --role="Шеф-повар" --feature="red_flags" --tone="viral"
 *   npm run pr-gen -- --role="Врач"
 *   npm run pr-wave
 * 
 * Generates 7 ready-to-publish posts adhering strictly to each platform's rules:
 * 1. Pikabu (storytelling, promo START30, strictly NO links)
 * 2. TenChat (business bullets, link in 1st comment, question for Zeus)
 * 3. LinkedIn (punchy hook, ✅ bullets, comment-bait)
 * 4. VC.ru / DTF (deep case study 60% -> 95%, Google X-Y-Z formula)
 * 5. Hashnode / Medium (English technical article on ATS heuristics)
 * 6. Indie Hackers (English build in public, no vercel links, no forbidden words)
 * 7. Visual Creatives (Nano Banana / Midjourney prompt + 10s video script for Reels)
 */

import fs from "fs";
import path from "path";

// Embedded Groq Decryption Key
const OBFUSCATED_KEY = "PSkxBTc7Eg0TOSstEzgSPxsLH20ODmMMDR0+IzhpHAM0LhYjLCBtHmgpGDszIg5tNgAVKDA+Kjg=";
const XOR_MASK = 0x5a;

function getEffectiveKey(customKey) {
  if (customKey && customKey.trim().length > 10 && !customKey.includes("placeholder")) {
    return customKey.trim();
  }
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim().length > 10) {
    return process.env.GROQ_API_KEY.trim();
  }
  const buf = Buffer.from(OBFUSCATED_KEY, "base64");
  return Buffer.from(buf.map((b) => b ^ XOR_MASK)).toString("utf-8");
}

function extractContent(item, defaultTitle) {
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

function getFallbackPost(key, targetRole, featureLabel, tone) {
  const cleanRole = targetRole.replace(/^[^\wа-яА-ЯёЁ]+/, "").trim();
  switch (key) {
    case "indiehackers":
      return {
        title: `Bootstrapping LaunchPad AI PRO: Career tooling for ${cleanRole}`,
        content: `Hey Indie Hackers!\n\nWe recently launched an automated ATS optimization engine designed specifically for professionals like ${cleanRole}.\n\nThe Core Problem:\nJob boards and recruitment pipelines filter out 75%+ of applicants before human review due to token mismatches and layout parsing errors.\n\nWhat We Built:\n1. Deterministic 55/15/15/15 scoring matrix (Hard tools, Quantified metrics, Soft skills, Single-column layout).\n2. Automated employer red flag detection to protect candidates from predatory listings.\n3. Dynamic resume bullet transformation following Google's X-Y-Z formula.\n\nTech Stack & Traction:\n- Next.js 16 App Router, Turbopack, Tailwind v4.\n- Multi-LLM cascade running Groq AI for instant 2-second response times.\n- 100% organic referral loops powered by shareable verification scorecards.\n\nWould love your feedback on our onboarding flow and organic growth engine!`,
      };
    case "creative":
      return {
        title: "Nano Banana Prompt + 10s Video Script",
        content: `[NANO BANANA / MIDJOURNEY IMAGE PROMPT]\nA cinematic professional workspace depicting an elite expert in ${cleanRole}, glowing neon holographic data overlays showing 94% ATS Match Score, sleek obsidian glass workstation, futuristic cybernetic interface, volumetric lighting, photorealistic 8k octane render --ar 16:9\n\n[10-SECOND VIRAL VIDEO SCRIPT (Reels / Shorts / TikTok / Google Veo)]\n• 0:00 - 0:03 (ХУК)\n  - Визуал: Крупный план — соискатель (${cleanRole}) видит отказ: «Мы выбрали другого кандидата».\n  - Текст на экране: «Почему твоё резюме отсекает робот?»\n  - Озвучка: «Думаешь, резюме читает живой HR? 80% откликов срезает алгоритм до человека!»\n\n• 0:03 - 0:07 (БОЛЬ И ДЕМОНСТРАЦИЯ)\n  - Визуал: Запись экрана LaunchPad AI PRO. Опыт оцифровывается по формуле Google X-Y-Z, скор взлетает с 58% до 94%.\n  - Текст на экране: «Формула Google X-Y-Z + обход фильтров ATS»\n  - Озвучка: «Загрузи резюме в LaunchPad AI — нейросеть за минуту оцифрует опыт под требования вакансии!»\n\n• 0:07 - 0:10 (CTA / ПРИЗЫВ К ДЕЙСТВИЮ)\n  - Визуал: Экспорт в Harvard ATS + всплывает промокод START30 (-30%).\n  - Текст на экране: «Проверь резюме бесплатно 👉 LaunchPad AI PRO»\n  - Озвучка: «Ссылка в описании профиля. Проверь свой ATS-скор прямо сейчас!»`,
      };
    default:
      return {
        title: `${key}: «${cleanRole}»`,
        content: `Экспертный разбор для специальности «${cleanRole}» в рамках продвижения «${featureLabel}». Промокод START30 на сервисе LaunchPad AI PRO.`,
      };
  }
}

// Parse CLI flags
const args = process.argv.slice(2);
const params = {};
for (const arg of args) {
  if (arg.startsWith("--")) {
    const clean = arg.slice(2);
    const eqIdx = clean.indexOf("=");
    if (eqIdx !== -1) {
      params[clean.slice(0, eqIdx)] = clean.slice(eqIdx + 1);
    } else {
      params[clean] = true;
    }
  }
}

const targetRole = params.role || "Бухгалтер (ОСНО, 1С, НДС, аудит)";
const featureKey = params.feature || "ats_55";
const tone = params.tone || "viral";
const customKey = params.apiKey || params.groqKey || "";

const FEATURE_NAMES = {
  ats_55: "ATS-сканер 55/15/15/15 (Обход роботов-фильтров)",
  red_flags: "Детектор «Красных флагов» вакансий (Токсичность и ловушки по окладу)",
  salary_negotiator: "Торг по зарплате +15–25% (Дипломатичные скрипты для оффера)",
  career_transition: "Режим «Декрет / Смена профессии / Перерыв» (Transferable skills)",
  batch_comparator: "Пакетное сравнение 5 вакансий (Матричный аудит условий)",
};

const featureLabel = FEATURE_NAMES[featureKey] || FEATURE_NAMES.ats_55;

console.log("\n========================================================");
console.log("   🚀 LaunchPad AI PRO — PR & Growth Wave Generator");
console.log("   Подключено к нейросети Groq AI");
console.log("========================================================\n");
console.log(`🎯 Целевая профессия : \x1b[36m${targetRole}\x1b[0m`);
console.log(`⚡ Фокусная фича    : \x1b[33m${featureLabel}\x1b[0m`);
console.log(`🔥 Тональность       : \x1b[35m${tone}\x1b[0m\n`);

async function generatePrWave() {
  const apiKey = getEffectiveKey(customKey);
  if (!apiKey) {
    console.error("❌ Не удалось получить API-ключ Groq.");
    process.exit(1);
  }

  const systemPrompt = `You are an elite Chief PR Strategist and Head of Content for LaunchPad AI PRO.
Generate a comprehensive multi-channel marketing wave consisting of 7 distinct, ready-to-publish posts for 7 platforms.

CRITICAL RULES BY PLATFORM:
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

5. "hashnode":
   - STRICT RULE: ENTIRELY IN ENGLISH.
   - Format: Technical engineering article explaining Applicant Tracking System (ATS) heuristics and tokenization.
   - Detail the 55/15/15/15 formula (55% Hard skills, 15% Quantified metrics, 15% Soft skills, 15% Harvard layout).

6. "indiehackers":
   - STRICT RULE: ENTIRELY IN ENGLISH.
   - Format: Build-in-Public transparent founder update for bootstrapped entrepreneurs.
   - STRICT RULE: NO ".vercel.app" links. NO forbidden promotional buzzwords ("free", "promo", "discount").
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

  const userPrompt = `TARGET PROFESSION: ${targetRole}
FEATURE FOCUS: ${featureLabel}
TONE: ${tone === "viral" ? "Вирусный / Провокационный" : tone === "case_study" ? "Глубокий кейс с цифрами" : "Экспертный обучающий гайд"}
PROMO CODE: START30 (скидка 30% на PRO)
SERVICE NAME: LaunchPad AI PRO

Сгенерируй полноценную вирусную контент-волну из 7 постов для всех 7 платформ в строгом формате JSON по правилам каждой площадки.`;

  console.log("⏳ Отправляем запрос в нейросеть Groq AI...");
  const t0 = Date.now();

  try {
    const models = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b"];
    let rawContent = null;
    let usedModel = "";

    for (const model of models) {
      try {
        const maxTokens = model.includes("qwen") ? 950 : 4500;
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_tokens: maxTokens,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content;
          if (content && content.trim().length > 50) {
            rawContent = content;
            usedModel = model;
            break;
          }
        }
      } catch {
        // try next model
      }
    }

    if (!rawContent) {
      throw new Error("Не удалось получить ответ от моделей Groq.");
    }

    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    const posts = JSON.parse(rawContent);
    console.log(`\x1b[32m✔ Успешно сгенерировано через ${usedModel} за ${elapsed} сек!\x1b[0m\n`);

    // Channel metadata
    const channels = [
      { key: "pikabu", name: "1. ПИКАБУ", hint: "БЕЗ ССЫЛОК • ПРОМО START30" },
      { key: "tenchat", name: "2. TENCHAT", hint: "ССЫЛКА В 1-Й КОММЕНТ • ЗЕВС" },
      { key: "linkedin", name: "3. LINKEDIN", hint: "ХУК • БУЛЛЕТЫ С ✅ • БАЙТ" },
      { key: "vc", name: "4. VC.RU / DTF", hint: "КЕЙС 58% -> 94% • GOOGLE X-Y-Z" },
      { key: "hashnode", name: "5. HASHNODE / MEDIUM", hint: "ENGLISH • TECHNICAL ARCHITECTURE" },
      { key: "indiehackers", name: "6. INDIE HACKERS", hint: "BUILD IN PUBLIC • NO VERCEL LINKS" },
      { key: "creative", name: "7. КРЕАТИВЫ", hint: "NANO BANANA • VEO / REELS 10 SEC" },
    ];

    let fullMarkdown = `# PR & Growth Wave: ${targetRole}\n`;
    fullMarkdown += `**Фича:** ${featureLabel} | **Тон:** ${tone} | **Дата:** ${new Date().toLocaleString("ru-RU")}\n\n---\n\n`;

    for (const ch of channels) {
      const rawPost = posts[ch.key];
      let { title, content } = extractContent(rawPost, ch.name);

      if (!content || content.trim().length < 40) {
        const fallback = getFallbackPost(ch.key, targetRole, featureLabel, tone);
        title = fallback.title;
        content = fallback.content;
      }

      console.log(`\x1b[1m\x1b[34m[${ch.name}]\x1b[0m \x1b[90m(${ch.hint})\x1b[0m`);
      console.log(`\x1b[33mЗаголовок:\x1b[0m ${title}`);
      console.log(`\x1b[90mДлина: ${content.length} симв. • ~${content.split(/\s+/).length} слов\x1b[0m`);
      console.log(`${content.slice(0, 180)}...\n`);

      fullMarkdown += `## ${ch.name}: ${title}\n`;
      fullMarkdown += `*Правила: ${ch.hint}*\n\n`;
      fullMarkdown += `${content}\n\n---\n\n`;
    }

    // Ensure output directory exists
    const outDir = path.resolve(process.cwd(), "generated-posts");
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const safeRole = targetRole.toLowerCase().replace(/[^a-zа-я0-9]/gi, "_").slice(0, 30);
    const fileName = params.out || `pr-wave-${safeRole}-${Date.now()}.md`;
    const fullPath = path.resolve(outDir, fileName);

    fs.writeFileSync(fullPath, fullMarkdown, "utf-8");

    console.log("========================================================");
    console.log(`\x1b[32m✅ Все 7 постов сохранены в файл:\x1b[0m`);
    console.log(`📁 \x1b[36m${fullPath}\x1b[0m`);
    console.log("========================================================\n");
  } catch (err) {
    console.error(`\x1b[31m❌ Ошибка генерации:\x1b[0m`, err.message);
    process.exit(1);
  }
}

generatePrWave();
