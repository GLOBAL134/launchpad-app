/**
 * PR & Growth Content Engine for LaunchPad AI PRO
 * Generates tailored, high-converting, platform-compliant content for 7 channels:
 * 1. Pikabu (storytelling, promo START30, strictly NO links)
 * 2. TenChat (business bullets, link in 1st comment, closing question for Zeus algorithm)
 * 3. LinkedIn (punchy hook, ✅ bullets, comment-bait for viral engagement)
 * 4. VC.ru / DTF (in-depth case study with numbers 60% -> 95% and Google X-Y-Z formula)
 * 5. Hashnode / Medium (English technical career deep dive)
 * 6. Indie Hackers (English build-in-public, no vercel.app links, no "free/promo/discount")
 * 7. Visual Creatives (Nano Banana image prompt + 10-sec storyboard script for Veo / Reels)
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
  tone: string;
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

interface DomainProfile {
  category: string;
  heroRole: string;
  targetRole: string;
  tools: string[];
  metrics: string[];
  painPoints: string;
  redFlagsSample: string;
  weakBullet: string;
  strongBullet: string;
  salaryBefore: string;
  salaryAfter: string;
  imagePromptTheme: string;
}

const DOMAIN_KNOWLEDGE: Record<string, DomainProfile> = {
  sales: {
    category: "B2B-продажи и коммерция",
    heroRole: "Менеджер по B2B-продажам / РОП",
    targetRole: "Руководитель отдела корпоративных продаж (Head of Sales)",
    tools: ["AmoCRM", "Bitrix24", "C-Level переговоры", "воронка продаж", "скрипты продаж", "LTV", "дебиторка"],
    metrics: ["перевыполнение плана KPI на 135%", "рост выручки с 38 до 54 млн руб.", "сокращение цикла сделки с 35 до 14 дней", "средний чек 2.5 млн руб."],
    painPoints: "отсутствие оцифровки в рублях и конверсиях в резюме, ключевик AmoCRM затерян в хобби, сиротские навыки холодных переговоров",
    redFlagsSample: "«доход без потолка при МРОТ 25 000 руб.», «холодная база без лидогенерации и маркетинга», «ненормированный день без выходных»",
    weakBullet: "Занимался развитием клиентской базы, проведением переговоров и выполнением плана.",
    strongBullet: "Выстроил воронку в AmoCRM и закрыл 18 сделок со средним чеком 2.5 млн руб., перевыполнив план KPI на 135% и увеличив годовую выручку с 38 до 54 млн руб.",
    salaryBefore: "130 000 ₽",
    salaryAfter: "185 000 ₽ (+42%)",
    imagePromptTheme: "A high-tech digital sales pipeline command dashboard, glowing neon cyan and emerald revenue graphs jumping 135%, holographic CRM nodes",
  },
  accountant: {
    category: "Бухгалтерия и аудит",
    heroRole: "Главный бухгалтер (ОСНО, 1С, НДС)",
    targetRole: "Финансовый контролер / Главный бухгалтер холдинга",
    tools: ["1С:Бухгалтерия 8.3", "1С:ЗУП", "ОСНО", "УСН", "расчет НДС", "налог на прибыль", "ЭДО (Диадок, СБИС)", "ФНС"],
    metrics: ["сопровождение оборота 480 млн руб.", "предотвращение налоговых разрывов на 6.8 млн руб.", "закрытие периода за 3 дня вместо 10", "4 камеральные проверки без штрафов"],
    painPoints: "двухколоночные шаблоны из Canva сбивают парсер в кашу, нет названий конкретных регистров и систем ЭДО в опыте",
    redFlagsSample: "«материальная ответственность за 3 юрлица сразу без доплаты», «размытые обязанности финдиректора при окладе рядового бухгалтера»",
    weakBullet: "Вела бухгалтерский и налоговый учет, сдавала отчетность в налоговую и фонды.",
    strongBullet: "Организовала учет по ОСНО и УСН с годовым оборотом 480 млн руб., предотвратив налоговые разрывы на 6.8 млн руб. и сократив время закрытия месяца с 10 до 3 дней через ЭДО.",
    salaryBefore: "110 000 ₽",
    salaryAfter: "150 000 ₽ (+36%)",
    imagePromptTheme: "A clean minimalist financial audit ledger with glowing emerald verification badges, 100% tax compliance hologram, obsidian modern desktop",
  },
  marketing: {
    category: "Маркетинг и Лидогенерация",
    heroRole: "Head of Marketing / Performance-маркетолог",
    targetRole: "Директор по маркетингу (CMO)",
    tools: ["Яндекс.Директ", "VK Реклама", "сквозная аналитика", "Яндекс.Метрика", "GA4", "Telegram Ads", "A/B-тесты", "CPL / CAC / ROMI"],
    metrics: ["управление бюджетом 6.5 млн руб./мес.", "снижение CPL на 34%", "рост конверсии посадочной страницы с 2.3% до 5.1%", "привлечение 9 200 лидов в месяц"],
    painPoints: "метрики указаны без абсолютных цифр бюджетов, отсутствие ключевиков сквозной аналитики и сплит-тестов в буллетах",
    redFlagsSample: "«маркетолог-оркестр: настраивает Директ, ведет SMM, монтирует Reels и отвечает на звонки за 50к», «KPI привязаны к выручке без рекламного бюджета»",
    weakBullet: "Настраивала контекстную и таргетированную рекламу, анализировала трафик и вела соцсети.",
    strongBullet: "Масштабировала каналы Яндекс.Директ и VK Реклама при бюджете 6.5 млн руб./мес., снизив стоимость лида (CPL) на 34% и обеспечив приток 9 200 квалифицированных заявок.",
    salaryBefore: "140 000 ₽",
    salaryAfter: "195 000 ₽ (+39%)",
    imagePromptTheme: "Futuristic growth marketing analytics matrix, glowing neon conversion funnel rising upward, holographic traffic nodes and ROI charts",
  },
  lawyer: {
    category: "Юриспруденция и Право",
    heroRole: "Корпоративный юрист / Ведущий юрисконсульт",
    targetRole: "Руководитель юридического департамента (Head of Legal)",
    tools: ["Арбитражные суды", "договорная работа", "претензионно-исковая деятельность", "комплаенс", "ФАС", "ТК РФ", "ГК РФ", "ВЭД"],
    metrics: ["сопровождение портфеля контрактов на 920 млн руб.", "94% выигранных судебных дел", "предотвращение взыскания 48 млн руб.", "ускорение согласования на 42%"],
    painPoints: "формальные термины без указания видов договоров (поставка, подряд, ВЭД) и без сумм защищенных интересов компании",
    redFlagsSample: "«совмещение обязанностей юриста и кадровика», «ненормированный рабочий день без компенсаций и дежурства по выходным»",
    weakBullet: "Составлял договоры, вел претензионную переписку и участвовал в судебных заседаниях.",
    strongBullet: "Сопроводил более 350 сложных договоров поставки и подряда на 920 млн руб., выиграл 22 арбитражных спора (94% побед) и предотвратил убытки компании на 48 млн руб.",
    salaryBefore: "135 000 ₽",
    salaryAfter: "180 000 ₽ (+33%)",
    imagePromptTheme: "A striking legal scale of justice made of glowing titanium and neon blue cyber glass, corporate contract compliance hologram",
  },
  logistics: {
    category: "Логистика и Цепочки поставок",
    heroRole: "Руководитель отдела логистики и ВЭД",
    targetRole: "Директор по логистике и SCM (Supply Chain Director)",
    tools: ["SCM", "WMS системы", "Инкотермс (FOB, CIF, DAP)", "таможенное оформление", "мультимодальные перевозки", "OTIF 98%"],
    metrics: ["управление складом 14 000 кв.м", "грузооборот 210 тонн/сутки", "экономия бюджета на 15.6 млн руб./год", "соблюдение OTIF 98.7%"],
    painPoints: "отсутствие кодов Инкотермс и названий WMS в описании опыта, общие фразы «организация поставок» вместо метрик соблюдения сроков",
    redFlagsSample: "«материальная ответственность за задержки сторонних перевозчиков», «круглосуточная доступность на связи без дежурных смен»",
    weakBullet: "Контролировал отгрузки со склада, работал с транспортными компаниями и таможней.",
    strongBullet: "Внедрил адресное хранение WMS на складе 14 000 кв.м, оптимизировал мультимодальные маршруты ВЭД по Инкотермс и снизил издержки на 15.6 млн руб. при OTIF 98.7%.",
    salaryBefore: "125 000 ₽",
    salaryAfter: "170 000 ₽ (+36%)",
    imagePromptTheme: "A dynamic global supply chain map with glowing cyan cargo routes, automated high-tech robotic warehouse interior, 8k render",
  },
  hr: {
    category: "Управление персоналом и HR",
    heroRole: "HR-директор / Руководитель подбора (HRBP)",
    targetRole: "Директор по персоналу (HRD)",
    tools: ["Huntflow", "E-Staff", "Поток", "Cost-per-Hire", "Time-to-Fill", "оценка 360", "грейдинг", "eNPS", "онбординг", "HR-бренд"],
    metrics: ["закрытие 190 вакансий в год", "сокращение Time-to-Fill с 42 до 17 дней", "снижение Cost-per-Hire на 30%", "удержание на испытательном сроке 94%"],
    painPoints: "отсутствие оцифрованных метрик воронки найма (Time-to-Fill, Offer Acceptance Rate), нет названий внедренных ATS-систем",
    redFlagsSample: "«закрытие 45 вакансий в месяц в одиночку без бюджета на работные сайты», «отсутствие бюджета на корпоративное обучение и онбординг»",
    weakBullet: "Проводила собеседования, вела кадровое делопроизводство и занималась адаптацией.",
    strongBullet: "Внедрила ATS Huntflow и сквозную аналитику воронки найма, сократив срок закрытия вакансий с 42 до 17 дней и повысив retention испытательного срока до 94%.",
    salaryBefore: "130 000 ₽",
    salaryAfter: "175 000 ₽ (+35%)",
    imagePromptTheme: "A futuristic talent acquisition interface showing candidate match networks, glowing emerald scorecards and neural organization tree",
  },
  engineer: {
    category: "Инженерия и Производство",
    heroRole: "Главный инженер проекта / Ведущий инженер-конструктор",
    targetRole: "Технический директор / Главный инженер предприятия (CTO)",
    tools: ["AutoCAD", "Компас-3D", "SolidWorks", "Revit", "ЕСКД", "СПДС", "разделы ТХ/АТХ", "Главгосэкспертиза", "авторский надзор"],
    metrics: ["проектирование 5 объектов на 1.3 млрд руб.", "4 заключения Главгосэкспертизы с 1-го раза", "экономия на материалах 16 млн руб.", "0 рекламаций при ПНР"],
    painPoints: "нет точных названий САПР в блоке опыта, отсутствие упоминаний успешной защиты в органах государственной экспертизы",
    redFlagsSample: "«ненормированные командировки на стройплощадки за свой счет», «совмещение функций ГИПа и инженера по охране труда»",
    weakBullet: "Разрабатывал чертежи и схемы, согласовывал документацию и выезжал на объекты.",
    strongBullet: "Спроектировал 5 промышленных комплексов с бюджетом 1.3 млрд руб., защитил проекты в Главгосэкспертизе с первого предъявления и сэкономил 16 млн руб. сметы в SolidWorks.",
    salaryBefore: "140 000 ₽",
    salaryAfter: "190 000 ₽ (+36%)",
    imagePromptTheme: "High-tech engineering blueprint glowing with neon cyan schematic lines, 3D industrial robot prototype rendering in holographic viewport",
  },
  executive: {
    category: "Топ-менеджмент и Руководство",
    heroRole: "Операционный директор (COO) / Заместитель генерального",
    targetRole: "Генеральный директор / Managing Director (CEO)",
    tools: ["Управление P&L", "1С:ERP", "Lean / Kaizen", "Six Sigma", "EBITDA", "сквозные KPI", "координация 500+ человек", "стратегическое планирование"],
    metrics: ["оборот 3.1 млрд руб.", "рост EBITDA на 4.9 п.п.", "экономия 26 млн руб./год за счет бережливого производства", "рост производительности труда на 28%"],
    painPoints: "отсутствие масштаба бизнеса в цифрах (оборот, штат, число филиалов), абстрактные фразы «руководство коллективом»",
    redFlagsSample: "«субсидиарная ответственность по долгам прошлых собственников», «KPI без полномочий на изменение бюджета и структуры»",
    weakBullet: "Руководил операционной деятельностью компании, контролировал отделы и ставил задачи.",
    strongBullet: "Управлял дивизионом из 14 филиалов (штат 480 человек, оборот 3.1 млрд руб.), повысил EBITDA на 4.9 п.п. и сэкономил 26 млн руб./год за счет внедрения Lean и 1С:ERP.",
    salaryBefore: "320 000 ₽",
    salaryAfter: "440 000 ₽ (+37%)",
    imagePromptTheme: "Executive boardroom of the future overlooking a cyber city skyline, glowing obsidian interactive table showing financial growth curves",
  },
  it: {
    category: "IT и Технологии",
    heroRole: "Senior Product Manager / Tech Lead",
    targetRole: "Head of Product / VP of Engineering",
    tools: ["Product Strategy", "Roadmap", "CustDev", "Scrum", "PRD", "Unit-экономика", "A/B-тестирование", "SQL", "Docker", "Kubernetes", "CI/CD"],
    metrics: ["рост DAU с 7 000 до 55 000", "рост конверсии в оплату на 25%", "сокращение time-to-market фичи с 5 недель до 8 дней", "LTV вырос на 31%"],
    painPoints: "сиротские технические навыки в конце резюме, отсутствие продуктовых и продуктовых метрик (Retention, LTV, Churn, ARR)",
    redFlagsSample: "«круглосуточная доступность для хотфиксов без дежурной ставки», «требование совмещать разработку, проджект и продюсерство»",
    weakBullet: "Управлял разработкой продукта, писал технические задания и проводил созвоны с командой.",
    strongBullet: "Руководил продуктовым роадмапом SaaS-платформы, внедрил A/B-тестирование и сократил time-to-market с 5 недель до 8 дней, увеличив DAU с 7 000 до 55 000 пользователей.",
    salaryBefore: "260 000 ₽",
    salaryAfter: "340 000 ₽ (+31%)",
    imagePromptTheme: "A modern developer terminal and product roadmap canvas glowing with cyan code branches, architectural cloud microservice mesh",
  },
};

/**
 * Resolves or builds a domain profile for any standard or custom role
 */
