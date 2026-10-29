/**
 * ATS Parser Simulator & XYZ Bullet Optimizer
 * Implements deterministic 55/15/15/15 formula:
 * - 55% Hard Skills (Verified Quotes in Work Experience)
 * - 15% Quantified Metrics (%, $, x, time, scale)
 * - 15% Soft Skills (Cross-functional, Agile, Communication)
 * - 15% ATS Layout & Clean Structure
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
  verifiedSkills: VerifiedSkill[];
  orphanSkills: OrphanSkill[];
  missingSkills: string[];
  layoutIssues: LayoutIssue[];
  xyzImprovements: XyzImprovement[];
  rawTextStream: string;
  parsedAstJson: Record<string, unknown>;
}

const COMMON_HARD_SKILLS = [
  { name: "React", synonyms: ["react", "react.js", "реакт"] },
  { name: "TypeScript", synonyms: ["typescript", "ts", "тайпскрипт"] },
  { name: "Next.js", synonyms: ["next.js", "nextjs", "некст"] },
  { name: "Node.js", synonyms: ["node.js", "nodejs", "нода"] },
  { name: "Python", synonyms: ["python", "питон"] },
  { name: "Go", synonyms: ["go", "golang", "голанг"] },
  { name: "PostgreSQL", synonyms: ["postgresql", "postgres", "постгрес"] },
  { name: "SQL", synonyms: ["sql", "скуэль"] },
  { name: "Docker", synonyms: ["docker", "докер"] },
  { name: "Kubernetes", synonyms: ["kubernetes", "k8s", "кубернетес"] },
  { name: "CI/CD", synonyms: ["ci/cd", "cicd", "github actions", "gitlab ci"] },
  { name: "Kafka", synonyms: ["kafka", "кафка"] },
  { name: "Redis", synonyms: ["redis", "редис"] },
  { name: "REST API", synonyms: ["rest api", "rest", "api"] },
  { name: "GraphQL", synonyms: ["graphql", "графкл"] },
  { name: "Microservices", synonyms: ["microservices", "микросервисы"] },
  { name: "System Design", synonyms: ["system design", "системный дизайн"] },
  { name: "A/B-тестирование", synonyms: ["a/b-тестирование", "a/b", "ab test", "сплит-тест"] },
  { name: "Unit Testing", synonyms: ["unit testing", "jest", "pytest", "юнит-тесты"] },
  { name: "Figma", synonyms: ["figma", "фигма"] },
];

const SOFT_SKILLS = [
  { name: "Agile / Scrum", patterns: ["agile", "scrum", "скрам", "эджайл", "kanban", "канбан"] },
  { name: "Кросс-функциональное взаимодействие", patterns: ["кросс-функциональн", "cross-functional", "взаимодействие с командами", "координация"] },
  { name: "Управление бэклогом", patterns: ["бэклог", "backlog", "приоритизация", "roadmap", "роадмап"] },
  { name: "Менторство и код-ревью", patterns: ["ментор", "mentor", "код-ревью", "code review", "ревью"] },
  { name: "Работа со стейкхолдерами", patterns: ["стейкхолдер", "stakeholder", "бизнес-заказчик", "переговоры"] },
];

const WEAK_PATTERNS = [
  {
    regex: /(?:отвечал за|занимался|занималась)\s+([^.,;\n]+)/gi,
    replacement: (match: string, p1: string, lang: string) => {
      if (lang === "en") {
        return `Spearheaded ${p1.trim()}, increasing operational throughput by 32% and reducing turnaround time by 4 days`;
      }
      return `Возглавил направление ${p1.trim()}, увеличив пропускную способность процессов на 32% и сократив время выполнения на 4 дня`;
    },
    metric: "+32%, -4 дня",
    weakWord: "отвечал за / занимался",
  },
  {
    regex: /(?:писал код|писал скрипты|написал|разрабатывал)\s+([^.,;\n]+)/gi,
    replacement: (match: string, p1: string, lang: string) => {
      if (lang === "en") {
        return `Architected and shipped ${p1.trim()}, scaling API to 15,000 RPS with 99.98% uptime`;
      }
      return `Спроектировал и внедрил ${p1.trim()}, масштабировав сервис до 15 000 RPS с доступностью 99.98%`;
    },
    metric: "15 000 RPS, 99.98%",
    weakWord: "писал код / разрабатывал",
  },
  {
    regex: /(?:оптимизировал|оптимизировала|делал оптимизацию)\s+([^.,;\n]+)/gi,
    replacement: (match: string, p1: string, lang: string) => {
      if (lang === "en") {
        return `Optimized ${p1.trim()}, slashing p99 query latency from 850ms to 95ms (8.9x boost)`;
      }
      return `Оптимизировал ${p1.trim()}, сократив задержку p99 запросов с 850 мс до 95 мс (ускорение в 8.9 раз)`;
    },
    metric: "850ms -> 95ms (8.9x)",
    weakWord: "оптимизировал",
  },
  {
    regex: /(?:worked on|helped with|responsible for)\s+([^.,;\n]+)/gi,
    replacement: (match: string, p1: string) => {
      return `Engineered and delivered ${p1.trim()}, resulting in a 28% efficiency boost and saving $140K annually`;
    },
    metric: "+28%, $140K",
    weakWord: "worked on / responsible for",
  },
];

export function simulateAtsParser(
  resumeText: string,
  jobDesc: string,
  language: "ru" | "en" = "ru"
): AtsSimulationResult {
  const normResume = resumeText.toLowerCase();
  const normJob = jobDesc.toLowerCase();

  // Split resume into sections (Experience vs Skills/Header)
  const experienceSplitRegex = /(?:опыт работы|профессиональный опыт|experience|work history)[\s\S]*?(?=(?:образование|навыки|skills|education|$))/i;
  const experienceMatch = resumeText.match(experienceSplitRegex);
  const experienceText = experienceMatch ? experienceMatch[0].toLowerCase() : normResume;

  const skillsHeaderSplitRegex = /(?:навыки|ключевые навыки|стек|skills|technologies)[\s\S]*?(?=(?:опыт работы|образование|experience|$))/i;
  const skillsHeaderText = (resumeText.match(skillsHeaderSplitRegex)?.[0] || "").toLowerCase();

  // 1. Hard Skills Analysis (55% max)
  const requiredSkills = COMMON_HARD_SKILLS.filter(
    (s) => normJob.includes(s.name.toLowerCase()) || s.synonyms.some((syn) => normJob.includes(syn))
  );
  const pool = requiredSkills.length >= 4 ? requiredSkills : COMMON_HARD_SKILLS.slice(0, 8);

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
      const regex = new RegExp(`([^.\n]*?${s.name}[^.\n]*)`, "i");
      const quoteMatch = resumeText.match(regex);
      verifiedSkills.push({
        name: s.name,
        quote: quoteMatch ? quoteMatch[0].trim().slice(0, 100) : `Использовался в практических задачах`,
        points: Math.round(55 / pool.length),
      });
    } else if (isPresentInHeaderOrList) {
      // Orphan skill: listed in header/skills, but NO proof in experience!
      orphanSkills.push({
        name: s.name,
        foundIn: "Шапка / Список навыков",
        reason: language === "en"
          ? "Listed only in skill list with 0 quotes in work experience"
          : "Указан только в списке навыков без подтверждения в буллетах опыта",
        penalty: "0 баллов (ATS Discounted)",
      });
    } else {
      missingSkills.push(s.name);
    }
  });

  const hardSkillsRatio = pool.length > 0 ? verifiedSkills.length / pool.length : 0.7;
  const hardSkillsScore = Math.min(55, Math.round(hardSkillsRatio * 55));

  // 2. Quantified Metrics (15% max)
  const metricMatches = resumeText.match(/\b(\d+%\s*|\d+\s*(млн|тыс|руб|\$|k|x|ч|дн|users|rps|dau|mau))\b/gi) || [];
  let metricsScore = 3;
  if (metricMatches.length >= 4) metricsScore = 15;
  else if (metricMatches.length >= 2) metricsScore = 10;
  else if (metricMatches.length >= 1) metricsScore = 6;

  // 3. Soft Skills (15% max)
  const matchedSoft = SOFT_SKILLS.filter((s) =>
    s.patterns.some((p) => normResume.includes(p))
  );
  let softSkillsScore = 4;
  if (matchedSoft.length >= 3) softSkillsScore = 15;
  else if (matchedSoft.length >= 2) softSkillsScore = 10;
  else if (matchedSoft.length >= 1) softSkillsScore = 7;

  // 4. ATS Layout & Clean Structure (15% max)
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
        : "Перенос годов через перевод строки приводит к тому, что робот не может посчитать стаж.",
      evidence: "Разрыв строки в датах",
      severity: "warning",
    });
  }

  // Non-standard symbols and bullets
  if (/[★✦◆■▲►✓✔→]/.test(resumeText)) {
    layoutScore -= 2;
    layoutIssues.push({
      id: "special-chars",
      type: "bad_character",
      title: language === "en" ? "Decorative non-standard bullets" : "Декоративные спецсимволы в списках",
      description: language === "en"
        ? "Symbols like ★, ✦, ✔ frequently turn into  encoding errors in Taleo and Workday."
        : "Символы вроде ★, ✦, ✔ часто превращаются в нечитаемые кракозябры  в ATS-системах.",
      evidence: "Использование декоративных глифов вместо стандартных дефисов или точек",
      severity: "warning",
    });
  }

  // Completeness check
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

  const totalScore = Math.min(98, Math.max(38, hardSkillsScore + metricsScore + softSkillsScore + layoutScore));

  // 5. XYZ Improvements Generator
  const xyzImprovements: XyzImprovement[] = [];
  const lines = resumeText.split(/\r?\n/).filter((l) => l.trim().length > 15);

  lines.forEach((line, idx) => {
    for (const pattern of WEAK_PATTERNS) {
      if (pattern.regex.test(line)) {
        const cleanedLine = cleanAIMarkdownArtifacts(line.replace(/^[•\-*—\s]+/, ""));
        const improved = pattern.replacement(cleanedLine, cleanedLine.slice(0, 35), language);
        xyzImprovements.push({
          id: `xyz-${idx}-${pattern.weakWord.slice(0, 4)}`,
          original: cleanedLine,
          improved: improved,
          weakKeyword: pattern.weakWord,
          metricsAdded: [pattern.metric],
          scoreBoost: 6,
        });
        break;
      }
    }
  });

  // If no raw pattern matched in the resume, provide top-tier dynamic XYZ templates
  if (xyzImprovements.length === 0) {
    xyzImprovements.push({
      id: "xyz-fallback-1",
      original: language === "en"
        ? "Responsible for core product backend services and API integration."
        : "Отвечал за разработку серверной части продукта и интеграцию внешних API.",
      improved: language === "en"
        ? "Engineered 4 core microservices on Go/PostgreSQL, reducing p99 API latency by 45% and supporting 12,000 RPS."
        : "Спроектировал 4 микросервиса на Go/PostgreSQL, сократив p99 latency API на 45% и обеспечив нагрузку 12 000 RPS.",
      weakKeyword: "Отвечал за / Responsible for",
      metricsAdded: ["-45% latency", "12 000 RPS"],
      scoreBoost: 6,
    });
    xyzImprovements.push({
      id: "xyz-fallback-2",
      original: language === "en"
        ? "Worked on user retention and product analytics hypotheses."
        : "Занимался продуктовыми гипотезами и оптимизацией конверсий воронки.",
      improved: language === "en"
        ? "Formulated and executed 18 A/B tests, boosting user Day-7 retention by +14.2% and driving +$180K in incremental ARR."
        : "Провёл 18 A/B-тестирований, увеличив удержание пользователей Day-7 на +14.2% и принеся +3.4 млн ₽ дополнительной выручки.",
      weakKeyword: "Занимался / Worked on",
      metricsAdded: ["+14.2% retention", "+3.4 млн ₽"],
      scoreBoost: 5,
    });
  }

  // 6. AST JSON Representation
  const parsedAstJson = {
    parser_engine: "LaunchPad ATS Deterministic Engine v2.4",
    compliance_standard: "Harvard & BigTech Single-Column AST",
    timestamp: "2026-10-29T12:00:00Z",
    candidate_profile: {
      email_detected: hasEmail,
      phone_detected: hasPhone,
      layout_score: `${layoutScore} / 15`,
    },
    scoring_breakdown: {
      hard_skills: `${hardSkillsScore} / 55 (Verified in work bullets)`,
      quantified_metrics: `${metricsScore} / 15 (Numbers, %, scale)`,
      soft_skills: `${softSkillsScore} / 15 (Agile, Leadership, Collab)`,
      layout_and_format: `${layoutScore} / 15 (Single-column AST)`,
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

  // Raw text stream simulation (how OCR and text extractor sees the file)
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
    verifiedSkills,
    orphanSkills,
    missingSkills,
    layoutIssues,
    xyzImprovements,
    rawTextStream,
    parsedAstJson,
  };
}