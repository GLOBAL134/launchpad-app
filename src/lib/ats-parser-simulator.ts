/**
 * Universal Deterministic ATS Parser Simulator (Standard 55/15/15/15)
 * Adapts to ANY profession & industry:
 * - Sales, Marketing, Accounting, Finance, Legal, HR, Logistics, Medicine, Engineering, IT, Management
 *
 * 55% Hard Skills (Verified Quotes in Work Experience)
 * 15% Quantified Metrics (%, $, руб, млн, x, time, scale)
 * 15% Soft Skills (Communication, Negotiation, Leadership, Cross-functional)
 * 15% ATS Clean Layout (Single-column Harvard/BigTech AST)
 */

import { cleanAIMarkdownArtifacts } from "./monetization";

export interface LayoutIssue {
  id: string;
  type: "column_collision" | "broken_date" | "bad_character" | "missing_section";
  title: string;
  description: string;
  evidence: string;
  severity: "critical" | "warning";
}

export interface OrphanSkill {
  name: string;
  foundIn: string;
  reason: string;
  penalty: string;
}

export interface VerifiedSkill {
  name: string;
  quote: string;
  points: number;
}

export interface XyzImprovement {
  id: string;
  original: string;
  improved: string;
  weakKeyword: string;
  metricsAdded: string[];
  scoreBoost: number;
}

export interface AtsSimulationResult {
  score: {
    total: number;
    hardSkills: number; // max 55
    metrics: number;    // max 15
    softSkills: number; // max 15
    layout: number;     // max 15
  };
  domainName: string;
  verifiedSkills: VerifiedSkill[];
  orphanSkills: OrphanSkill[];
  missingSkills: string[];
  layoutIssues: LayoutIssue[];
  xyzImprovements: XyzImprovement[];
  rawTextStream: string;
  parsedAstJson: Record<string, unknown>;
}

interface KnownSkillPattern {
  name: string;
  synonyms: string[];
}

interface DomainKnowledge {
  domain: string;
  labelRu: string;
  labelEn: string;
  detectPatterns: string[];
  skills: KnownSkillPattern[];
}

