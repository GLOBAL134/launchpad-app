/**
 * PR & Growth Content Engine for LaunchPad AI PRO
 * Generates ready-to-publish content for 7 social and developer platforms:
 * 1. Pikabu (storytelling, promo START30, strictly NO links)
 * 2. TenChat (business bullets, link in 1st comment, closing question)
 * 3. LinkedIn (punchy hook, ✅ bullets, comment-bait for engagement)
 * 4. VC.ru / DTF (in-depth case study with numbers 60% -> 95% and XYZ formula)
 * 5. Hashnode / Medium (English technical career deep dive)
 * 6. Indie Hackers (English build-in-public, no vercel.app links, no "free/promo/discount")
 * 7. Visual Creatives (Nano Banana image prompt + 10-sec storyboard script for Veo / Shorts)
 */

export interface PrChannelContent {
  id: "pikabu" | "tenchat" | "linkedin" | "vc" | "hashnode" | "indiehackers" | "creative";
  title: string;
  platformName: string;
  badge: string;
  rulesHint: string;
  content: string;
  extraMeta?: {
    imagePrompt?: string;
    videoScript?: string;
  };
}

export interface PrBatchResult {
  roleName: string;
  featureName: string;
  createdAt: string;
  channels: Record<string, PrChannelContent>;
}

export const PR_TARGET_ROLES = [
  { id: "accountant", label: "💼 Бухгалтер (ОСНО, 1С, НДС, аудит)" },
  { id: "sales", label: "📈 Менеджер по продажам / РОП (B2B, CRM, сделки)" },
  { id: "marketing", label: "🎯 Маркетолог / Head of Marketing (Директ, SEO, CPL)" },
  { id: "lawyer", label: "⚖️ Корпоративный юрист (Договоры, Арбитраж, Комплаенс)" },
  { id: "logistics", label: "🚛 Руководитель логистики / ВЭД (SCM, Склад, Инкотермс)" },
  { id: "hr", label: "👥 HR-директор / Рекрутер (Подбор, ATS-системы, Адаптация)" },
  { id: "engineer", label: "⚙️ Инженер / Главный инженер (ПТО, ГОСТ, Автоматизация)" },
  { id: "executive", label: "👔 Руководитель / Директор (P&L, Стратегия, Управление)" },
  { id: "it", label: "💻 IT-специалист (Senior PM, Разработчик, Архитектура)" },
];

export const PR_FEATURES = [
  {
    id: "ats_55",
    label: "🎯 ATS-сканер 55/15/15/15",
    desc: "HR-роботы отсекают 80% резюме до человека из-за сиротских навыков и двух колонок",
  },
  {
    id: "red_flags",
    label: "🚩 Детектор «Красных флагов» вакансий",
    desc: "Распознавание скрытой токсичности, неоплачиваемых переработок и ловушек по окладу",
  },
  {
    id: "salary_negotiator",
    label: "💰 Торг по зарплате +15–25%",
    desc: "Дипломатичные скрипты для переписки и созвона с обоснованием ценности",
  },
  {
    id: "career_transition",
    label: "🔄 Режим «Декрет / Смена профессии / Перерыв»",
    desc: "Упаковка опыта через transferable skills без белых пятен в трудовой",
  },
  {
    id: "batch_comparator",
    label: "📊 Пакетное сравнение 5 вакансий",
    desc: "Матричный аудит условий, рисков и реальной совместимости с кандидатом",
  },
];

/**
 * Parses structured AI response or builds tailored fallback wave
 */
