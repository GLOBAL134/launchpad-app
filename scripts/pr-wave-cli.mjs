#!/usr/bin/env node

/**
 * LaunchPad AI PRO — Standalone PR & Growth Wave Generator CLI
 * 
 * Usage:
 *   node scripts/pr-wave-cli.mjs --role="Менеджер по продажам" --feature=red_flags --tone=viral
 *   npm run pr-wave
 * 
 * Generates 7 ready-to-publish posts:
 * 1. Pikabu (storytelling, promo START30, strictly NO links)
 * 2. TenChat (business bullets, link in 1st comment, question for Zeus)
 * 3. LinkedIn (punchy hook, ✅ bullets, comment-bait)
 * 4. VC.ru / DTF (deep case study 60% -> 95%, Google X-Y-Z formula)
 * 5. Hashnode / Medium (English technical article on ATS heuristics)
 * 6. Indie Hackers (English build in public, no vercel links, no forbidden words)
 * 7. Visual Creatives (Nano Banana prompt + 10s video script for Veo / Reels)
 */

import fs from "fs";
import path from "path";

// Parse CLI flags
const args = process.argv.slice(2);
const params = {};
for (const arg of args) {
  if (arg.startsWith("--")) {
    const [key, val] = arg.slice(2).split("=");
    params[key] = val || true;
  }
}

const targetRole = params.role || "Менеджер по продажам / РОП";
const featureKey = params.feature || "ats_55";
const tone = params.tone || "viral";
const outputFile = params.out || `pr-wave-${Date.now()}.md`;
const groqKey = params.groqKey || process.env.GROQ_API_KEY || "";
const geminiKey = params.geminiKey || process.env.GEMINI_API_KEY || "";

console.log("\n🚀 ========================================================");
console.log("   LaunchPad AI PRO — PR & Growth Wave Generator");
console.log("========================================================\n");
console.log(`🎯 Целевая профессия : ${targetRole}`);
console.log(`⚡ Фокусная фича    : ${featureKey}`);
console.log(`🔥 Тональность       : ${tone}`);
console.log(`💾 Выходной файл     : ${outputFile}\n`);