const DOMAIN_KNOWLEDGE_BASE: DomainKnowledge[] = [
  // 1. Education & Teaching
  {
    domain: "education",
    labelRu: "Образование и Педагогика",
    labelEn: "Education & Teaching",
    detectPatterns: [
      "учител", "преподават", "педагог", "школ", "лицей", "гимнази", "фгос", "мэш", "элжур",
      "егэ", "огэ", "классное руководство", "учебный план", "методика", "учащихся"
    ],
    skills: [
      { name: "Стандарты ФГОС", synonyms: ["фгос", "стандарты образования", "госстандарт"] },
      { name: "Подготовка к ОГЭ и ЕГЭ", synonyms: ["огэ", "егэ", "гиа", "госэкзамены"] },
      { name: "Электронные журналы (МЭШ, ЭлЖур)", synonyms: ["мэш", "элжур", "электронный журнал", "дневник.ру"] },
      { name: "Методика преподавания", synonyms: ["методика преподавания", "педагогические технологии", "интерактивное обучение"] },
      { name: "Классное руководство", synonyms: ["классное руководство", "воспитательная работа", "работа с родителями"] },
      { name: "Индивидуальный подход", synonyms: ["индивидуальный подход", "дифференцированное обучение", "олимпиадная подготовка"] },
    ],
  },

  // 2. Culture, Theater & Arts
  {
    domain: "culture",
    labelRu: "Театр, Кино и Искусство",
    labelEn: "Theater & Performing Arts",
    detectPatterns: [
      "актер", "актрис", "театр", "кино", "съемок", "сцен", "роль", "спектакл", "режиссер",
      "вгик", "гитис", "щукинск", "щепкинск", "мхат", "кастинг"
    ],
    skills: [
      { name: "Мастерство актера и перевоплощение", synonyms: ["мастерство актера", "актерское мастерство", "перевоплощение", "система станиславского"] },
      { name: "Сценическая речь и дикция", synonyms: ["сценическая речь", "дикция", "постановка голоса", "озвучивание", "дубляж"] },
      { name: "Работа на съемочной площадке", synonyms: ["съемочная площадка", "работа на камеру", "киносъемки", "полный метр", "сериалы"] },
      { name: "Сценическое движение и пластика", synonyms: ["сценическое движение", "пластика", "хореография", "сценический бой", "фехтование"] },
      { name: "Импровизация", synonyms: ["импровизация", "этюдный метод", "работа с партнером"] },
    ],
  },

  // 3. Finance & Accounting
  {
    domain: "accounting",
    labelRu: "Финансы и Бухгалтерия",
    labelEn: "Finance & Accounting",
    detectPatterns: [
      "бухгалтер", "1с:бухгалтерия", "первичк", "осно", "усн", "фнс", "сфр",
      "бухучет", "баланс", "аудит", "дебет", "кредит", "проводк", "1с:зуп", "сбис", "диадок"
    ],
    skills: [
      { name: "1С:Бухгалтерия 8.3", synonyms: ["1с", "1с:бухгалтерия", "1c 8.3", "1c:предприятие", "1с 8.3"] },
      { name: "ОСНО / УСН", synonyms: ["осно", "усн", "система налогообложения", "спецрежимы"] },
      { name: "Сдача отчетности в ФНС и СФР", synonyms: ["фнс", "сфр", "росстат", "сдача отчетности", "налоговая отчетность", "фонды"] },
      { name: "Расчет НДС и Налога на прибыль", synonyms: ["ндс", "налог на прибыль", "книга покупок", "книга продаж"] },
      { name: "Первичная документация", synonyms: ["первичка", "первичная документация", "акты", "накладные", "упд", "счета-фактуры"] },
      { name: "ЭДО (Диадок, СБИС)", synonyms: ["эдо", "диадок", "сбис", "контур", "электронный документооборот"] },
      { name: "Банк-Клиент и платежи", synonyms: ["банк-клиент", "клиент-банк", "платежные поручения", "выписки"] },
      { name: "Расчет заработной платы (1С:ЗУП)", synonyms: ["зуп", "зарплата", "расчет зарплаты", "отпускные", "больничные"] },
      { name: "Управленческий учет", synonyms: ["управленческий учет", "бюджетирование", "cash flow", "ддс", "бдр"] },
      { name: "ВЭД и Валютный контроль", synonyms: ["вэд", "валютный контроль", "таможня", "паспорт сделки"] },
      { name: "Налоговый аудит и проверки", synonyms: ["камеральная проверка", "выездная проверка", "налоговый аудит", "требования фнс"] },
    ],
  },

  // 2. Sales & Commercial
  {
    domain: "sales",
    labelRu: "Продажи и Коммерция",
    labelEn: "Sales & Commercial",
    detectPatterns: [
      "продаж", "b2b", "b2c", "менеджер по продажам", "роп", "клиент", "холодные звонки",
      "сделк", "лид", "выручк", "план продаж", "amocrm", "bitrix24", "воронка продаж"
    ],
    skills: [
      { name: "B2B продажи", synonyms: ["b2b", "б2б", "корпоративные продажи", "b2b продажи"] },
      { name: "AmoCRM / Bitrix24", synonyms: ["amocrm", "bitrix24", "битрикс24", "амосрм", "crm"] },
      { name: "Выполнение плана продаж (KPI)", synonyms: ["план продаж", "выполнение плана", "kpi", "таргет", "перевыполнение"] },
      { name: "Переговоры с первыми лицами (C-Level)", synonyms: ["c-level", "первые лица", "лпр", "деловые переговоры", "переговоры"] },
      { name: "Холодные и тёплые звонки", synonyms: ["холодные звонки", "холодная база", "исходящие звонки", "теплая база"] },
      { name: "Управление дебиторской задолженностью", synonyms: ["дебиторка", "дебиторская задолженность", "контроль оплат", "взыскание"] },
      { name: "Согласование и заключение договоров", synonyms: ["заключение договоров", "согласование контрактов", "договорная работа"] },
      { name: "Увеличение среднего чека (Upsell / Cross-sell)", synonyms: ["средний чек", "upsell", "cross-sell", "допродажи"] },
      { name: "Управление воронкой продаж", synonyms: ["воронка продаж", "sales funnel", "конверсия воронки", "лидогенерация"] },
      { name: "Работа с возражениями", synonyms: ["возражения", "отработка возражений", "скрипты продаж"] },
    ],
  },

  // 3. Marketing & PR
  {
    domain: "marketing",
    labelRu: "Маркетинг и PR",
    labelEn: "Marketing & PR",
    detectPatterns: [
      "маркетинг", "директ", "seo", "трафик", "контекст", "таргет", "smm", "cpa", "cpl",
      "яндекс.директ", "метрика", "analytics", "лидогенерация", "pr", "контент"
    ],
    skills: [
      { name: "Яндекс.Директ и РСЯ", synonyms: ["яндекс.директ", "директ", "рся", "контекстная реклама", "яндекс директ"] },
      { name: "Сквозная аналитика (Яндекс.Метрика / GA4)", synonyms: ["яндекс.метрика", "ga4", "google analytics", "сквозная аналитика", "метрик"] },
      { name: "SEO оптимизация и органика", synonyms: ["seo", "сео", "поисковая оптимизация", "семантическое ядро", "ранжирование"] },
      { name: "Лидогенерация и снижение CAC/CPL", synonyms: ["лидогенерация", "cac", "cpl", "стоимость лида", "cpa", "конверсия"] },
      { name: "A/B-тестирование и оптимизация конверсии", synonyms: ["a/b-тестирование", "ab test", "сплит-тест", "оптимизация конверсии", "cr"] },
      { name: "VK Реклама и Таргетинг", synonyms: ["vk реклама", "таргетированная реклама", "таргет", "вконтакте", "telegram ads"] },
      { name: "Контент-маркетинг и SMM", synonyms: ["контент", "контент-маркетинг", "smm", "копирайтинг", "продвижение в соцсетях"] },
      { name: "Email-маркетинг и Retention", synonyms: ["email-маркетинг", "рассылки", "retention", "ltv", "триггерные цепочки"] },
      { name: "Управление рекламным бюджетом", synonyms: ["рекламный бюджет", "бюджетирование", "romi", "roas", "roi"] },
    ],
  },

  // 4. Logistics, Supply Chain & Warehousing
  {
    domain: "logistics",
    labelRu: "Логистика, Склад и ВЭД",
    labelEn: "Logistics & Supply Chain",
    detectPatterns: [
      "логист", "склад", "поставк", "вэд", "таможн", "scm", "wms", "транспорт", "инкотермс",
      "грузоперевозк", "доставк", "отгрузк"
    ],
    skills: [
      { name: "Управление цепочками поставок (SCM)", synonyms: ["scm", "цепочки поставок", "управление поставками", "планирование поставок"] },
      { name: "Складской учет и системы WMS", synonyms: ["wms", "складской учет", "адресное хранение", "инвентаризация", "1с:склад"] },
      { name: "Таможенное оформление и ВЭД", synonyms: ["таможенное оформление", "вэд", "декларирование", "гтд", "растаможка"] },
      { name: "Транспортная логистика и маршрутизация", synonyms: ["транспортная логистика", "маршрутизация", "фрахт", "грузоперевозки"] },
      { name: "Международные правила Инкотермс", synonyms: ["инкотермс", "incoterms", "fob", "cif", "dap", "exw"] },
      { name: "Оптимизация логистических затрат", synonyms: ["снижение затрат", "оптимизация тарифов", "себестоимость доставки"] },
      { name: "Контроль отгрузок и стандарты OTIF", synonyms: ["otif", "контроль отгрузок", "точность доставки", "рекламации"] },
    ],
  },

  // 5. Legal & Corporate Law
  {
    domain: "legal",
    labelRu: "Юриспруденция и Право",
    labelEn: "Legal & Corporate Law",
    detectPatterns: [
      "юрист", "договор", "арбитраж", "суд", "право", "претензи", "иск", "тк рф", "гк рф", "фас"
    ],
    skills: [
      { name: "Договорная работа в полном объеме", synonyms: ["договорная работа", "разработка договоров", "экспертиза договоров", "контракты"] },
      { name: "Претензионно-исковая работа", synonyms: ["претензионно-исковая работа", "претензии", "исковые заявления", "досудебное урегулирование"] },
      { name: "Представительство в Арбитражных судах", synonyms: ["арбитражный суд", "судебное представительство", "судебные споры", "апелляция"] },
      { name: "Корпоративное право и сделки", synonyms: ["корпоративное право", "устав", "совет директоров", "м&a", "егрюл"] },
      { name: "Правовая экспертиза и комплаенс", synonyms: ["правовая экспертиза", "комплаенс", "оценка правовых рисков", "due diligence"] },
      { name: "Взаимодействие с госорганами (ФАС, Роскомнадзор)", synonyms: ["фас", "роскомнадзор", "прокуратура", "госорганы", "проверки"] },
      { name: "Трудовое законодательство (ТК РФ)", synonyms: ["тк рф", "трудовое право", "трудовые споры", "локальные нормативные акты"] },
    ],
  },

  // 6. HR & Recruitment
  {
    domain: "hr",
    labelRu: "HR, Подбор и Управление персоналом",
    labelEn: "HR & Talent Acquisition",
    detectPatterns: [
      "hr", "рекрутер", "найм", "подбор", "персонал", "онбординг", "адаптаци", "huntflow", "e-staff"
    ],
    skills: [
      { name: "Полный цикл подбора персонала (Full-cycle)", synonyms: ["полный цикл подбора", "full-cycle", "поиск кандидатов", "сорсинг", "найм"] },
      { name: "Проведение глубинных интервью и скрининг", synonyms: ["скрининг", "интервью по компетенциям", "собеседования", "оценка резюме"] },
      { name: "Работа в ATS (Huntflow, E-Staff, Поток)", synonyms: ["huntflow", "e-staff", "поток", "ats", "база кандидатов"] },
      { name: "Адаптация и онбординг сотрудников", synonyms: ["адаптация", "онбординг", "испытательный срок", "ввод в должность"] },
      { name: "Сокращение Time-to-Hire и стоимости найма", synonyms: ["time-to-hire", "стоимость найма", "сроки закрытия вакансий", "воронка найма"] },
      { name: "Развитие HR-бренда и аналитика eNPS", synonyms: ["hr-бренд", "enps", "удержание сотрудников", "текучесть кадров", "retention"] },
    ],
  },

  // 7. IT & Engineering
  {
    domain: "it",
    labelRu: "IT и Разработка",
    labelEn: "IT & Software Engineering",
    detectPatterns: [
      "разработчик", "программист", "developer", "engineer", "frontend", "backend", "fullstack",
      "react", "python", "java", "sql", "devops", "qa", "тестировщик", "архитектор"
    ],
    skills: [
      { name: "React / Frontend Architecture", synonyms: ["react", "next.js", "frontend", "typescript", "javascript", "vue"] },
      { name: "Backend & Server Architecture", synonyms: ["node.js", "python", "go", "java", "backend", "django", "fastapi"] },
      { name: "Базы данных и оптимизация SQL", synonyms: ["sql", "postgresql", "mysql", "mongodb", "redis", "базы данных"] },
      { name: "Контейнеризация (Docker / Kubernetes)", synonyms: ["docker", "kubernetes", "k8s", "контейнеризация", "helm"] },
      { name: "CI/CD пайплайны и автоматизация", synonyms: ["ci/cd", "cicd", "github actions", "gitlab ci", "автоматизация развертывания"] },
      { name: "Проектирование REST API и микросервисов", synonyms: ["rest api", "микросервисы", "microservices", "graphql", "grpc"] },
      { name: "Отказоустойчивость и Highload", synonyms: ["highload", "отказоустойчивость", "оптимизация производительности", "масштабирование"] },
      { name: "Автоматизированное тестирование", synonyms: ["unit testing", "jest", "pytest", "тестирование", "e2e"] },
    ],
  },

  // 8. Industrial & Civil Engineering
  {
    domain: "engineer",
    labelRu: "Строительство и проектирование",
    labelEn: "Civil & Industrial Engineering",
    detectPatterns: [
      "инженер", "гип", "гап", "проектиров", "сапр", "autocad", "компас-3d", "компас",
      "solidworks", "revit", "ескд", "спдс", "гост", "снип", "главгосэкспертиз",
      "мосгосэкспертиз", "пск", "авторский надзор", "пто", "ппр", "конструктор"
    ],
    skills: [
      { name: "AutoCAD и Компас-3D", synonyms: ["autocad", "компас-3d", "компас", "сапр", "чертежи"] },
      { name: "Проектирование по ЕСКД и СПДС", synonyms: ["ескд", "спдс", "стандарты проектирования", "рабочая документация"] },
      { name: "Прохождение Главгосэкспертизы", synonyms: ["главгосэкспертиза", "госэкспертиза", "экспертиза проектов", "мосгосэкспертиза"] },
      { name: "3D-моделирование (SolidWorks / Revit)", synonyms: ["solidworks", "revit", "3d", "bim", "информационное моделирование"] },
      { name: "Соблюдение норм ГОСТ и СНиП", synonyms: ["гост", "снип", "нормы безопасности", "техрегламент"] },
      { name: "Авторский надзор на объектах", synonyms: ["авторский надзор", "контроль пнр", "надзор", "сдача объекта"] },
      { name: "Разделы проекта (ТХ, АТХ, КМ, КЖ)", synonyms: ["тх", "атх", "км", "кж", "разделы проекта", "проектная документация"] },
      { name: "Согласование сметной документации", synonyms: ["сметная документация", "сметы", "кс-2", "кс-3", "проектно-сметная"] },
    ],
  },

  // 9. Executive & C-Level Management
  {
    domain: "executive",
    labelRu: "Топ-менеджмент и Руководство",
    labelEn: "Executive & Operations",
    detectPatterns: [
      "директор", "генеральный", "операционный директор", "coo", "ceo", "управляющий",
      "руководитель предприятия", "p&l", "ebitda", "lean", "kaizen", "six sigma", "топ-менедж"
    ],
    skills: [
      { name: "Управление P&L и бюджетирование", synonyms: ["p&l", "бюджетирование", "финансовый результат", "доходы и расходы"] },
      { name: "Оптимизация бизнес-процессов (Lean / Kaizen)", synonyms: ["lean", "kaizen", "бережливое производство", "six sigma", "оптимизация процессов"] },
      { name: "Внедрение ERP-систем (1С:ERP, SAP)", synonyms: ["1с:erp", "erp", "sap", "автоматизация предприятия"] },
      { name: "Повышение операционной рентабельности (EBITDA)", synonyms: ["ebitda", "рентабельность", "сокращение издержек", "маржинальность"] },
      { name: "Разработка сквозных KPI подразделений", synonyms: ["kpi", "система мотивации", "показатели эффективности"] },
      { name: "Стратегическое планирование и масштабирование", synonyms: ["стратегическое планирование", "масштабирование", "стратегия развития"] },
    ],
  },
];