export function buildPrBatchWave(
  roleLabel: string,
  featureId: string,
  rawAiText?: string
): PrBatchResult {
  const feature = PR_FEATURES.find((f) => f.id === featureId) || PR_FEATURES[0];
  const roleClean = roleLabel.replace(/^[^\wа-яА-ЯёЁ]+/, "").trim();

  // Try extracting sections from AI raw text if structured tags exist
  const extractedPikabu = extractSection(rawAiText, "PIKABU");
  const extractedTenchat = extractSection(rawAiText, "TENCHAT");
  const extractedLinkedin = extractSection(rawAiText, "LINKEDIN");
  const extractedVc = extractSection(rawAiText, "VC");
  const extractedHashnode = extractSection(rawAiText, "HASHNODE");
  const extractedIndieHackers = extractSection(rawAiText, "INDIEHACKERS");
  const extractedCreative = extractSection(rawAiText, "CREATIVE");

  // Fallbacks guaranteed to be high-converting and channel-compliant
  const pikabuContent =
    extractedPikabu ||
    `Как я искал работу (${roleClean}) и случайно вскрыл причину, почему 80% резюме режут роботы ещё до живого HR

Если вы прямо сейчас отправляете отклики на вакансии и в ответ получаете только гробовую тишину или автоматический отказ через 3 минуты — не спешите сомневаться в своей квалификации. Скорее всего, ваше резюме даже не открыл человек.

Я сам работаю в этой сфере не первый год. Месяц назад решил обновить портфолио и закинуть удочки. Из 30 откликов — ровно 2 вялых просмотра. Я не выдержал, связался со знакомой, которая рулит подбором в крупном холдинге, и спросил напрямую: «Что не так?». 

Она рассмеялась и показала изнутри их корпоративную систему ATS (Applicant Tracking System). Оказалось:
1. Красивые двухколоночные шаблоны из Canva с прогресс-барами робот читает как кашу из символов.
2. Если в требованиях написано «1С:Бухгалтерия 8.3 / AmoCRM / SCM», а у вас просто «отличные навыки владения ПК» — алгоритм ставит скор 25% и автоматически отправляет резюме в архив.
3. Опыт без оцифрованных результатов (без знаков %, руб., x) считается «водой».

В итоге наткнулся на сервис LaunchPad AI. Там есть независимый ATS-сканер, который прогоняет текст по формуле роботов 55/15/15/15 (Hard Skills, цифры, Soft Skills, верстка). Прогнал своё резюме — скор был 58%. Сервис одной кнопкой переписал буллеты по формуле Google X-Y-Z и вплёл недостающие ключевики. На следующий день откликнулся с новым вариантом — 6 приглашений на интервью из 10 за одну неделю.

Полезная фишка: у них сейчас действует промокод START30 на скидку 30% на PRO-версию.
Прямых ссылок не даю, кому интересно — сервис называется LaunchPad AI PRO, легко гуглится в два счёта. Всем удачи в поисках адекватных работодателей!`;

  const tenchatContent =
    extractedTenchat ||
    `Почему кандидаты с 10-летним стажем проигрывают новичкам на первом этапе отбора? (${roleClean})

В TenChat много спорят о кризисе найма, но мало кто говорит о технической стороне воронки. 

В 2026 году первичный фильтр резюме в 75% средних и крупных компаний выполняют ATS-алгоритмы (Workday, Taleo, E-Staff, Поток). Рекрутер видит только топ-5 кандидатов с наивысшим Match Score.

Вместе с командой мы проанализировали более 1 500 резюме в категории «${roleClean}» и выделили 4 критические ошибки:

1. Сиротские навыки (Orphan Skills)
Навык указан в плашке «Обо мне», но ни разу не упоминается в контексте конкретных задач и результатов в блоке «Опыт работы». Для ATS-парсера такой навык имеет нулевой вес.

2. Отсутствие формулы Google X-Y-Z
Вместо «Занимался ведением учета и договоров» алгоритм ждет: «Достиг [X], измеряемого [Y], путем совершения [Z]». Например: «Сократил время закрытия отчетного периода на 35%, автоматизировав первичную документацию через ЭДО».

3. Скрытые «красные флаги» в вакансиях
Часто сам кандидат тратит время на токсичные вакансии с ловушками («доход без потолка», «ненормированный день», «стрессоустойчивость»). 

4. Двухколоночная верстка и графические элементы
Таблицы, иконки и диаграммы превращают текст в кракозябры при парсинге. 

⚡️ Для решения этой боли разработан сервис LaunchPad AI PRO: он проверяет резюме глазами робота ATS по стандарту 55/15/15/15 и за 1 минуту оцифровывает буллеты опыта.

👉 Ссылку на бесплатный интерактивный сканер прикрепил в первом комментарии к этой записи. 

Коллеги, сталкивались ли вы с тем, что сильных профессионалов срезают на этапе формального скоринга? Делитесь в комментариях!`;

  const linkedinContent =
    extractedLinkedin ||
    `78% резюме отсеиваются роботами ещё до того, как их увидит живой рекрутер. 

Особенно это бьёт по сильным экспертам в сфере: ${roleClean}.

Вы можете быть блестящим профессионалом с 7+ годами опыта, но если ваше резюме не откалибровано под алгоритмы ATS (Applicant Tracking Systems), конверсия в собеседования будет стремиться к нулю.

Вот что мы внедрили в LaunchPad AI PRO, чтобы гарантировать кандидатам 90%+ Match Score:

✅ Формула Google X-Y-Z: автоматическая оцифровка буллетов опыта с доказанными метриками.
✅ Харвардский одноколоночный стандарт: идеальное распознавание любым корпоративным парсером (Workday, Taleo, Greenhouse).
✅ Детектор Red Flags: мгновенный рентген текста вакансии на токсичность и скрытые переработки.
✅ Вплетение недостающих Hard Skills без выдумок и спама.

Результат: кандидаты получают в 3 раза больше приглашений на интервью в первые 14 дней.

🔥 Хотите проверить ваше резюме? 
Напишите в комментариях вашу текущую должность — я прогоню её через ATS-матрицу LaunchPad AI и пришлю вам в личные сообщения персональный чек-лист ключевых навыков!`;

  const vcContent =
    extractedVc ||
    `Кейс: как мы подняли ATS-скор резюме с 60% до 95% за 2 минуты и привели кандидата к офферу (+20% к окладу)

Сфера: ${roleClean}
Проблема: 40+ откликов на HeadHunter и Хабр Карьере, 3 просмотра, 0 приглашений на технический созвон.
Инструмент: платформа карьерной аналитики LaunchPad AI PRO

Что показал первичный аудит ATS:
Исходный скор резюме составлял всего 60% из 100%. Роботы E-Staff и Поток отсеивали резюме по следующим причинам:
• 8 ключевых навыков из вакансии отсутствовали в блоке «Опыт работы» (были только в подвале резюме).
• Полное отсутствие оцифрованных результатов в достижениях (глаголы действия без метрик $, %, x).
• Двухколоночный шаблон с иконками, который парсер прочитал со смещением абзацев на 4 строки.

Что сделал алгоритм LaunchPad AI:
1. Переупаковал опыт по формуле Google X-Y-Z («Сделал X, измеренное через Y, с помощью Z»).
2. Органично встроил обязательные требования вакансии прямо в описание выполненных проектов.
3. Прогнал вакансию через Детектор красных флагов и отфильтровал 2 сомнительных предложения со скрытыми переработками.
4. Сгенерировал дипломатичный скрипт для торга по зарплате при получении оффера.

Итог:
Балл соответствия вырос с 60% до 95%. Кандидат сделал 12 точечных откликов с адаптированным резюме и персональным сопроводительным письмом:
• 8 приглашений на первый этап интервью (конверсия 66%).
• 2 финальных оффера через 3 недели.
• Успешный торг: оклад согласован на 22% выше первоначального предложения работодателя.

Протестировать аудит своего резюме можно на сайте LaunchPad AI PRO.`;

  const hashnodeContent =
    extractedHashnode ||
    `Why ATS Bots Reject 75% of Resumes Before Any Human Sees Them (and How We Engineered a 95% Match Score Engine)

Target Role Domain: ${roleClean}

The modern talent acquisition funnel is powered by automated applicant tracking systems (ATS)—Workday, Taleo, Greenhouse, and Lever. To human candidates, an application is a career story; to an ATS parser, it is an unstructured string of tokens evaluated against boolean keyword matrices.

In this deep dive, we explore why high-performing professionals get silently rejected, and how we engineered LaunchPad AI PRO to achieve a deterministic 95%+ match score.

1. The 55/15/15/15 ATS Scoring Formula
Our engine evaluates resumes across four mathematically weighted dimensions:
- Hard Skills Keyword Density (55%): Verifying verified technical skills directly in context of work history.
- Quantifiable Metrics (15%): Detecting numeric achievements (%, $, throughput, cycle time reduction).
- Soft Skills & Process Ownership (15%): Cross-functional leadership, agile execution, stakeholder alignment.
- Harvard Single-Column Layout (15%): Eliminating multi-column tables, text frames, and graphics that break tokenizers.

2. The Google X-Y-Z Bullet Point Optimization
Weak bullet: "Responsible for managing projects and team deliveries."
Engineered bullet: "Spearheaded ${roleClean} deliverables across 4 cross-functional teams, reducing delivery lead time by 32% and increasing quarterly retention to 94%."

3. Client-Side HTML5 Canvas Verification
Beyond text rewriting, candidates generate verifiable ATS Score Cards rendered client-side on HTML5 Canvas—exportable as 1200x630 LinkedIn posts and 1080x1920 mobile stories.

Try the open ATS analyzer on LaunchPad AI PRO.`;

  const indiehackersContent =
    extractedIndieHackers ||
    `Building LaunchPad AI: How we automated resume ATS audits and reached viral candidate adoption

Hey Indie Hackers!

Two months ago, I started investigating why job seekers across technical and non-technical sectors (${roleClean}) were facing brutal rejection rates despite strong career experience.

The core insight: corporate ATS algorithms filter out candidates based on strictly defined keyword topologies and layout compatibility. Most job hunters don't need generic career advice—they need transparent, instant feedback on how their resume parses inside algorithmic screening engines.

Here is what we built with LaunchPad AI PRO:
1. Multi-LLM Cascade: We engineered a fallback cascade utilizing Llama 3.3 70B and Gemini Flash to rewrite resume bullets according to Google's X-Y-Z framework in under 2 seconds.
2. Heuristic Parser Simulator: Evaluates resumes against 55/15/15/15 industry benchmarks (Hard Skills, Metric Quantification, Leadership, Layout Integrity).
3. Client-Side Scorecards: Instead of boring PDF reports, users generate verified social badges on HTML5 Canvas to share on LinkedIn, driving high organic peer-to-peer discovery.
4. Red Flag Job Scanner: Automatically flags toxic job postings (unpaid overtime, vague commission structures, missing boundaries).

Our organic traffic loop:
When candidates boost their ATS score from ~60% to 92%+, they unlock bonus scans by sharing their verified score badge with peers. This single mechanism reduced our CAC to almost zero.

Happy to answer questions on the tech stack (Next.js 16 App Router, Turbopack, Tailwind v4) and how we balance client-side performance with AI pipelines!`;

  const creativePrompt =
    extractedCreative ||
    `[NANO BANANA / MIDJOURNEY IMAGE PROMPT]
A sleek futuristic holographic scanner interface analyzing a minimalist resume document for "${roleClean}", glowing neon cyan and emerald green match score rings showing "95% ATS MATCH", dark obsidian glass background, cybernetic UI data nodes, cinematic studio lighting, photorealistic 8k octane render, hyper-detailed commercial aesthetics --ar 16:9 --style raw

[10-SECOND VIRAL VIDEO SCRIPT (Reels / Shorts / TikTok / Google Vids / Veo)]
• 0:00 - 0:03 (HOOK)
  - Visual: Split screen. Left: frustrated person staring at "Отклик отклонён" email. Right: close-up on robot eyes scanning text.
  - On-screen Text: «Почему твоё резюме отклоняют за 2 минуты?»
  - Voiceover: «Думаешь, твоё резюме читает живой HR? Нет, тебя срезает робот-сканер!»

• 0:03 - 0:07 (PAIN & DEMO)
  - Visual: Screen recording of LaunchPad AI ATS-сканер. Red missing keywords glow and instantly turn bright emerald green. Match score jumps from 61% to 94%.
  - On-screen Text: «Формула Google X-Y-Z + обход фильтров ATS»
  - Voiceover: «Загрузи резюме в LaunchPad AI — нейросеть за 60 секунд оцифрует опыт и обойдёт фильтры роботов!»

• 0:07 - 0:10 (CALL TO ACTION)
  - Visual: Clean Harvard ATS resume exporting in 1 click + promo code badge START30 glowing.
  - On-screen Text: «Проверь своё резюме бесплатно 👉 LaunchPad AI PRO»
  - Voiceover: «Ссылка в профиле. Проверь свой скор прямо сейчас!»`;

  return {
    roleName: roleClean,
    featureName: feature.label,
    createdAt: new Date().toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }),
    channels: {
      pikabu: {
        id: "pikabu",
        title: `Пикабу: Сторителлинг для ${roleClean}`,
        platformName: "Пикабу",
        badge: "БЕЗ ССЫЛОК • ПРОМО START30",
        rulesHint: "Строго без ссылок (бан). Живой язык от 1-го лица, промокод START30 на 30% скидку.",
        content: pikabuContent,
      },
      tenchat: {
        id: "tenchat",
        title: `TenChat: Экспертный разбор для ${roleClean}`,
        platformName: "TenChat",
        badge: "ССЫЛКА В 1-Й КОММЕНТ • ЗЕВС",
        rulesHint: "Деловой разбор, буллеты, напоминание оставить ссылку в 1-м комментарии, вопрос в конце.",
        content: tenchatContent,
      },
      linkedin: {
        id: "linkedin",
        title: `LinkedIn: Вирусный хук для ${roleClean}`,
        platformName: "LinkedIn",
        badge: "ХУК • БУЛЛЕТЫ С ✅ • БАЙТ",
        rulesHint: "Хук до кнопки «еще», буллеты с ✅, байт в комментариях: «Напишите должность — разберу».",
        content: linkedinContent,
      },
      vc: {
        id: "vc",
        title: `VC.ru / DTF: Кейс с цифрами (60% -> 95%)`,
        platformName: "VC.ru / DTF",
        badge: "КЕЙС 60% -> 95% • GOOGLE X-Y-Z",
        rulesHint: "Оцифрованные метрики, разбор ошибок, наглядный кейс до/после и результаты воронки.",
        content: vcContent,
      },
      hashnode: {
        id: "hashnode",
        title: `Hashnode / Medium: Technical Career Deep Dive`,
        platformName: "Hashnode / Medium",
        badge: "ENGLISH • TECHNICAL ARCHITECTURE",
        rulesHint: "In-depth English article on ATS heuristics, 55/15/15/15 formula, and parser architecture.",
        content: hashnodeContent,
      },
      indiehackers: {
        id: "indiehackers",
        title: `Indie Hackers: Build in Public Update`,
        platformName: "Indie Hackers",
        badge: "BUILD IN PUBLIC • NO VERCEL LINKS",
        rulesHint: "Strictly NO .vercel.app links, NO forbidden promotional words ('free', 'discount'). MRR & tech focus.",
        content: indiehackersContent,
      },
      creative: {
        id: "creative",
        title: `Креативы: Nano Banana Prompt + 10s Video Script`,
        platformName: "Креативы (AI Image & Video)",
        badge: "NANO BANANA • VEO / REELS 10 SEC",
        rulesHint: "Готовый арт-промпт для Nano Banana/Midjourney + покадровый сценарий вертикального ролика.",
        content: creativePrompt,
      },
    },
  };
}

function extractSection(text: string | undefined, tag: string): string | null {
  if (!text) return null;
  const regex = new RegExp(`===${tag}===([\\s\\S]*?)(?:===|$)`, "i");
  const match = text.match(regex);
  if (match && match[1] && match[1].trim().length > 40) {
    return match[1].trim();
  }
  return null;
}
