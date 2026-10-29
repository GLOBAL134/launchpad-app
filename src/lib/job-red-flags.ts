/**
 * AI Job Red Flags & Toxicity Analyzer
 * Detects hidden risks, overwork indicators, unstable compensation, and culture traps.
 * Translates HR buzzwords into plain human language and prepares smart interview questions.
 */

export interface RedFlagTrigger {
  id: string;
  category: "overwork" | "compensation" | "culture" | "management" | "scope";
  categoryRu: string;
  severity: "high" | "medium" | "low";
  foundKeyword: string;
  humanTranslation: string;
  advice: string;
}

export interface JobRedFlagsAnalysis {
  adequacyScore: number; // 0 - 100%
  verdictTitle: string;
  verdictDescription: string;
  verdictTone: "safe" | "warning" | "danger";
  triggers: RedFlagTrigger[];
  recommendedQuestions: string[];
}

const RED_FLAG_DICTIONARY: Array<{
  regex: RegExp;
  category: "overwork" | "compensation" | "culture" | "management" | "scope";
  categoryRu: string;
  severity: "high" | "medium" | "low";
  keyword: string;
  translation: string;
  advice: string;
}> = [
  {
    regex: /(?:стрессоустойчивост|стрессоустойчив)/i,
    category: "overwork",
    categoryRu: "Переработки и хаос",
    severity: "high",
    keyword: "Стрессоустойчивость",
    translation: "Регулярный хаос в процессах, токсичное давление руководства или постоянный поток недовольных клиентов без нормальной поддержки.",
    advice: "Спросите: «С какими конкретно стрессовыми ситуациями чаще всего сталкивается специалист на этой позиции?»",
  },
  {
    regex: /(?:ненормированн|ненормированный рабочий|готовность к переработк|быть на связи 24\/7|на связи в выходн)/i,
    category: "overwork",
    categoryRu: "Режим работы",
    severity: "high",
    keyword: "Ненормированный рабочий день / 24/7",
    translation: "Переработки воспринимаются как должное и, скорее всего, не оплачиваются. Границы личного времени будут регулярно нарушаться.",
    advice: "Уточните: «Как часто сотрудники задерживаются после окончания рабочего дня и как эти часы компенсируются?»",
  },
  {
    regex: /(?:многозадачност|умение работать в режиме многозадачности)/i,
    category: "scope",
    categoryRu: "Размытые обязанности",
    severity: "medium",
    keyword: "Многозадачность",
    translation: "Совмещение обязанностей 2-3 сотрудников без дополнительной оплаты. Приоритеты будут меняться несколько раз в день.",
    advice: "Спросите: «Какие 3 главные метрики или задачи будут ключевыми для оценки моей работы в первые 3 месяца?»",
  },
  {
    regex: /(?:доход без потолка|высокий % с продаж|только процент|без оклада|оклад по договоренност)/i,
    category: "compensation",
    categoryRu: "Финансовая стабильность",
    severity: "high",
    keyword: "Доход без потолка / Высокий %",
    translation: "Гарантированный фиксированный оклад отсутствует или минимален (МРОТ). Весь обещанный доход привязан к жесткому труднодостижимому плану.",
    advice: "Обязательно спросите: «Каков гарантированный фиксированный оклад до вычета налогов и какой % сотрудников реально выполняет план на 100%?»",
  },
  {
    regex: /(?:мы как семья|семейная атмосфера|коллектив как семья)/i,
    category: "culture",
    categoryRu: "Культура компании",
    severity: "medium",
    keyword: "Мы как семья",
    translation: "В «семьях» не принято просить прибавку к зарплате, требовать оплаты переработок или соблюдать строгие должностные инструкции. Манипуляции чувством долга.",
    advice: "Спросите: «Как в компании устроены процессы регулярного пересмотра зарплаты и грейдов?»",
  },
  {
    regex: /(?:молодой дружный коллектив|печеньки и кофе|чай, печеньки)/i,
    category: "culture",
    categoryRu: "Офисная культура",
    severity: "low",
    keyword: "Молодой дружный коллектив / Печеньки",
    translation: "Часто используется как замена достойному соцпакету, ДМС или нормальной рыночной зарплате, либо указывает на высокую текучесть кадров.",
    advice: "Спросите: «Какая средняя продолжительность работы специалистов в этом отделе?»",
  },
  {
    regex: /(?:работа на результат без оправданий|жесткий контроль|штраф|система штрафов)/i,
    category: "management",
    categoryRu: "Стиль управления",
    severity: "high",
    keyword: "Штрафы / Работа без оправданий",
    translation: "Авторитарный стиль руководства, поиск виноватых вместо исправления системных ошибок, незаконные депремирования.",
    advice: "Спросите: «Как руководство реагирует на объективные сложности и форс-мажоры при выполнении проекта?»",
  },
  {
    regex: /(?:мастер на все руки|широкий круг задач|от чайника до стратегии|универсальный солдат)/i,
    category: "scope",
    categoryRu: "Размытая зона ответственности",
    severity: "medium",
    keyword: "Широкий круг задач / Мастер на все руки",
    translation: "Компания экономит на специализированных сотрудниках и ждёт, что один человек закроет функции целого отдела.",
    advice: "Спросите: «Есть ли в компании профильные специалисты по смежным задачам или вся ответственность на мне?»",
  },
  {
    regex: /(?:динамично развивающаяся|стартап в стадии|высокая неопределенность)/i,
    category: "management",
    categoryRu: "Стабильность процессов",
    severity: "low",
    keyword: "Высокая динамика / Неопределенность",
    translation: "Процессы не выстроены, регламентов нет, вам придется самостоятельно тушить пожары и на ходу изобретать регламенты.",
    advice: "Спросите: «Кто будет принимать решения по моим предложениям и насколько выстроена субординация?»",
  },
];