const UNIVERSAL_SOFT_SKILLS = [
  { name: "Кросс-функциональное взаимодействие", patterns: ["кросс-функциональн", "cross-functional", "взаимодействие с командами", "координация"] },
  { name: "Управление проектами и дедлайнами", patterns: ["дедлайн", "управление проектами", "agile", "scrum", "скрам", "kanban", "приоритизация"] },
  { name: "Деловая коммуникация и презентации", patterns: ["деловая коммуникация", "презентации", "деловая переписка", "публичные выступления"] },
  { name: "Ориентация на оцифрованный результат", patterns: ["kpi", "метрики", "ориентация на результат", "выполнение плана", "эффективность"] },
  { name: "Наставничество и передача опыта", patterns: ["ментор", "наставничество", "обучение сотрудников", "руководство", "лидерство"] },
];

/**
 * Universal dynamic keyword & requirement extractor:
 * Parses the provided job posting text and extracts real skills,
 * whether it is an Accountant, Sales Rep, Marketer, Lawyer, Engineer, or Developer!
 */
export function extractDynamicJobRequirements(jobDesc: string): {
  domain: DomainKnowledge;
  skills: KnownSkillPattern[];
} {
  const normJob = (jobDesc || "").toLowerCase();

  // 1. Detect matching domain from knowledge base
  let bestDomain = DOMAIN_KNOWLEDGE_BASE[0];
  let maxScore = 0;

  for (const d of DOMAIN_KNOWLEDGE_BASE) {
    let score = 0;
    for (const pat of d.detectPatterns) {
      if (normJob.includes(pat)) {
        score += 2;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestDomain = d;
    }
  }

  // If no predefined domain matched, derive dynamic domain from vacancy text
  if (maxScore === 0) {
    const firstLine = jobDesc.split("\n")[0]?.replace(/^[^\wа-яё]+/i, "").trim() || "Профильная специальность";
    bestDomain = {
      domain: "custom",
      labelRu: firstLine.length > 35 ? firstLine.slice(0, 35) + "..." : firstLine,
      labelEn: firstLine.length > 35 ? firstLine.slice(0, 35) + "..." : firstLine,
      detectPatterns: [],
      skills: [],
    };
  }

  // 2. Extract domain-matched predefined skills
  const matchedSkills: KnownSkillPattern[] = [];
  const foundSkillNames = new Set<string>();

  for (const s of bestDomain.skills) {
    const isDirect = normJob.includes(s.name.toLowerCase());
    const isSynonym = s.synonyms.some((syn) => normJob.includes(syn));
    if (isDirect || isSynonym) {
      matchedSkills.push(s);
      foundSkillNames.add(s.name.toLowerCase());
    }
  }

  // 3. Dynamic NLP extraction of custom requirements directly from the pasted text
  // Looks for lines starting with •, -, *, or numbering after "Требования" / "Обязанности"
  const lines = jobDesc.split(/\r?\n/);
  let isUnderRequirementsSection = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (/требован|обязанност|ожида|стек|навык|requirements|responsibilities|qualifications/i.test(line)) {
      isUnderRequirementsSection = true;
      continue;
    }

    if (isUnderRequirementsSection && /^[•\-\*–—\d\.]+\s+/.test(line)) {
      const cleaned = cleanAIMarkdownArtifacts(line.replace(/^[•\-\*–—\d\.]+\s+/, "")).trim();
      // Extract concise requirement phrase (2-6 words)
      if (cleaned.length > 5 && cleaned.length < 75) {
        const shortName = cleaned.split(/[,;:.]/)[0].trim();
        if (shortName.length > 3 && !foundSkillNames.has(shortName.toLowerCase())) {
          matchedSkills.push({
            name: shortName,
            synonyms: [shortName.toLowerCase()],
          });
          foundSkillNames.add(shortName.toLowerCase());
        }
      }
    }
  }

  // Ensure at least 5 skills in the pool (use domain defaults if short)
  if (matchedSkills.length < 5) {
    for (const fallbackSkill of bestDomain.skills) {
      if (!foundSkillNames.has(fallbackSkill.name.toLowerCase())) {
        matchedSkills.push(fallbackSkill);
        foundSkillNames.add(fallbackSkill.name.toLowerCase());
        if (matchedSkills.length >= 6) break;
      }
    }
  }

  return {
    domain: bestDomain,
    skills: matchedSkills,
  };
}