function resolveProfile(roleRaw: string): DomainProfile {
  const r = roleRaw.toLowerCase().trim();

  if (r.includes("продаж") || r.includes("sales") || r.includes("роп") || r.includes("коммерческ") || r.includes("сделк")) {
    return DOMAIN_KNOWLEDGE.sales;
  }
  if (r.includes("бухгалтер") || r.includes("accountant") || r.includes("финанс") || r.includes("ндс") || r.includes("налог")) {
    return DOMAIN_KNOWLEDGE.accountant;
  }
  if (r.includes("маркетолог") || r.includes("marketing") || r.includes("cmo") || r.includes("трафик") || r.includes("seo") || r.includes("директ")) {
    return DOMAIN_KNOWLEDGE.marketing;
  }
  if (r.includes("юрист") || r.includes("lawyer") || r.includes("legal") || r.includes("право") || r.includes("арбитраж")) {
    return DOMAIN_KNOWLEDGE.lawyer;
  }
  if (r.includes("логист") || r.includes("logistics") || r.includes("склад") || r.includes("вэд") || r.includes("scm")) {
    return DOMAIN_KNOWLEDGE.logistics;
  }
  if (r.includes("hr") || r.includes("кадр") || r.includes("рекрутер") || r.includes("персонал") || r.includes("найм")) {
    return DOMAIN_KNOWLEDGE.hr;
  }
  if (r.includes("инженер") || r.includes("engineer") || r.includes("гип") || r.includes("пто") || r.includes("сапр") || r.includes("гост")) {
    return DOMAIN_KNOWLEDGE.engineer;
  }
  if (r.includes("руководител") || r.includes("директор") || r.includes("executive") || r.includes("coo") || r.includes("ceo") || r.includes("управлен")) {
    return DOMAIN_KNOWLEDGE.executive;
  }
  if (r.includes("it") || r.includes("разработчик") || r.includes("программист") || r.includes("pm") || r.includes("product") || r.includes("dev")) {
    return DOMAIN_KNOWLEDGE.it;
  }

  // Dynamic Custom Role Construction
  const cleanTitle = roleRaw.replace(/^[^\wа-яА-ЯёЁ]+/, "").trim() || "Специалист";
  return {
    category: `Сфера «${cleanTitle}»`,
    heroRole: cleanTitle,
    targetRole: `Ведущий специалист / Руководитель (${cleanTitle})`,
    tools: ["профессиональные стандарты", "отраслевое ПО", "профильные регламенты", "контроль качества", "управление процессами"],
    metrics: ["повышение эффективности на 32%", "сокращение сроков выполнения задач на 40%", "выполнение целевых KPI на 120%", "0 рекламаций от заказчиков"],
    painPoints: `отсутствие точных профессиональных ключевых слов сферы «${cleanTitle}», не оцифрованный опыт и графические шаблоны`,
    redFlagsSample: `«размытые обязанности за двоих сотрудников», «ненормированный рабочий день без доплаты», «обещания дохода без оклада»`,
    weakBullet: `Выполнял обязанности в сфере ${cleanTitle}, решал текущие задачи руководства.`,
    strongBullet: `Стандартизировал ключевые рабочие процессы по направлению «${cleanTitle}», сократив временные издержки на 35% и обеспечив стабильное выполнение KPI на 125%.`,
    salaryBefore: "120 000 ₽",
    salaryAfter: "165 000 ₽ (+37%)",
    imagePromptTheme: `A cinematic professional workspace depicting an elite expert in ${cleanTitle}, futuristic holographic metrics and data nodes, 8k render`,
  };
}

