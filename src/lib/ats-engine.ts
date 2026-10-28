import { cleanAIMarkdownArtifacts } from './monetization';

export interface HeuristicATSInput {
  resumeText: string;
  jobDescription: string;
  jobTitle?: string;
  companyName?: string;
  language?: 'ru' | 'en';
}

export interface HeuristicATSResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  criticalIssues: string[];
  improvements: {
    category: string;
    original: string;
    suggested: string;
    reason: string;
  }[];
  coverLetter: string;
}

export function analyzeATSDeterministically(input: HeuristicATSInput): HeuristicATSResult {
  const {
    resumeText,
    jobDescription,
    jobTitle = 'Специалист',
    companyName = 'Компания',
    language = 'ru',
  } = input;

  const resumeLower = (resumeText || '').toLowerCase();
  const descLower = (jobDescription || '').toLowerCase();

  const techDictionary = [
    'react', 'next.js', 'typescript', 'javascript', 'vue', 'angular',
    'node.js', 'python', 'django', 'fastapi', 'go', 'golang', 'java',
    'spring', 'docker', 'kubernetes', 'k8s', 'ci/cd', 'git', 'sql',
    'postgresql', 'mysql', 'mongodb', 'redis', 'kafka', 'graphql',
    'rest api', 'tailwind', 'redux', 'mobx', 'jest', 'cypress', 'playwright',
    'aws', 'gcp', 'linux', 'agile', 'scrum', 'kanban', 'jira', 'figma',
    'microservices', 'unit testing', 'system design', 'seo', 'highload',
  ];

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const term of techDictionary) {
    const inDesc = descLower.includes(term);
    const inResume = resumeLower.includes(term);

    if (inDesc && inResume) {
      matchedKeywords.push(term);
    } else if (inDesc && !inResume) {
      missingKeywords.push(term);
    }
  }

  const rawCriticalIssues: string[] = [];
  if (missingKeywords.length > 0) {
    rawCriticalIssues.push(
      `В тексте резюме не найдены ключевые требования вакансии: ${missingKeywords.slice(0, 5).join(', ')}.`
    );
  }
  if (!/\b(\d{1,3}%|\d+\s*(млн|тыс|руб|\$|k|x|ч|дн))\b/i.test(resumeText)) {
    rawCriticalIssues.push(
      'Мало оцифрованных достижений. Рекомендуется переписать буллеты по формуле: Достиг [X], измерив [Y], сделав [Z].'
    );
  }
  if (resumeText.length < 500) {
    rawCriticalIssues.push(
      'Слишком короткий объём текста резюме для прохождения многоуровневого ATS-парсинга.'
    );
  }

  const rawImprovements = [
    {
      category: 'Оцифровка результатов',
      original: 'Занимался разработкой и поддержкой ключевых сервисов проекта.',
      suggested: 'Разработал и запустил 3 микросервиса на стеке проекта, сократив время отклика API на 35% и снизив нагрузку на базу данных.',
      reason: 'Конкретные метрики увеличивают шанс прохождения ATS-скрининга в 2.4 раза.',
    },
    {
      category: 'Ключевые слова',
      original: 'Работал с базами данных и оптимизацией запросов.',
      suggested: `Проектировал схему данных в PostgreSQL/Redis, оптимизировал сложные SQL-запросы, обеспечив стабильную работу при 15 000 RPS.`,
      reason: 'Точное попадание в стек из описания вакансии поднимает рейтинг релевантности.',
    },
  ];

  const totalEvaluated = matchedKeywords.length + missingKeywords.length;
  const matchRatio = totalEvaluated > 0 ? matchedKeywords.length / totalEvaluated : 0.65;
  const score = Math.round(Math.min(96, Math.max(48, matchRatio * 100)));

  const rawCoverLetter = language === 'en'
    ? `Dear Hiring Team at ${companyName},

I am writing to express my strong enthusiasm for the ${jobTitle} position at ${companyName}. With hands-on expertise in ${matchedKeywords.slice(0, 4).join(', ') || 'modern software architecture and product engineering'}, I have consistently delivered measurable outcomes across high-impact initiatives.

In my previous roles, I focused on building reliable systems, improving workflow performance, and collaborating closely with cross-functional teams to exceed core metrics. Your team's current focus strongly resonates with my professional background, and I am eager to contribute directly to ${companyName}'s strategic goals.

Thank you for your consideration. I look forward to the opportunity to discuss how my skillset aligns with your needs.

Sincerely,
Candidate`
    : `Здравствуйте, команда ${companyName}!

Меня искренне заинтересовала вакансия «${jobTitle}» в вашей компании. Обладая практическим опытом работы с ${matchedKeywords.slice(0, 4).join(', ') || 'ключевым стеком технологий и продуктовыми метриками'}, я успешно решаю задачи проектирования надёжных решений и оптимизации рабочих процессов.

На предыдущих проектах моим приоритетом всегда была доставка измеримого результата для бизнеса: повышение скорости работы систем, слаженная командная разработка и внимание к качеству кода. Задачи ${companyName} полностью соответствуют моему профилю, и я буду рад внести ощутимый вклад в развитие ваших продуктов.

Буду рад встретиться на онлайн-собеседовании, чтобы детальнее обсудить текущие вызовы команды.

С уважением,
Кандидат`;

  return {
    score,
    matchedKeywords,
    missingKeywords,
    criticalIssues: rawCriticalIssues.map(cleanAIMarkdownArtifacts),
    improvements: rawImprovements.map((item) => ({
      ...item,
      original: cleanAIMarkdownArtifacts(item.original),
      suggested: cleanAIMarkdownArtifacts(item.suggested),
      reason: cleanAIMarkdownArtifacts(item.reason),
    })),
    coverLetter: cleanAIMarkdownArtifacts(rawCoverLetter),
  };
}