/**
 * Universal ATS simulation parser for ANY profession
 */
export function simulateAtsParser(
  resumeText: string,
  jobDesc: string,
  language: "ru" | "en" = "ru"
): AtsSimulationResult {
  const normResume = (resumeText || "").toLowerCase();

  // Split resume into sections (Experience vs Skills/Header)
  const experienceSplitRegex = /(?:опыт работы|профессиональный опыт|experience|work history)[\s\S]*?(?=(?:образование|навыки|skills|education|$))/i;
  const experienceMatch = resumeText.match(experienceSplitRegex);
  const experienceText = experienceMatch ? experienceMatch[0].toLowerCase() : normResume;

  const skillsHeaderSplitRegex = /(?:навыки|ключевые навыки|стек|skills|technologies)[\s\S]*?(?=(?:опыт работы|образование|experience|$))/i;
  const skillsHeaderText = (resumeText.match(skillsHeaderSplitRegex)?.[0] || "").toLowerCase();

  // Dynamic skill extraction for this specific profession
  const { domain, skills: pool } = extractDynamicJobRequirements(jobDesc);

  const verifiedSkills: VerifiedSkill[] = [];
  const orphanSkills: OrphanSkill[] = [];
  const missingSkills: string[] = [];

  pool.forEach((s) => {
    const isPresentInExp =
      experienceText.includes(s.name.toLowerCase()) ||
      s.synonyms.some((syn) => experienceText.includes(syn));

    const isPresentInHeaderOrList =
      skillsHeaderText.includes(s.name.toLowerCase()) ||
      s.synonyms.some((syn) => skillsHeaderText.includes(syn)) ||
      normResume.includes(s.name.toLowerCase());

    if (isPresentInExp) {
      // Find quote in text
      const regex = new RegExp(`([^.\n]*?${escapeRegex(s.name)}[^.\n]*)`, "i");
      let quoteMatch = resumeText.match(regex);
      if (!quoteMatch) {
        for (const syn of s.synonyms) {
          const synRegex = new RegExp(`([^.\n]*?${escapeRegex(syn)}[^.\n]*)`, "i");
          quoteMatch = resumeText.match(synRegex);
          if (quoteMatch) break;
        }
      }

      verifiedSkills.push({
        name: s.name,
        quote: quoteMatch ? cleanAIMarkdownArtifacts(quoteMatch[0].trim().slice(0, 110)) : `Подтверждено в опыте работы`,
        points: Math.max(3, Math.round(55 / pool.length)),
      });
    } else if (isPresentInHeaderOrList) {
      // Orphan skill: listed in header/skills list, but 0 proof in experience!
      orphanSkills.push({
        name: s.name,
        foundIn: "Шапка / Список навыков",
        reason: language === "en"
          ? "Listed only in skills list with 0 quotes in work experience"
          : "Указан только в списке навыков без доказательств в описании реального опыта",
        penalty: "0 баллов (Требуется подтверждение в опыте)",
      });
    } else {
      missingSkills.push(s.name);
    }
  });

  const hardSkillsRatio = pool.length > 0 ? verifiedSkills.length / pool.length : 0.6;
  const hardSkillsScore = Math.min(55, Math.round(hardSkillsRatio * 55));

  // 2. Quantified Metrics (15% max: %, $, руб, млн, тыс, x, ч, дн)
  const metricMatches = resumeText.match(/\b(\d+%\s*|\d+\s*(млн|тыс|руб|₽|\$|€|k|x|ч|дн|клиент|сдел|лид|договор))\b/gi) || [];
  let metricsScore = 3;
  if (metricMatches.length >= 4) metricsScore = 15;
  else if (metricMatches.length >= 2) metricsScore = 10;
  else if (metricMatches.length >= 1) metricsScore = 6;

  // 3. Soft Skills (15% max)
  const matchedSoft = UNIVERSAL_SOFT_SKILLS.filter((s) =>
    s.patterns.some((p) => normResume.includes(p))
  );
  let softSkillsScore = 4;
  if (matchedSoft.length >= 3) softSkillsScore = 15;
  else if (matchedSoft.length >= 2) softSkillsScore = 10;
  else if (matchedSoft.length >= 1) softSkillsScore = 7;

  // 4. ATS Clean Layout & Structure (15% max)
  const layoutIssues: LayoutIssue[] = [];
  let layoutScore = 15;

  // Multi-column or pipe tables detection
  if (/\|.*\|.*\|/.test(resumeText) || /\t\t+/.test(resumeText)) {
    layoutScore -= 5;
    layoutIssues.push({
      id: "tbl-cols",
      type: "column_collision",
      title: language === "en" ? "Multi-column / Tabular layout detected" : "Обнаружены признаки таблиц и колонок",
      description: language === "en"
        ? "ATS parsers read left-to-right, scrambling multi-column data into unreadable text."
        : "Многоколоночная вёрстка склеивает строки должностей и компаний при парсинге роботом ATS.",
      evidence: "Символы табуляции \\t\\t или пайпы | |",
      severity: "critical",
    });
  }

  // Broken date ranges (e.g. 2021 — \n 2023)
  if (/\b\d{4}\s*[-—]\s*[\r\n]+\s*\d{4}\b/.test(resumeText)) {
    layoutScore -= 3;
    layoutIssues.push({
      id: "split-dates",
      type: "broken_date",
      title: language === "en" ? "Broken date range" : "Разорванный диапазон дат",
      description: language === "en"
        ? "Year and month split across lines causes ATS to calculate 0 years of experience."
        : "Перенос годов через перевод строки приводит к тому, что робот не может корректно посчитать стаж.",
      evidence: "Разрыв строки в датах",
      severity: "warning",
    });
  }

  // Non-standard symbols and decorative bullets
  if (/[★✦◆■▲►✓✔→]/.test(resumeText)) {
    layoutScore -= 2;
    layoutIssues.push({
      id: "special-chars",
      type: "bad_character",
      title: language === "en" ? "Decorative non-standard bullets" : "Декоративные спецсимволы в списках",
      description: language === "en"
        ? "Symbols like ★, ✦, ✔ frequently turn into encoding errors in Taleo and Workday."
        : "Символы вроде ★, ✦, ✔ превращаются в нечитаемые символы в ATS-системах.",
      evidence: "Использование декоративных глифов вместо стандартных дефисов или точек",
      severity: "warning",
    });
  }

  // Contacts completeness check
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(resumeText);
  const hasPhone = /(?:\+7|8|\+1|\+44)[\d\s() -]{7,}/.test(resumeText);
  if (!hasEmail || !hasPhone) {
    layoutScore -= 3;
    layoutIssues.push({
      id: "missing-contacts",
      type: "missing_section",
      title: language === "en" ? "Incomplete contact block" : "Неполный блок контактов",
      description: language === "en"
        ? "Missing explicit email or international phone number in the top header."
        : "В верхней части резюме не найден явный email или телефон для связи.",
      evidence: "Email или телефон не найдены",
      severity: "critical",
    });
  }

  layoutScore = Math.max(4, Math.min(15, layoutScore));
  const totalScore = Math.min(98, Math.max(10, hardSkillsScore + metricsScore + softSkillsScore + layoutScore));

  // 5. Universal Profession-Aware XYZ Improvements
  const xyzImprovements: XyzImprovement[] = generateUniversalXyzSuggestions(resumeText, domain, language);

  // 6. AST JSON Representation
  const parsedAstJson = {
    parser_engine: "LaunchPad ATS Deterministic Engine v3.0 (Universal All-Professions)",
    detected_domain: domain.labelRu,
    compliance_standard: "Harvard & BigTech Single-Column AST",
    timestamp: "2026-ATS-AST-LIVE",
    candidate_profile: {
      email_detected: hasEmail,
      phone_detected: hasPhone,
      layout_score: `${layoutScore} / 15`,
    },
    scoring_breakdown: {
      hard_skills: `${hardSkillsScore} / 55 (Verified in work experience)`,
      quantified_metrics: `${metricsScore} / 15 (Numbers, %, руб, time)`,
      soft_skills: `${softSkillsScore} / 15 (Leadership, Collab, Process)`,
      layout_and_format: `${layoutScore} / 15 (Single-column Harvard AST)`,
      total_match_score: `${totalScore} / 100`,
    },
    verified_skills_quotes: verifiedSkills.map((v) => ({
      skill: v.name,
      evidence_quote: v.quote,
      points_awarded: v.points,
    })),
    orphan_skills_penalty: orphanSkills.map((o) => ({
      skill: o.name,
      penalty_reason: o.reason,
      points_awarded: 0,
    })),
    format_anomalies: layoutIssues.map((l) => ({
      code: l.id,
      severity: l.severity,
      description: l.description,
    })),
  };

  const rawTextStream = resumeText
    .split(/\r?\n/)
    .map((line, idx) => `[T-${String(idx + 1).padStart(3, "0")}] ${line.replace(/\s+/g, " ")}`)
    .join("\n");

  return {
    score: {
      total: totalScore,
      hardSkills: hardSkillsScore,
      metrics: metricsScore,
      softSkills: softSkillsScore,
      layout: layoutScore,
    },
    domainName: domain.labelRu,
    verifiedSkills,
    orphanSkills,
    missingSkills,
    layoutIssues,
    xyzImprovements,
    rawTextStream,
    parsedAstJson,
  };
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function generateUniversalXyzSuggestions(
  resumeText: string,
  domain: DomainKnowledge,
  language: "ru" | "en"
): XyzImprovement[] {
  const improvements: XyzImprovement[] = [];
  const lines = resumeText.split(/\r?\n/).filter((l) => l.trim().length > 15);

  const weakRegex = /(?:отвечал за|занимался|занималась|ведение|помощь в|участие в|делал|делала|работал над)\s+([^.,;\n]+)/i;

  lines.forEach((line, idx) => {
    const match = line.match(weakRegex);
    if (match) {
      const topic = match[1].trim();
      const cleanedLine = cleanAIMarkdownArtifacts(line.replace(/^[•\-*—\s]+/, ""));

      let improved = "";
      let metric = "";

      if (domain.domain === "accounting") {
        improved = `Стандартизировал ${topic}, сократив время закрытия отчетного периода на 35% и обеспечив 100% сдачу отчетности в ФНС без штрафов и замечаний`;
        metric = "-35% времени, 100% сдача";
      } else if (domain.domain === "sales") {
        improved = `Увеличил объем продаж через ${topic} на 28%, перевыполнив квартальный план KPI на 115% и сократив цикл сделки в 2 раза`;
        metric = "+28% продаж, 115% KPI";
      } else if (domain.domain === "marketing") {
        improved = `Оптимизировал ${topic}, снизив стоимость привлечения клиента (CPL/CAC) на 32% при росте общего объема лидов в 2.2 раза`;
        metric = "-32% CAC, 2.2x лиды";
      } else if (domain.domain === "logistics") {
        improved = `Перестроил ${topic}, уменьшив логистические издержки на 19% и повысив точность своевременных поставок (OTIF) до 98.6%`;
        metric = "-19% издержек, 98.6% OTIF";
      } else if (domain.domain === "legal") {
        improved = `Регламентировал ${topic}, сократив сроки согласования договоров на 40% и исключив правовые риски на сумму свыше 25 млн руб.`;
        metric = "-40% срок, 25 млн ₽ защита";
      } else if (domain.domain === "hr") {
        improved = `Автоматизировал ${topic}, сократив Time-to-Hire ключевых специалистов с 40 до 21 дня при удержании на испытательном сроке 94%`;
        metric = "Time-to-Hire -50%, 94% удержание";
      } else {
        improved = `Возглавил направление ${topic}, увеличив пропускную способность процессов на 30% и сократив время выполнения на 4 рабочих дня`;
        metric = "+30% скорость, -4 дня";
      }

      improvements.push({
        id: `xyz-${idx}`,
        original: cleanedLine,
        improved: `• ${improved}`,
        weakKeyword: match[0],
        metricsAdded: [metric],
        scoreBoost: 6,
      });
    }
  });

  // If no raw pattern matched, provide domain-specific XYZ presets
  if (improvements.length === 0) {
    if (domain.domain === "accounting") {
      improvements.push({
        id: "xyz-acc-1",
        original: "Ведение первичной документации и подготовка налоговых деклараций.",
        improved: "• Автоматизировал обработку первичной документации в 1С 8.3 и ЭДО (Диадок), сократив срок закрытия месяца с 10 до 4 рабочих дней и сэкономив 4.2 млн ₽.",
        weakKeyword: "Ведение / Подготовка",
        metricsAdded: ["10 -> 4 дня", "+4.2 млн ₽"],
        scoreBoost: 7,
      });
    } else if (domain.domain === "sales") {
      improvements.push({
        id: "xyz-sal-1",
        original: "Работа с клиентами в CRM и выполнение плана продаж.",
        improved: "• Внедрил воронку в AmoCRM и автоматические триггеры, увеличив конверсию лида в оплату на 24% и перевыполнив план выручки на 122%.",
        weakKeyword: "Работа с клиентами",
        metricsAdded: ["+24% конверсия", "122% план"],
        scoreBoost: 7,
      });
    } else {
      improvements.push({
        id: "xyz-gen-1",
        original: "Отвечал за операционные задачи и координацию подразделения.",
        improved: "• Оптимизировал ключевые рабочие регламенты подразделения, повысив общую производительность на 32% и снизив число операционных ошибок до 0.4%.",
        weakKeyword: "Отвечал за",
        metricsAdded: ["+32% производительность", "0.4% ошибок"],
        scoreBoost: 6,
      });
    }
  }

  return improvements;
}