// Comprehensive domain dictionary for accurate terminology
const DOMAINS = {
  sales: {
    category: "B2B-продажи и коммерция",
    heroRole: "Менеджер по B2B-продажам / РОП",
    tools: ["AmoCRM", "Bitrix24", "C-Level переговоры", "воронка продаж", "скрипты продаж", "LTV", "дебиторка"],
    metrics: ["перевыполнение плана KPI на 135%", "рост выручки с 38 до 54 млн руб.", "сокращение цикла сделки с 35 до 14 дней", "средний чек 2.5 млн руб."],
    redFlags: "«доход без потолка при МРОТ 25 000 руб.», «холодная база без лидогенерации и маркетинга», «ненормированный день без выходных»",
    weakBullet: "Занимался развитием клиентской базы, проведением переговоров и выполнением плана.",
    strongBullet: "Выстроил воронку в AmoCRM и закрыл 18 сделок со средним чеком 2.5 млн руб., перевыполнив план KPI на 135% и увеличив годовую выручку с 38 до 54 млн руб.",
    salaryBefore: "130 000 ₽",
    salaryAfter: "185 000 ₽ (+42%)",
    imagePrompt: "A high-tech digital sales pipeline command dashboard, glowing neon cyan and emerald revenue graphs jumping 135%, holographic CRM nodes",
  },
  accountant: {
    category: "Бухгалтерия и аудит",
    heroRole: "Главный бухгалтер (ОСНО, 1С, НДС)",
    tools: ["1С:Бухгалтерия 8.3", "1С:ЗУП", "ОСНО", "УСН", "расчет НДС", "налог на прибыль", "ЭДО (Диадок, СБИС)", "ФНС"],
    metrics: ["сопровождение оборота 480 млн руб.", "предотвращение налоговых разрывов на 6.8 млн руб.", "закрытие периода за 3 дня вместо 10", "4 камеральные проверки без штрафов"],
    redFlags: "«материальная ответственность за 3 юрлица сразу без доплаты», «размытые обязанности финдиректора при окладе рядового бухгалтера»",
    weakBullet: "Вела бухгалтерский и налоговый учет, сдавала отчетность в налоговую и фонды.",
    strongBullet: "Организовала учет по ОСНО и УСН с годовым оборотом 480 млн руб., предотвратив налоговые разрывы на 6.8 млн руб. и сократив время закрытия месяца с 10 до 3 дней через ЭДО.",
    salaryBefore: "110 000 ₽",
    salaryAfter: "150 000 ₽ (+36%)",
    imagePrompt: "A clean minimalist financial audit ledger with glowing emerald verification badges, 100% tax compliance hologram, obsidian modern desktop",
  },
  marketing: {
    category: "Маркетинг и Лидогенерация",
    heroRole: "Head of Marketing / Performance-маркетолог",
    tools: ["Яндекс.Директ", "VK Реклама", "сквозная аналитика", "Яндекс.Метрика", "GA4", "Telegram Ads", "A/B-тесты", "CPL / CAC / ROMI"],
    metrics: ["управление бюджетом 6.5 млн руб./мес.", "снижение CPL на 34%", "рост конверсии посадочной страницы с 2.3% до 5.1%", "привлечение 9 200 лидов в месяц"],
    redFlags: "«маркетолог-оркестр: настраивает Директ, ведет SMM, монтирует Reels и отвечает на звонки за 50к», «KPI привязаны к выручке без рекламного бюджета»",
    weakBullet: "Настраивала контекстную и таргетированную рекламу, анализировала трафик и вела соцсети.",
    strongBullet: "Масштабировала каналы Яндекс.Директ и VK Реклама при бюджете 6.5 млн руб./мес., снизив стоимость лида (CPL) на 34% и обеспечив приток 9 200 квалифицированных заявок.",
    salaryBefore: "140 000 ₽",
    salaryAfter: "195 000 ₽ (+39%)",
    imagePrompt: "Futuristic growth marketing analytics matrix, glowing neon conversion funnel rising upward, holographic traffic nodes and ROI charts",
  },
  lawyer: {
    category: "Юриспруденция и Право",
    heroRole: "Корпоративный юрист / Ведущий юрисконсульт",
    tools: ["Арбитражные суды", "договорная работа", "претензионно-исковая деятельность", "комплаенс", "ФАС", "ТК РФ", "ГК РФ", "ВЭД"],
    metrics: ["сопровождение портфеля контрактов на 920 млн руб.", "94% выигранных судебных дел", "предотвращение взыскания 48 млн руб.", "ускорение согласования на 42%"],
    redFlags: "«совмещение обязанностей юриста и кадровика», «ненормированный рабочий день без компенсаций и дежурства по выходным»",
    weakBullet: "Составлял договоры, вел претензионную переписку и участвовал в судебных заседаниях.",
    strongBullet: "Сопроводил более 350 сложных договоров поставки и подряда на 920 млн руб., выиграл 22 арбитражных спора (94% побед) и предотвратил убытки компании на 48 млн руб.",
    salaryBefore: "135 000 ₽",
    salaryAfter: "180 000 ₽ (+33%)",
    imagePrompt: "A striking legal scale of justice made of glowing titanium and neon blue cyber glass, corporate contract compliance hologram",
  },
  logistics: {
    category: "Логистика и Цепочки поставок",
    heroRole: "Руководитель отдела логистики и ВЭД",
    tools: ["SCM", "WMS системы", "Инкотермс (FOB, CIF, DAP)", "таможенное оформление", "мультимодальные перевозки", "OTIF 98%"],
    metrics: ["управление складом 14 000 кв.м", "грузооборот 210 тонн/сутки", "экономия бюджета на 15.6 млн руб./год", "соблюдение OTIF 98.7%"],
    redFlags: "«материальная ответственность за задержки сторонних перевозчиков», «круглосуточная доступность на связи без дежурных смен»",
    weakBullet: "Контролировал отгрузки со склада, работал с транспортными компаниями и таможней.",
    strongBullet: "Внедрил адресное хранение WMS на складе 14 000 кв.м, оптимизировал мультимодальные маршруты ВЭД по Инкотермс и снизил издержки на 15.6 млн руб. при OTIF 98.7%.",
    salaryBefore: "125 000 ₽",
    salaryAfter: "170 000 ₽ (+36%)",
    imagePrompt: "A dynamic global supply chain map with glowing cyan cargo routes, automated high-tech robotic warehouse interior, 8k render",
  },
  hr: {
    category: "Управление персоналом и HR",
    heroRole: "HR-директор / Руководитель подбора (HRBP)",
    tools: ["Huntflow", "E-Staff", "Поток", "Cost-per-Hire", "Time-to-Fill", "оценка 360", "грейдинг", "eNPS", "онбординг", "HR-бренд"],
    metrics: ["закрытие 190 вакансий в год", "сокращение Time-to-Fill с 42 до 17 дней", "снижение Cost-per-Hire на 30%", "удержание на испытательном сроке 94%"],
    redFlags: "«закрытие 45 вакансий в месяц в одиночку без бюджета на работные сайты», «отсутствие бюджета на корпоративное обучение и онбординг»",
    weakBullet: "Проводила собеседования, вела кадровое делопроизводство и занималась адаптацией.",
    strongBullet: "Внедрила ATS Huntflow и сквозную аналитику воронки найма, сократив срок закрытия вакансий с 42 до 17 дней и повысив retention испытательного срока до 94%.",
    salaryBefore: "130 000 ₽",
    salaryAfter: "175 000 ₽ (+35%)",
    imagePrompt: "A futuristic talent acquisition interface showing candidate match networks, glowing emerald scorecards and neural organization tree",
  },
  engineer: {
    category: "Инженерия и Производство",
    heroRole: "Главный инженер проекта / Ведущий инженер-конструктор",
    tools: ["AutoCAD", "Компас-3D", "SolidWorks", "Revit", "ЕСКД", "СПДС", "разделы ТХ/АТХ", "Главгосэкспертиза", "авторский надзор"],
    metrics: ["проектирование 5 объектов на 1.3 млрд руб.", "4 заключения Главгосэкспертизы с 1-го раза", "экономия на материалах 16 млн руб.", "0 рекламаций при ПНР"],
    redFlags: "«ненормированные командировки на стройплощадки за свой счет», «совмещение функций ГИПа и инженера по охране труда»",
    weakBullet: "Разрабатывал чертежи и схемы, согласовывал документацию и выезжал на объекты.",
    strongBullet: "Спроектировал 5 промышленных комплексов с бюджетом 1.3 млрд руб., защитил проекты в Главгосэкспертизе с первого предъявления и сэкономил 16 млн руб. сметы в SolidWorks.",
    salaryBefore: "140 000 ₽",
    salaryAfter: "190 000 ₽ (+36%)",
    imagePrompt: "High-tech engineering blueprint glowing with neon cyan schematic lines, 3D industrial robot prototype rendering in holographic viewport",
  },
  executive: {
    category: "Топ-менеджмент и Руководство",
    heroRole: "Операционный директор (COO) / Заместитель генерального",
    tools: ["Управление P&L", "1С:ERP", "Lean / Kaizen", "Six Sigma", "EBITDA", "сквозные KPI", "координация 500+ человек", "стратегическое планирование"],
    metrics: ["оборот 3.1 млрд руб.", "рост EBITDA на 4.9 п.п.", "экономия 26 млн руб./год за счет бережливого производства", "рост производительности труда на 28%"],
    redFlags: "«субсидиарная ответственность по долгам прошлых собственников», «KPI без полномочий на изменение бюджета и структуры»",
    weakBullet: "Руководил операционной деятельностью компании, контролировал отделы и ставил задачи.",
    strongBullet: "Управлял дивизионом из 14 филиалов (штат 480 человек, оборот 3.1 млрд руб.), повысил EBITDA на 4.9 п.п. и сэкономил 26 млн руб./год за счет внедрения Lean и 1С:ERP.",
    salaryBefore: "320 000 ₽",
    salaryAfter: "440 000 ₽ (+37%)",
    imagePrompt: "Executive boardroom of the future overlooking a cyber city skyline, glowing obsidian interactive table showing financial growth curves",
  },
  it: {
    category: "IT и Технологии",
    heroRole: "Senior Product Manager / Tech Lead",
    tools: ["Product Strategy", "Roadmap", "CustDev", "Scrum", "PRD", "Unit-экономика", "A/B-тестирование", "SQL", "Docker", "Kubernetes", "CI/CD"],
    metrics: ["рост DAU с 7 000 до 55 000", "рост конверсии в оплату на 25%", "сокращение time-to-market фичи с 5 недель до 8 дней", "LTV вырос на 31%"],
    redFlags: "«круглосуточная доступность для хотфиксов без дежурной ставки», «требование совмещать разработку, проджект и продюсерство»",
    weakBullet: "Управлял разработкой продукта, писал технические задания и проводил созвоны с командой.",
    strongBullet: "Руководил продуктовым роадмапом SaaS-платформы, внедрил A/B-тестирование и сократил time-to-market с 5 недель до 8 дней, увеличив DAU с 7 000 до 55 000 пользователей.",
    salaryBefore: "260 000 ₽",
    salaryAfter: "340 000 ₽ (+31%)",
    imagePrompt: "A modern developer terminal and product roadmap canvas glowing with cyan code branches, architectural cloud microservice mesh",
  },
};