/**
 * Builds a dynamic, fresh, high-converting PR batch wave
 */
export function buildPrBatchWave(
  roleLabel: string,
  featureId: string,
  rawAiText?: string,
  tone: "viral" | "case_study" | "guide" = "viral"
): PrBatchResult {
  const feature = PR_FEATURES.find((f) => f.id === featureId) || PR_FEATURES[0];
  const roleClean = roleLabel.replace(/^[^\wа-яА-ЯёЁ]+/, "").trim();
  const profile = resolveProfile(roleClean);

  // Extract from AI if delimiter tags are present
  const extractedPikabu = extractSection(rawAiText, "PIKABU");
  const extractedTenchat = extractSection(rawAiText, "TENCHAT");
  const extractedLinkedin = extractSection(rawAiText, "LINKEDIN");
  const extractedVc = extractSection(rawAiText, "VC");
  const extractedHashnode = extractSection(rawAiText, "HASHNODE");
  const extractedIndieHackers = extractSection(rawAiText, "INDIEHACKERS");
  const extractedCreative = extractSection(rawAiText, "CREATIVE");

  // Dynamic seed helpers for authentic variation
  const randNum = Math.floor(Math.random() * 4) + 1;
  const toolList = profile.tools.slice(0, 4).join(", ");
  const metricSample = profile.metrics[0];
  const metricSecond = profile.metrics[1] || profile.metrics[0];

  // 1. PIKABU (Engaging Storytelling, START30, strictly NO links)
  const pikabuContent =
    extractedPikabu ||
    `Как я искал работу (${profile.heroRole}) и вскрыл причину, почему 80% резюме отсекают роботы ещё до живого HR

Если вы прямо сейчас отправляете отклики по специальности «${profile.heroRole}» и в ответ получаете только гробовую тишину или автоматический отказ через 5 минут — не спешите сомневаться в своём профессионализме. Скорее всего, ваше резюме даже не открыл человек.

Я сам в этой сфере не первый год. Месяц назад решил сменить компанию и закинул удочки. Из 25 откликов — ровно 2 вялых просмотра и ноль звонков. Я не выдержал, связался со знакомой, которая руководит подбором в крупном холдинге, и прямо спросил: «Что со мной не так? Опыт солидный, косяков нет».

Она рассмеялась и показала изнутри их корпоративную систему ATS (Applicant Tracking System). Оказалось:
1. Красивые двухколоночные шаблоны из Canva с цветными шкалами навыков алгоритм парсит как бессвязную кашу из символов.
2. Если в вакансии требуются ${toolList}, а у вас написано общими словами вроде «уверенный пользователь ПК» — система ставит резюме балл соответствия 30% и автоматически сваливает его в архив отказников.
3. Опыт без оцифрованных результатов (без конкретных цифр %, руб., x) считается системой «водой».

В итоге наткнулся на сервис LaunchPad AI PRO. Там есть независимый ATS-сканер, который анализирует текст по стандарту 55/15/15/15 (Hard Skills, оцифровка Google X-Y-Z, Soft Skills и Harvard-верстка) и сразу находит скрытые красные флаги работодателя (${profile.redFlagsSample}). 

Прогнал своё резюме — балл был всего 56%. Сервис за 1 минуту переписал буллеты опыта по формуле Google:
• Было: «${profile.weakBullet}»
• Стало: «${profile.strongBullet}»

На следующий день разослал обновленный вариант: из 10 откликов получил 7 приглашений на интервью за одну неделю.

Полезная фишка: у них сейчас работает промокод START30 на скидку 30% на PRO-доступ.
Прямых ссылок не даю (на Пикабу за это сразу бан), сервис называется LaunchPad AI PRO, находится в Яндексе в два счёта. Всем удачи и адекватных офферов!`;

  // 2. TENCHAT (Business Expert Breakdown, bullets, link in 1st comment, question for Zeus)
  const tenchatContent =
    extractedTenchat ||
    `Почему эксперты с 8-летним стажем проигрывают новичкам на первом этапе отбора? (${profile.heroRole})

В TenChat часто говорят о кризисе найма, но мало кто обсуждает техническую сторону отсева соискателей.

В 2026 году первичный фильтр резюме в 75% средних и крупных компаний выполняют ATS-алгоритмы (Workday, Taleo, E-Staff, Поток). Рекрутер видит только топ-5 кандидатов с максимальным Match Score.

Вместе с командой мы исследовали свыше 1 200 откликов в категории «${profile.category}» и выделили 4 критические ошибки опытных кандидатов:

1. Сиротские ключевые навыки (Orphan Skills)
Кандидат указывает ${toolList} в плашке «Обо мне», но ни разу не упоминает их в конкретных задачах и результатах в блоке «Опыт работы». Для ATS-парсера такой навык имеет нулевой вес.

2. Отсутствие формулы Google X-Y-Z
Вместо описания обязанностей алгоритм ждёт доказанную формулу: «Достиг [X], измеряемого [Y], путем совершения [Z]».
Пример оцифровки:
❌ «${profile.weakBullet}»
✅ «${profile.strongBullet}»

3. Скрытые «красные флаги» в вакансиях
Кандидаты часто тратят недели на токсичные вакансии с ловушками: ${profile.redFlagsSample}.

4. Двухколоночная верстка и графические элементы
Таблицы, прогресс-бары и текстовые блоки превращаются в кракозябры при парсинге.

⚡️ Для решения этой боли разработан сервис LaunchPad AI PRO: он проверяет резюме глазами роботов ATS по формуле 55/15/15/15, оцифровывает буллеты и подсвечивает подводные камни работодателя.

👉 Ссылку на интерактивный сканер резюме для вашей профессии прикрепил в первом комментарии к этой записи 👇

Коллеги, сталкивались ли вы с тем, что сильных специалистов срезают на этапе формального скоринга? Делитесь в комментариях!`;

  // 3. LINKEDIN (Punchy Hook, ✅ Bullets, Comment-Bait)
  const linkedinContent =
    extractedLinkedin ||
    `78% резюме отсеиваются роботами ещё до того, как их увидит живой рекрутер. 

Особенно тяжело это бьёт по сильным экспертам в сфере: ${profile.heroRole}.

Вы можете иметь за плечами впечатляющий трекшн (${metricSample}), но если ваше резюме не откалибровано под алгоритмы ATS (Applicant Tracking Systems), конверсия в интервью будет около нуля.

Вот что мы внедрили в LaunchPad AI PRO, чтобы кандидаты получали 92%+ Match Score:

✅ Формула Google X-Y-Z: автоматическая оцифровка буллетов опыта с доказанными метриками.
✅ Одноколоночный Harvard-стандарт: идеальное распознавание любым корпоративным парсером (Workday, Taleo, Greenhouse).
✅ Детектор Red Flags: мгновенный рентген текста вакансии на токсичность и переработки (${profile.redFlagsSample}).
✅ Вплетение целевых навыков (${toolList}) прямо в контекст проектов.
✅ Дипломатичный скрипт торга по зарплате при получении оффера (${profile.salaryBefore} ➔ ${profile.salaryAfter}).

Результат: кандидаты получают в 3 раза больше приглашений на интервью уже в первые 10 дней.

🔥 Хотите проверить ваше резюме? 
Напишите в комментариях вашу текущую должность — я прогоню её через ATS-матрицу LaunchPad AI и пришлю вам в личные сообщения персональный чек-лист ключевых навыков!`;

  // 4. VC.RU / DTF (In-depth Case Study, 60% -> 95%, XYZ formula, salary boost)
  const vcContent =
    extractedVc ||
    `Кейс: как соискатель (${profile.heroRole}) поднял ATS-скор резюме с 58% до 94% за 2 минуты и согласовал оффер ${profile.salaryAfter}

Сфера: ${profile.category}
Кандидат: опыт 6+ лет, подтвержденные результаты (${metricSample}).
Проблема: 38 откликов на HeadHunter и Хабр Карьере, 4 просмотра, 0 приглашений на технический созвон.
Инструмент: платформа карьерной аналитики LaunchPad AI PRO.

1. Что показал аудит алгоритмами ATS
Исходный скор резюме составлял 58% из 100%. Роботы E-Staff и Поток отсеивали кандидата по трем причинам:
• Отсутствовали 7 ключевых терминов: ${toolList}.
• Опыт описан через процесс, а не результат (глаголы действия без конкретных оцифрованных показателей).
• Двухколоночный шаблон с иконками, который парсер прочитал со смещением строк.

2. Что сделал алгоритм LaunchPad AI PRO:
• Переписал буллеты опыта по формуле Google X-Y-Z:
  Было: «${profile.weakBullet}»
  Стало: «${profile.strongBullet}»
• Встроил недостающие профильные компетенции прямо в контекст выполненных задач.
• Проверил вакансию через Детектор красных флагов: отсеял сомнительные условия (${profile.redFlagsSample}).
• Сформировал дипломатичные аргументы для торга по зарплате при получении оффера.

3. Итог:
Балл соответствия вырос с 58% до 94%. Кандидат сделал 12 точечных откликов:
• 8 приглашений на первый этап интервью (конверсия 66%).
• 2 финальных оффера через 3 недели.
• Зарплата согласована на уровне ${profile.salaryAfter} (вместо стартовых ${profile.salaryBefore}).

Протестировать независимый ATS-сканер резюме для вашей профессии можно на платформе LaunchPad AI PRO.`;

  // 5. HASHNODE / MEDIUM (English Technical Article on ATS Architecture)
  const hashnodeContent =
    extractedHashnode ||
    `Why ATS Algorithms Reject 75% of Qualified Candidates Before a Human Sees Them (${profile.category})

Target Career Domain: ${profile.heroRole}

In modern recruitment funnels, applicant tracking systems (ATS)—such as Workday, Taleo, Greenhouse, and Lever—act as automated gatekeepers. While human candidates perceive a resume as a career narrative, an algorithmic tokenizer processes it as an unstructured string of tokens evaluated against keyword density matrices and layout heuristics.

In this technical breakdown, we examine why high-caliber professionals in ${profile.category} get rejected, and how we engineered LaunchPad AI PRO to achieve a deterministic 92%+ match rate.

1. The 55/15/15/15 ATS Scoring Benchmark
Our engine benchmarks resumes across four distinct dimensions:
- Hard Skills Topology (55%): Verifying verified context for core competencies (${toolList}).
- Metric Quantification (15%): Detecting numeric achievements (${metricSample}).
- Soft Skills & Process Ownership (15%): Cross-functional coordination, problem-solving, and SLA adherence.
- Single-Column Harvard Layout (15%): Eliminating multi-column HTML/PDF frames that induce token displacement.

2. The Google X-Y-Z Bullet Point Transformation
Weak Candidate Input:
"${profile.weakBullet}"

Engineered ATS Output:
"${profile.strongBullet}"

3. Automated Employer Red Flag Detection
Candidates also face informational asymmetry. LaunchPad AI incorporates heuristic token matching to detect predatory job conditions (${profile.redFlagsSample}), protecting job seekers before they invest interview bandwidth.

Explore the open interactive ATS engine on LaunchPad AI PRO.`;

  // 6. INDIE HACKERS (English Build-in-Public, NO vercel links, NO "free/discount")
  const indiehackersContent =
    extractedIndieHackers ||
    `Building LaunchPad AI: How we automated resume ATS audits for ${profile.category} and built an organic growth loop

Hey Indie Hackers!

Two months ago, I started investigating why job seekers across specialized roles (${profile.heroRole}) were facing 80%+ silent rejection rates despite strong career backgrounds.

The core problem: corporate ATS platforms filter out applicants based on strict token heuristics and layout rules. Most job hunters don't need fluffy career advice—they need transparent, instant feedback on how algorithmic parsers evaluate their experience against target job descriptions.

What we built with LaunchPad AI PRO:
1. Multi-LLM Career Cascade: We engineered a fallback pipeline combining Llama 3.3 70B and Gemini Flash to rewrite resume bullets according to Google's X-Y-Z framework in under 2 seconds.
2. 55/15/15/15 Heuristic Simulator: Evaluates resumes across Hard Skills (${toolList}), Metric Quantification (${metricSample}), Leadership, and Layout Integrity.
3. Employer Red Flag Scanner: Automatically flags predatory job listings (${profile.redFlagsSample}) so candidates avoid toxic environments.
4. Client-Side HTML5 Canvas Scorecards: Users can generate verified social proof badges exportable to LinkedIn.

Our Growth Loop:
When candidates optimize their resume score from ~58% to 92%+, they unlock bonus evaluation scans by sharing their verified score badge with peers. This peer-to-peer viral mechanism drives qualified candidate referrals without paid acquisition spend.

Tech stack: Next.js 16 App Router, Turbopack, Tailwind v4, client-side PDF/DOCX extractors.

Happy to answer questions about prompt engineering, keyword extraction algorithms, and building tools for job seekers!`;

  // 7. VISUAL CREATIVES (Nano Banana Prompt + 10s Video Script)
  const creativeContent =
    extractedCreative ||
    `[NANO BANANA / MIDJOURNEY IMAGE PROMPT]
${profile.imagePromptTheme}, sleek obsidian glass holographic user interface analyzing a resume for "${profile.heroRole}", glowing neon cyan and emerald green match score rings displaying "94% ATS MATCH", futuristic cybernetic data nodes, cinematic studio lighting, photorealistic 8k octane render, hyper-detailed commercial tech aesthetics --ar 16:9 --style raw

[10-SECOND VIRAL VIDEO SCRIPT (Reels / Shorts / TikTok / Google Vids / Veo)]
• 0:00 - 0:03 (ХУК)
  - Визуал: Крупный план: разочарованный соискатель (${profile.heroRole}) смотрит на экран с шаблонным отказом «К сожалению, мы выбрали другого кандидата».
  - Текст на экране: «Почему твоё резюме отклоняют за 2 минуты?»
  - Озвучка: «Думаешь, твоё резюме читает живой HR? Нет, тебя срезает робот-сканер ещё до человека!»

• 0:03 - 0:07 (БОЛЬ И ДЕМОНСТРАЦИЯ)
  - Визуал: Запись экрана сервиса LaunchPad AI PRO. Загружается резюме. Красные недостающие навыки (${toolList}) мгновенно вплетаются в опыт, скор подлетает с 58% до 94%.
  - Текст на экране: «Формула Google X-Y-Z + обход фильтров ATS»
  - Озвучка: «Загрузи резюме в LaunchPad AI — нейросеть за минуту оцифрует буллеты и обойдёт фильтры роботов!»

• 0:07 - 0:10 (CTA / ПРИЗЫВ К ДЕЙСТВИЮ)
  - Визуал: Чистый экспорт в Harvard ATS формат + всплывает бейдж с промокодом START30 (-30%).
  - Текст на экране: «Проверь резюме бесплатно 👉 LaunchPad AI PRO»
  - Озвучка: «Ссылка в профиле. Проверь свой ATS-скор прямо сейчас!»`;

  return {
    roleName: profile.heroRole,
    featureName: feature.label,
    tone,
    createdAt: new Date().toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }),
    channels: {
      pikabu: {
        id: "pikabu",
        title: `Пикабу: Сторителлинг для «${profile.heroRole}»`,
        platformName: "Пикабу",
        badge: "БЕЗ ССЫЛОК • ПРОМО START30",
        rulesHint: "Строго без ссылок (бан). Живой язык от 1-го лица, промокод START30 на 30% скидку.",
        content: pikabuContent,
      },
      tenchat: {
        id: "tenchat",
        title: `TenChat: Экспертный разбор («${profile.heroRole}»)`,
        platformName: "TenChat",
        badge: "ССЫЛКА В 1-Й КОММЕНТ • ЗЕВС",
        rulesHint: "Деловой разбор, буллеты, напоминание оставить ссылку в 1-м комментарии, вопрос в конце.",
        content: tenchatContent,
      },
      linkedin: {
        id: "linkedin",
        title: `LinkedIn: Вирусный хук («${profile.heroRole}»)`,
        platformName: "LinkedIn",
        badge: "ХУК • БУЛЛЕТЫ С ✅ • БАЙТ",
        rulesHint: "Хук до кнопки «еще», буллеты с ✅, байт в комментариях: «Напишите должность — разберу».",
        content: linkedinContent,
      },
      vc: {
        id: "vc",
        title: `VC.ru / DTF: Кейс 58% ➔ 94% («${profile.heroRole}»)`,
        platformName: "VC.ru / DTF",
        badge: "КЕЙС 58% -> 94% • GOOGLE X-Y-Z",
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
        content: creativeContent,
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
