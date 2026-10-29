import { cleanAIMarkdownArtifacts } from "./monetization";
import { extractDynamicJobRequirements } from "./ats-parser-simulator";

export interface HeuristicATSInput {
  resumeText: string;
  jobDescription: string;
  jobTitle?: string;
  companyName?: string;
  language?: "ru" | "en";
}

export interface HeuristicATSResult {
  score: number;
  domainName: string;
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

/**
 * Universal ATS Analyzer for ANY profession:
 * Dynamically extracts skills based on the job description,
 * whether it's an Accountant, Sales Manager, Marketer, Lawyer, Engineer, or Dev!
 */
export function analyzeATSDeterministically(input: HeuristicATSInput): HeuristicATSResult {
  const {
    resumeText,
    jobDescription,
    jobTitle = "Специалист",
    companyName = "Компания",
    language = "ru",
  } = input;

  const resumeLower = (resumeText || "").toLowerCase();

  // Extract dynamic requirements from the job description
  const { domain, skills } = extractDynamicJobRequirements(jobDescription);

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const s of skills) {
    const isDirect = resumeLower.includes(s.name.toLowerCase());
    const isSynonym = s.synonyms.some((syn) => resumeLower.includes(syn));

    if (isDirect || isSynonym) {
      matchedKeywords.push(s.name);
    } else {
      missingKeywords.push(s.name);
    }
  }

  const rawCriticalIssues: string[] = [];
  if (missingKeywords.length > 0) {
    rawCriticalIssues.push(
      `В тексте резюме не найдены ключевые требования вакансии («${domain.labelRu}»): ${missingKeywords.slice(0, 4).join(", ")}.`
    );
  }
  if (!/\b(\d{1,3}%|\d+\s*(млн|тыс|руб|₽|\$|€|k|x|ч|дн|клиент|сдел|лид))\b/i.test(resumeText)) {
    rawCriticalIssues.push(
      "Мало оцифрованных достижений. Рекомендуется переписать буллеты по формуле: Достиг [X], измерив [Y], сделав [Z]."
    );
  }
  if (resumeText.length < 400) {
    rawCriticalIssues.push(
      "Слишком короткий объём текста резюме для прохождения многоуровневого ATS-парсинга."
    );
  }

  const rawImprovements = [
    {
      category: "Оцифровка результатов (X-Y-Z)",
      original: "Отвечал за ведение ключевых рабочих задач и взаимодействие с командой.",
      suggested:
        domain.domain === "accounting"
          ? "Стандартизировал ведение учета в 1С 8.3, сократив время закрытия отчетного месяца с 10 до 4 рабочих дней и сдав отчетность в ФНС со 100% точностью."
          : domain.domain === "sales"
          ? "Оптимизировал ведение воронки в AmoCRM, увеличив конверсию сделок на 24% и перевыполнив квартальный план на 118%."
          : "Оптимизировал ключевые рабочие регламенты подразделения, повысив общую производительность на 30% и сократив время выполнения операций на 4 дня.",
      reason: "Формула Google XYZ даёт наивысший балл при скрининге нанимающим менеджером и ATS.",
    },
  ];

  const totalEvaluated = matchedKeywords.length + missingKeywords.length;
  const score = totalEvaluated > 0
    ? Math.min(96, Math.max(45, Math.round((matchedKeywords.length / totalEvaluated) * 60 + 35)))
    : 72;

  const coverLetter = `Здравствуйте, команда ${companyName}!

С большим интересом направляю отклик на позицию «${jobTitle}». Мой профессиональный опыт сфокусирован на задачах сферы «${domain.labelRu}», в частности: ${matchedKeywords.slice(0, 3).join(", ") || "достижении оцифрованных результатов"}.

На предыдущем месте работы мне удалось повысить операционную эффективность на 30%+ и сократить временные издержки при строгом соблюдении стандартов качества. Уверен, что мои практические компетенции позволят ${companyName} быстрее достигать поставленных целей.

Буду рад встретиться на онлайн-интервью и подробнее обсудить детали сотрудничества.

С уважением,
Соискатель`;

  return {
    score,
    domainName: domain.labelRu,
    matchedKeywords,
    missingKeywords,
    criticalIssues: rawCriticalIssues.map(cleanAIMarkdownArtifacts),
    improvements: rawImprovements.map((imp) => ({
      category: cleanAIMarkdownArtifacts(imp.category),
      original: cleanAIMarkdownArtifacts(imp.original),
      suggested: cleanAIMarkdownArtifacts(imp.suggested),
      reason: cleanAIMarkdownArtifacts(imp.reason),
    })),
    coverLetter: cleanAIMarkdownArtifacts(coverLetter),
  };
}