function getDomain(roleStr) {
  const r = roleStr.toLowerCase();
  if (r.includes("продаж") || r.includes("sales") || r.includes("роп")) return DOMAINS.sales;
  if (r.includes("бухгалтер") || r.includes("accountant")) return DOMAINS.accountant;
  if (r.includes("маркетолог") || r.includes("marketing") || r.includes("cmo")) return DOMAINS.marketing;
  if (r.includes("юрист") || r.includes("lawyer") || r.includes("legal")) return DOMAINS.lawyer;
  if (r.includes("логист") || r.includes("logistics")) return DOMAINS.logistics;
  if (r.includes("hr") || r.includes("кадр") || r.includes("рекрутер")) return DOMAINS.hr;
  if (r.includes("инженер") || r.includes("engineer") || r.includes("гип")) return DOMAINS.engineer;
  if (r.includes("директор") || r.includes("руководител") || r.includes("executive")) return DOMAINS.executive;
  if (r.includes("it") || r.includes("разработчик") || r.includes("pm") || r.includes("dev")) return DOMAINS.it;

  return {
    category: `Сфера «${roleStr}»`,
    heroRole: roleStr,
    tools: ["профильные регламенты", "отраслевое ПО", "контроль качества", "управление процессами"],
    metrics: ["повышение эффективности на 32%", "сокращение сроков выполнения на 38%", "выполнение KPI на 125%"],
    redFlags: "«размытые обязанности за двоих сотрудников», «ненормированный график без компенсаций»",
    weakBullet: `Выполнял задачи в сфере ${roleStr}, решал текущие вопросы.`,
    strongBullet: `Стандартизировал ключевые рабочие процессы по направлению «${roleStr}», сократив временные издержки на 35% и обеспечив выполнение целевых KPI на 125%.`,
    salaryBefore: "120 000 ₽",
    salaryAfter: "165 000 ₽ (+37%)",
    imagePrompt: `A futuristic workspace depicting an elite expert in ${roleStr}, neon cyan holographic data nodes, 8k render`,
  };
}

