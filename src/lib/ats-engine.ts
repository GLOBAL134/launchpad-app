import { ATSAnalysisResponse, ResumeImprovement, SkillMatchEvidence } from '../types/launchpad';

const KNOWN_HARD_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue', 'Angular', 'Node.js', 'Python',
  'Java', 'C#', 'C++', 'Go', 'Golang', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin',
  'HTML', 'CSS', 'Tailwind', 'SASS', 'Redux', 'GraphQL', 'REST API', 'gRPC',
  'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase', 'Prisma',
  'AWS', 'Azure', 'GCP', 'Docker',
  'Kubernetes', 'CI/CD', 'GitHub Actions', 'Terraform',
  'Linux', 'Git', 'Webpack', 'Vite', 'Jest', 'Playwright', 'Cypress', 'Testing',
  'Machine Learning', 'AI', 'LLM', 'PyTorch', 'TensorFlow', 'Pandas', 'Data Analysis',
  'Figma', 'UI/UX', 'Product Management', 'Agile', 'Scrum', 'Jira', 'SEO', 'B2B', 'SaaS'
];

const KNOWN_SOFT_SKILLS = [
  'Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Ownership',
  'Mentoring', 'Time Management', 'Adaptability', 'Critical Thinking', 'Cross-functional',
  'Коммуникабельность', 'Лидерство', 'Командная работа', 'Ответственность', 'Аналитическое мышление',
  'Менторство', 'Самостоятельность', 'Управление проектами', 'Внимание к деталям'
];

function splitIntoSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?; \n])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function extractDynamicKeywordsFromJD(jobDescription: string): {
  hardSkills: string[];
  softSkills: string[];
} {
  const jdLower = jobDescription.toLowerCase();

  const foundHard = KNOWN_HARD_SKILLS.filter((skill) => {
    const pattern = new RegExp(`(^|[^a-zA-Za-яА-Я0-9])${escapeRegExp(skill.toLowerCase())}([^a-zA-Za-яА-Я0-9]|$)`, 'i');
    return pattern.test(jdLower);
  });

  // Дополнительно извлекаем капитализированные технические термины из описания вакансии
  const customTechMatches = jobDescription.match(/\b[A-Z][a-zA-Z0-9+#.]{2,15}\b/g) || [];
  const stopWords = new Set([
    'The', 'And', 'For', 'With', 'You', 'Will', 'Are', 'Our', 'We', 'This', 'That',
    'What', 'Who', 'Why', 'How', 'From', 'Have', 'Has', 'Not', 'But', 'All', 'Can',
    'Job', 'Work', 'Team', 'Role', 'Company', 'Experience', 'Skills', 'Requirements',
    'Responsibilities', 'Benefits', 'Salary', 'Location', 'Remote', 'Full', 'Time'
  ]);

  for (const token of customTechMatches) {
    if (
      !stopWords.has(token) &&
      !foundHard.some((h) => h.toLowerCase() === token.toLowerCase()) &&
      foundHard.length < 18
    ) {
      foundHard.push(token);
    }
  }

  const foundSoft = KNOWN_SOFT_SKILLS.filter((skill) =>
    jdLower.includes(skill.toLowerCase())
  );

  return {
    hardSkills: foundHard.length > 0 ? foundHard : ['JavaScript', 'React', 'TypeScript', 'Git', 'REST API'],
    softSkills: foundSoft.length > 0 ? foundSoft : ['Problem Solving', 'Teamwork', 'Communication'],
  };
}

export function runDeterministicATSAnalysis(params: {
  resumeText: string;
  jobDescription: string;
  jobTitle: string;
  companyName: string;
  language?: 'ru' | 'en';
}): ATSAnalysisResponse {
  const { resumeText, jobDescription, jobTitle, companyName, language = 'ru' } = params;
  const resumeSentences = splitIntoSentences(resumeText);
  const resumeLower = resumeText.toLowerCase();

  const { hardSkills, softSkills } = extractDynamicKeywordsFromJD(jobDescription);

  const matchedHardSkills: SkillMatchEvidence[] = [];
  const missingHardSkills: string[] = [];

  for (const skill of hardSkills) {
    const regex = new RegExp(`(^|[^a-zA-Za-яА-Я0-9])${escapeRegExp(skill.toLowerCase())}([^a-zA-Za-яА-Я0-9]|$)`, 'i');
    const evidenceSentence = resumeSentences.find((sentence) => regex.test(sentence.toLowerCase()));

    if (evidenceSentence) {
      matchedHardSkills.push({
        skill,
        foundInResume: true,
        resumeQuoteEvidence: evidenceSentence.slice(0, 180),
        category: 'hard',
      });
    } else {
      missingHardSkills.push(skill);
    }
  }

  const matchedSoftSkills: string[] = [];
  const missingSoftSkills: string[] = [];

  for (const skill of softSkills) {
    if (resumeLower.includes(skill.toLowerCase())) {
      matchedSoftSkills.push(skill);
    } else {
      missingSoftSkills.push(skill);
    }
  }

  // Извлекаем реальные измеримые достижения (проценты, деньги, кратный рост, числа с контекстом)
  const metricRegex = /\b(\d+(?:[.,]\d+)?\s*(?:%|процент|раз|x|k|m|млн|\$|€|₽|users|пользовател|клиент|ms|мс|сек))\b/gi;
  const measurableMetricsFound = Array.from(
    new Set((resumeText.match(metricRegex) || []).map((m) => m.trim()))
  ).slice(0, 10);

  // Оценка структуры резюме (наличие ключевых разделов и контактов)
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
  const hasPhoneOrLink = /(\+?\d[\d\s-()]{7,}\d|github\.com|linkedin\.com|t\.me)/i.test(resumeText);
  const hasExperienceSection = /(experience|опыт работы|проекты|work history|employment)/i.test(resumeText);
  const hasSkillsSection = /(skills|навыки|стек|технологии|competencies)/i.test(resumeText);
  const hasEducationSection = /(education|образование|университет|курсы|university)/i.test(resumeText);
  const wordCount = resumeText.trim().split(/\s+/).length;
  const optimalLength = wordCount >= 120 && wordCount <= 1200;

  const structureChecks = [
    hasEmail,
    hasPhoneOrLink,
    hasExperienceSection,
    hasSkillsSection,
    hasEducationSection,
    optimalLength,
  ];

  const structureScore = Math.round(
    (structureChecks.filter(Boolean).length / structureChecks.length) * 100
  );

  const hardSkillsScore = hardSkills.length > 0 ? Math.round((matchedHardSkills.length / hardSkills.length) * 100) : 75;
  const softSkillsScore = softSkills.length > 0 ? Math.round((matchedSoftSkills.length / softSkills.length) * 100) : 80;
  const impactScore = Math.min(100, Math.round((measurableMetricsFound.length / 4) * 100));

  // Честная взвешенная формула
  const atsScore = Math.round(
    hardSkillsScore * 0.55 +
    softSkillsScore * 0.15 +
    impactScore * 0.15 +
    structureScore * 0.15
  );

  // Формируем список критических замечаний только по реальным фактам
  const criticalIssues: string[] = [];
  if (!hasEmail || !hasPhoneOrLink) {
    criticalIssues.push('В резюме не обнаружены полные контактные данные (Email, телефон или ссылка на LinkedIn/GitHub).');
  }
  if (missingHardSkills.length > 0) {
    criticalIssues.push(
      `Отсутствуют ключевые технические маркеры вакансии: ${missingHardSkills.slice(0, 5).join(', ')}. ATS-фильтр может понизить приоритет отклика.`
    );
  }
  if (measurableMetricsFound.length < 2) {
    criticalIssues.push(
      'Мало оцифрованных достижений. Добавьте конкретные метрики (например: ускорил загрузку на 35%, сократил время сборки в 2 раза).'
    );
  }
  if (wordCount < 120) {
    criticalIssues.push(
      `Слишком краткий объём резюме (${wordCount} слов). Рекомендуемый объём для прохождения скрининга — от 250 до 700 слов.`
    );
  }

  // Конкретные рекомендации по улучшению реальных предложений из резюме
  const improvements: ResumeImprovement[] = [];
  const weakSentence = resumeSentences.find(
    (s) => s.length > 25 && s.length < 140 && !/\d/.test(s)
  );

  if (weakSentence) {
    const targetSkill = missingHardSkills[0] || matchedHardSkills[0]?.skill || 'ключевых технологий';
    improvements.push({
      section: 'Опыт работы и достижения',
      originalSnippet: weakSentence,
      suggestedRewrite: `${weakSentence.replace(/\.$/, '')} с применением ${targetSkill}, что позволило повысить стабильность и ускорить поставку функционала на 25%.`,
      reason: 'Добавление конкретной технологии из вакансии и измеримого бизнес-результата (формула XYZ).',
    });
  }

  if (missingHardSkills.length > 0) {
    improvements.push({
      section: 'Блок ключевых навыков (Skills)',
      originalSnippet: 'Текущий список навыков не содержит часть терминов из описания вакансии.',
      suggestedRewrite: `Добавьте в раздел навыков (если вы реально с ними знакомы): ${missingHardSkills.slice(0, 6).join(' • ')}`,
      reason: 'Точное совпадение ключевых слов напрямую повышает ранжирование в парсерах рекрутеров.',
    });
  }

  // Генерация сопроводительного письма строго на основе подтверждённых навыков из резюме
  const verifiedSkillNames = matchedHardSkills.map((m) => m.skill).slice(0, 6);
  const topQuote = matchedHardSkills[0]?.resumeQuoteEvidence || resumeSentences[0] || '';

  const coverLetter = language === 'ru'
    ? `Здравствуйте, команда ${companyName}!

Пишу вам, чтобы откликнуться на позицию «${jobTitle}». Изучив описание ваших задач, я увидел прямое пересечение со своим практическим опытом.

В рамках предыдущих проектов я работал со следующим стеком и инструментами, которые востребованы в вашей вакансии: ${
  verifiedSkillNames.length > 0 ? verifiedSkillNames.join(', ') : 'разработка и оптимизация современных веб-решений'
}.
${topQuote ? `\nКлючевой фокус моего опыта: «${topQuote}».\n` : ''}${
  measurableMetricsFound.length > 0
    ? `Я ориентируюсь на измеримый результат (в моём опыте есть подтверждённые показатели: ${measurableMetricsFound.slice(0, 3).join(', ')}) и умею быстро включаться в существующую архитектуру продукта.`
    : `Я ориентируюсь на чистоту архитектуры, соблюдение сроков и быструю интеграцию в рабочие процессы команды.`
}

Буду рад обсудить на коротком звонке, как мой опыт поможет команде ${companyName} в достижении текущих продуктовых целей.

С уважением,
Кандидат на позицию ${jobTitle}`
    : `Dear ${companyName} Hiring Team,

I am writing to express my strong interest in the ${jobTitle} position. After reviewing your job requirements, I am confident that my hands-on background aligns well with your team's goals.

My confirmed experience includes working with ${
  verifiedSkillNames.length > 0 ? verifiedSkillNames.join(', ') : 'modern software development practices'
}. ${topQuote ? `Specifically, my background includes: "${topQuote}".\n` : ''}
I focus on delivering maintainable solutions and measurable product impact. I would welcome the opportunity to discuss how my skills can contribute to ${companyName}.

Best regards,
Applicant for ${jobTitle}`;

  return {
    success: true,
    engineUsed: 'deterministic_nlp',
    atsScore,
    scoreBreakdown: {
      hardSkillsScore,
      softSkillsScore,
      impactScore,
      structureScore,
    },
    matchedHardSkills,
    missingHardSkills,
    matchedSoftSkills,
    missingSoftSkills,
    measurableMetricsFound,
    criticalIssues,
    improvements,
    coverLetter,
    analyzedAt: new Date().toISOString(),
  };
}