export function analyzeJobRedFlags(jobText: string): JobRedFlagsAnalysis {
  if (!jobText || jobText.trim().length < 30) {
    return {
      adequacyScore: 90,
      verdictTitle: "Слишком короткий текст для полного рентгена",
      verdictDescription: "Вставьте полное описание вакансии (обязанности, условия, требования) для глубокого поиска скрытых рисков.",
      verdictTone: "safe",
      triggers: [],
      recommendedQuestions: [
        "Каковы точные критерии успешности прохождения испытательного срока?",
        "Каков размер гарантированного фиксированного оклада на руки?",
        "Каковы причины открытия данной вакансии — расширение штата или замена сотрудника?",
      ],
    };
  }

  const triggers: RedFlagTrigger[] = [];
  let penaltyPoints = 0;

  for (const item of RED_FLAG_DICTIONARY) {
    if (item.regex.test(jobText)) {
      triggers.push({
        id: "rf-" + item.keyword.toLowerCase().replace(/[^a-zа-я0-9]/gi, "-"),
        category: item.category,
        categoryRu: item.categoryRu,
        severity: item.severity,
        foundKeyword: item.keyword,
        humanTranslation: item.translation,
        advice: item.advice,
      });

      if (item.severity === "high") penaltyPoints += 20;
      else if (item.severity === "medium") penaltyPoints += 12;
      else penaltyPoints += 6;
    }
  }

  // Calculate adequacy score (100 - penalties, capped at 100, min 25)
  const adequacyScore = Math.max(25, Math.min(100, 100 - penaltyPoints));

  let verdictTitle = "Безопасная и прозрачная вакансия";
  let verdictDescription = "Критичных скрытых ловушек в тексте не обнаружено. Обязанности и условия сформулированы профессионально.";
  let verdictTone: "safe" | "warning" | "danger" = "safe";

  if (adequacyScore < 60 || penaltyPoints >= 35) {
    verdictTitle = "Высокий риск токсичности и переработок";
    verdictDescription = "В тексте найдены маркеры жесткого давления, размытых обязанностей или нестабильной оплаты. Будьте предельно внимательны на интервью.";
    verdictTone = "danger";
  } else if (adequacyScore < 85 || penaltyPoints > 0) {
    verdictTitle = "Есть риски переработок и размытых зон";
    verdictDescription = "Вакансия рабочая, но требует обязательного прояснения зон ответственности и финансовой фиксации на собеседовании.";
    verdictTone = "warning";
  }

  // Generate top 3 questions based on found triggers or fallback
  const recommendedQuestions: string[] = [];
  if (triggers.length > 0) {
    for (const t of triggers.slice(0, 3)) {
      recommendedQuestions.push(t.advice.replace(/^Спросите:\s*«|»$/g, ""));
    }
  }

  // Fill up to 3 questions if needed
  const fallbackQuestions = [
    "Каковы точные критерии успешности прохождения испытательного срока на этой позиции?",
    "Какой процент сотрудников в вашем отделе стабильно выполняет установленный KPI?",
    "Почему открылась эта позиция: это расширение команды или уход предыдущего специалиста?",
  ];

  for (const q of fallbackQuestions) {
    if (recommendedQuestions.length < 3 && !recommendedQuestions.includes(q)) {
      recommendedQuestions.push(q);
    }
  }

  return {
    adequacyScore,
    verdictTitle,
    verdictDescription,
    verdictTone,
    triggers,
    recommendedQuestions,
  };
}