const prof = getDomain(targetRole);
const toolsStr = prof.tools.slice(0, 4).join(", ");
const metricStr = prof.metrics[0];

console.log("⚡ Генерируем 7 постов для площадок...\n");

const posts = {
  pikabu: `# 1. ПИКАБУ (Сторителлинг, START30, СТРОГО БЕЗ ССЫЛОК)

Как я искал работу (${prof.heroRole}) и вскрыл причину, почему 80% резюме отсекают роботы ещё до живого HR

Если вы прямо сейчас отправляете отклики по специальности «${prof.heroRole}» и в ответ получаете только гробовую тишину или автоматический отказ через 5 минут — не спешите сомневаться в своём профессионализме. Скорее всего, ваше резюме даже не открыл человек.

Я сам в этой сфере не первый год. Месяц назад решил сменить компанию и закинул удочки. Из 25 откликов — ровно 2 вялых просмотра и ноль звонков. Я не выдержал, связался со знакомой, которая руководит подбором в крупном холдинге, и прямо спросил: «Что со мной не так? Опыт солидный, косяков нет».

Она рассмеялась и показала изнутри их корпоративную систему ATS (Applicant Tracking System). Оказалось:
1. Красивые двухколоночные шаблоны из Canva с цветными шкалами навыков алгоритм парсит как бессвязную кашу из символов.
2. Если в вакансии требуются ${toolsStr}, а у вас написано общими словами вроде «уверенный пользователь ПК» — система ставит резюме балл соответствия 30% и автоматически сваливает его в архив отказников.
3. Опыт без оцифрованных результатов (без конкретных цифр %, руб., x) считается системой «водой».

В итоге наткнулся на сервис LaunchPad AI PRO. Там есть независимый ATS-сканер, который анализирует текст по стандарту 55/15/15/15 (Hard Skills, оцифровка Google X-Y-Z, Soft Skills и Harvard-верстка) и сразу находит скрытые красные флаги работодателя (${prof.redFlags}).

Прогнал своё резюме — балл был всего 56%. Сервис за 1 минуту переписал буллеты опыта по формуле Google:
• Было: «${prof.weakBullet}»
• Стало: «${prof.strongBullet}»

На следующий день разослал обновленный вариант: из 10 откликов получил 7 приглашений на интервью за одну неделю.

Полезная фишка: у них сейчас работает промокод START30 на скидку 30% на PRO-доступ.
Прямых ссылок не даю (на Пикабу за это сразу бан), сервис называется LaunchPad AI PRO, находится в Яндексе в два счёта. Всем удачи и адекватных офферов!`,

  tenchat: `# 2. TENCHAT (Деловой экспертный разбор, ссылка в 1-м комментарии, вопрос)

Почему эксперты с 8-летним стажем проигрывают новичкам на первом этапе отбора? (${prof.heroRole})

В TenChat часто говорят о кризисе найма, но мало кто обсуждает техническую сторону отсева соискателей.

В 2026 году первичный фильтр резюме в 75% средних и крупных компаний выполняют ATS-алгоритмы (Workday, Taleo, E-Staff, Поток). Рекрутер видит только топ-5 кандидатов с максимальным Match Score.

Вместе с командой мы исследовали свыше 1 200 откликов в категории «${prof.category}» и выделили 4 критические ошибки опытных кандидатов:

1. Сиротские ключевые навыки (Orphan Skills)
Кандидат указывает ${toolsStr} в плашке «Обо мне», но ни разу не упоминает их в конкретных задачах и результатах в блоке «Опыт работы». Для ATS-парсера такой навык имеет нулевой вес.

2. Отсутствие формулы Google X-Y-Z
Вместо описания обязанностей алгоритм ждёт доказанную формулу: «Достиг [X], измеряемого [Y], путем совершения [Z]».
Пример оцифровки:
❌ «${prof.weakBullet}»
✅ «${prof.strongBullet}»

3. Скрытые «красные флаги» в вакансиях
Кандидаты часто тратят недели на токсичные вакансии с ловушками: ${prof.redFlags}.

4. Двухколоночная верстка и графические элементы
Таблицы, прогресс-бары и текстовые блоки превращаются в кракозябры при парсинге.

⚡️ Для решения этой боли разработан сервис LaunchPad AI PRO: он проверяет резюме глазами роботов ATS по формуле 55/15/15/15, оцифровывает буллеты и подсвечивает подводные камни работодателя.

👉 Ссылку на интерактивный сканер резюме для вашей профессии прикрепил в первом комментарии к этой записи 👇

Коллеги, сталкивались ли вы с тем, что сильных специалистов срезают на этапе формального скоринга? Делитесь в комментариях!`,

  linkedin: `# 3. LINKEDIN (Хук в первых строках, буллеты с ✅, коммент-байт)

78% резюме отсеиваются роботами ещё до того, как их увидит живой рекрутер. 

Особенно тяжело это бьёт по сильным экспертам в сфере: ${prof.heroRole}.

Вы можете иметь за плечами впечатляющий трекшн (${metricStr}), но если ваше резюме не откалибровано под алгоритмы ATS (Applicant Tracking Systems), конверсия в интервью будет около нуля.

Вот что мы внедрили в LaunchPad AI PRO, чтобы кандидаты получали 92%+ Match Score:

✅ Формула Google X-Y-Z: автоматическая оцифровка буллетов опыта с доказанными метриками.
✅ Одноколоночный Harvard-стандарт: идеальное распознавание любым корпоративным парсером (Workday, Taleo, Greenhouse).
✅ Детектор Red Flags: мгновенный рентген текста вакансии на токсичность и переработки (${prof.redFlags}).
✅ Вплетение целевых навыков (${toolsStr}) прямо в контекст проектов.
✅ Дипломатичный скрипт торга по зарплате при получении оффера (${prof.salaryBefore} ➔ ${prof.salaryAfter}).

Результат: кандидаты получают в 3 раза больше приглашений на интервью уже в первые 10 дней.

🔥 Хотите проверить ваше резюме? 
Напишите в комментариях вашу текущую должность — я прогоню её через ATS-матрицу LaunchPad AI и пришлю вам в личные сообщения персональный чек-лист ключевых навыков!`,

  vc: `# 4. VC.RU / DTF (Глубокий кейс с цифрами 58% ➔ 94%, Google X-Y-Z)

Кейс: как соискатель (${prof.heroRole}) поднял ATS-скор резюме с 58% до 94% за 2 минуты и согласовал оффер ${prof.salaryAfter}

Сфера: ${prof.category}
Кандидат: опыт 6+ лет, подтвержденные результаты (${metricStr}).
Проблема: 38 откликов на HeadHunter и Хабр Карьере, 4 просмотра, 0 приглашений на технический созвон.
Инструмент: платформа карьерной аналитики LaunchPad AI PRO.

1. Что показал аудит алгоритмами ATS
Исходный скор резюме составлял 58% из 100%. Роботы E-Staff и Поток отсеивали кандидата по трем причинам:
• Отсутствовали ключевые термины: ${toolsStr}.
• Опыт описан через процесс, а не результат (глаголы действия без конкретных оцифрованных показателей).
• Двухколоночный шаблон с иконками, который парсер прочитал со смещением строк.

2. Что сделал алгоритм LaunchPad AI PRO:
• Переписал буллеты опыта по формуле Google X-Y-Z:
  Было: «${prof.weakBullet}»
  Стало: «${prof.strongBullet}»
• Встроил недостающие профильные компетенции прямо в контекст выполненных задач.
• Проверил вакансию через Детектор красных флагов: отсеял сомнительные условия (${prof.redFlags}).
• Сформировал дипломатичные аргументы для торга по зарплате при получении оффера.

3. Итог:
Балл соответствия вырос с 58% до 94%. Кандидат сделал 12 точечных откликов:
• 8 приглашений на первый этап интервью (конверсия 66%).
• 2 финальных оффера через 3 недели.
• Зарплата согласована на уровне ${prof.salaryAfter} (вместо стартовых ${prof.salaryBefore}).

Протестировать независимый ATS-сканер резюме для вашей профессии можно на платформе LaunchPad AI PRO.`,

  hashnode: `# 5. HASHNODE / MEDIUM (Technical Article in English)

Why ATS Algorithms Reject 75% of Qualified Candidates Before a Human Sees Them (${prof.category})

Target Career Domain: ${prof.heroRole}

In modern recruitment funnels, applicant tracking systems (ATS)—such as Workday, Taleo, Greenhouse, and Lever—act as automated gatekeepers. While human candidates perceive a resume as a career narrative, an algorithmic tokenizer processes it as an unstructured string of tokens evaluated against keyword density matrices and layout heuristics.

In this technical breakdown, we examine why high-caliber professionals in ${prof.category} get rejected, and how we engineered LaunchPad AI PRO to achieve a deterministic 92%+ match rate.

1. The 55/15/15/15 ATS Scoring Benchmark
Our engine benchmarks resumes across four distinct dimensions:
- Hard Skills Topology (55%): Verifying verified context for core competencies (${toolsStr}).
- Metric Quantification (15%): Detecting numeric achievements (${metricStr}).
- Soft Skills & Process Ownership (15%): Cross-functional coordination, problem-solving, and SLA adherence.
- Single-Column Harvard Layout (15%): Eliminating multi-column HTML/PDF frames that induce token displacement.

2. The Google X-Y-Z Bullet Point Transformation
Weak Candidate Input:
"${prof.weakBullet}"

Engineered ATS Output:
"${prof.strongBullet}"

3. Automated Employer Red Flag Detection
Candidates also face informational asymmetry. LaunchPad AI incorporates heuristic token matching to detect predatory job conditions (${prof.redFlags}), protecting job seekers before they invest interview bandwidth.

Explore the open interactive ATS engine on LaunchPad AI PRO.`,

  indiehackers: `# 6. INDIE HACKERS (Build in Public, NO Vercel Links, NO Forbidden Words)

Building LaunchPad AI: How we automated resume ATS audits for ${prof.category} and built an organic growth loop

Hey Indie Hackers!

Two months ago, I started investigating why job seekers across specialized roles (${prof.heroRole}) were facing 80%+ silent rejection rates despite strong career backgrounds.

The core problem: corporate ATS platforms filter out applicants based on strict token heuristics and layout rules. Most job hunters don't need fluffy career advice—they need transparent, instant feedback on how algorithmic parsers evaluate their experience against target job descriptions.

What we built with LaunchPad AI PRO:
1. Multi-LLM Career Cascade: We engineered a fallback pipeline combining Llama 3.3 70B and Gemini Flash to rewrite resume bullets according to Google's X-Y-Z framework in under 2 seconds.
2. 55/15/15/15 Heuristic Simulator: Evaluates resumes across Hard Skills (${toolsStr}), Metric Quantification (${metricStr}), Leadership, and Layout Integrity.
3. Employer Red Flag Scanner: Automatically flags predatory job listings (${prof.redFlags}) so candidates avoid toxic environments.
4. Client-Side HTML5 Canvas Scorecards: Users can generate verified social proof badges exportable to LinkedIn.

Our Growth Loop:
When candidates optimize their resume score from ~58% to 92%+, they unlock bonus evaluation scans by sharing their verified score badge with peers. This peer-to-peer viral mechanism drives qualified candidate referrals without paid acquisition spend.

Tech stack: Next.js 16 App Router, Turbopack, Tailwind v4, client-side PDF/DOCX extractors.

Happy to answer questions about prompt engineering, keyword extraction algorithms, and building tools for job seekers!`,

  creative: `# 7. КРЕАТИВЫ (Nano Banana Prompt + 10s Video Script for Veo / Reels)

[NANO BANANA / MIDJOURNEY IMAGE PROMPT]
${prof.imagePrompt}, sleek obsidian glass holographic user interface analyzing a resume for "${prof.heroRole}", glowing neon cyan and emerald green match score rings displaying "94% ATS MATCH", futuristic cybernetic data nodes, cinematic studio lighting, photorealistic 8k octane render, hyper-detailed commercial tech aesthetics --ar 16:9 --style raw

[10-SECOND VIRAL VIDEO SCRIPT (Reels / Shorts / TikTok / Google Vids / Veo)]
• 0:00 - 0:03 (ХУК)
  - Визуал: Крупный план: соискатель (${prof.heroRole}) с недоумением смотрит на отказ в почте: «Мы выбрали другого кандидата».
  - Текст на экране: «Почему твоё резюме отклоняют за 2 минуты?»
  - Озвучка: «Думаешь, твоё резюме читает живой HR? Нет, тебя срезает робот-сканер ещё до человека!»

• 0:03 - 0:07 (БОЛЬ И ДЕМОНСТРАЦИЯ)
  - Визуал: Запись экрана сервиса LaunchPad AI PRO. Загружается резюме. Красные недостающие навыки (${toolsStr}) мгновенно вплетаются в опыт, скор подлетает с 58% до 94%.
  - Текст на экране: «Формула Google X-Y-Z + обход фильтров ATS»
  - Озвучка: «Загрузи резюме в LaunchPad AI — нейросеть за минуту оцифрует буллеты и обойдёт фильтры роботов!»

• 0:07 - 0:10 (CTA / ПРИЗЫВ К ДЕЙСТВИЮ)
  - Визуал: Чистый экспорт в Harvard ATS формат + всплывает бейдж с промокодом START30 (-30%).
  - Текст на экране: «Проверь резюме бесплатно 👉 LaunchPad AI PRO»
  - Озвучка: «Ссылка в профиле. Проверь свой ATS-скор прямо сейчас!»`,
};

const fullOutput = Object.values(posts).join("\n\n---\n\n");

// Write to file
fs.writeFileSync(path.resolve(process.cwd(), outputFile), fullOutput, "utf-8");

console.log("✅ Все 7 постов успешно сгенерированы по правилам площадок!");
console.log(`📁 Сохранено в файл: ${outputFile}`);
console.log(`📊 Размер: ${fullOutput.length} символов\n`);
