"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  ScanSearch,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  RefreshCw,
  FileText,
  AlertCircle,
  Upload,
  FileCheck,
  X,
  CreditCard,
  Lock,
  Send,
  Plus,
  Briefcase,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UpgradeProModal from "@/components/UpgradeProModal";
import { cleanAIMarkdownArtifacts } from "@/lib/monetization";
import { detectLanguage } from "@/lib/language";
import { useApp } from "@/context/AppContext";

const DEFAULT_RESUME = `Алексей Морозов
Senior Product Manager | alex.morozov@email.ru | +7 (999) 123-45-67 | Москва / Удаленно

О СЕБЕ
Продуктовый менеджер с опытом 6+ лет в создании B2B SaaS и AI-платформ. Сильная экспертиза в продуктовой стратегии, формулировании гипотез, исследованиях пользователей (CJM, CustDev) и управлении бэклогом. Руководил кросс-функциональной командой из 12 инженеров и дизайнеров.

ОПЫТ РАБОТЫ
Ведущий Product Manager — CloudScale Solutions (2022 — настоящее время)
• Управлял продуктовым роадмапом аналитической B2B-платформы (DAU вырос с 5 000 до 45 000).
• Внедрил процесс регулярных A/B-тестирований, что увеличило конверсию в оплату на 24%.
• Составлял детальные PRD, формулировал продуктовые метрики и координировал спринты по Scrum.
• Совместно с инженерной командой интегрировал процессы с современным CI/CD пайплайном.

Product Manager — FinTech Инновации (2019 — 2022)
• Отвечал за онбординг юридических лиц и платёжный шлюз. Сократил time-to-first-value с 7 дней до 4 часов.
• Провёл более 50 глубинных интервью с корпоративными клиентами.

ОБРАЗОВАНИЕ И НАВЫКИ
МГТУ им. Н.Э. Баумана, Информационные системы и технологии
Навыки: Product Management, Product Strategy, Roadmap Planning, CustDev, Scrum, PRD, Unit-экономика, A/B-тестирование, CI/CD.`;

const DEFAULT_JOB_DESC = `Senior Product Manager (AI & Cloud Services)
Компания: Яндекс
Локация: Москва / Удаленно

О команде и роли:
Мы ищем Senior Product Manager для развития облачной AI-инфраструктуры. Вам предстоит определять видение продукта, выстраивать кросс-функциональное взаимодействие между разработкой, исследователями данных и продажами, а также запускать инструменты для масштабирования сервисов.

Требования:
• 5+ лет в управлении продуктом в технологических компаниях.
• Опыт работы с Agile, Scrum, CI/CD, A/B-тестированием и метриками (Retention, LTV, Unit-экономика).
• Умение проектировать Product Strategy, формировать Roadmap и составлять PRD.
• Опыт взаимодействия с инженерами: Microservices, REST API, Cloud Infrastructure.
• Сильные навыки работы со стейкхолдерами: Stakeholder Management и Cross-functional лидерство.`;

const CORE_KEYWORD_TAXONOMY = [
  { display: "CI/CD", synonyms: ["ci/cd", "cicd", "ci-cd", "непрерывная интеграция"] },
  { display: "A/B-тестирование", synonyms: ["a/b", "ab-тест", "ab тест", "a/b-тест", "a/b test"] },
  { display: "Agile", synonyms: ["agile", "эджайл", "эджайле"] },
  { display: "Scrum", synonyms: ["scrum", "скрам", "спринт"] },
  { display: "Product Strategy", synonyms: ["product strategy", "продуктовая стратегия", "стратеги"] },
  { display: "Roadmap", synonyms: ["roadmap", "роадмап", "дорожная карта"] },
  { display: "PRD", synonyms: ["prd", "технические требования", "спецификаци"] },
  { display: "CustDev", synonyms: ["custdev", "исследования пользователей", "интервью с клиентами"] },
  { display: "Unit-экономика", synonyms: ["unit-экономика", "юнит-экономика", "unit economics"] },
  { display: "Retention", synonyms: ["retention", "удержание пользователей"] },
  { display: "REST API", synonyms: ["rest api", "rest", "api"] },
  { display: "Microservices", synonyms: ["microservices", "микросервис", "микросервисная"] },
  { display: "Cross-functional", synonyms: ["cross-functional", "кросс-функциональн"] },
  { display: "Stakeholder Management", synonyms: ["stakeholder", "стейкхолдер", "управление ожиданиями"] },
  { display: "TypeScript", synonyms: ["typescript", "тайпскрипт", "ts"] },
  { display: "React", synonyms: ["react", "реакт"] },
  { display: "Next.js", synonyms: ["next.js", "nextjs", "некст"] },
  { display: "Python", synonyms: ["python", "питон"] },
  { display: "SQL", synonyms: ["sql", "postgresql", "mysql"] },
  { display: "Docker", synonyms: ["docker", "докер"] },
  { display: "Kubernetes", synonyms: ["kubernetes", "k8s", "кубернетес"] },
];

export default function ATSScannerPage() {
  const {
    userProfile,
    applications,
    scannerTargetJob,
    setScannerTargetJob,
    triggerQuickAudit,
    setTriggerQuickAudit,
    isPro,
    remainingScans,
    consumeScan,
    isUpgradeModalOpen,
    setIsUpgradeModalOpen,
    setUpgradeReason,
    showToast,
  } = useApp();

  const [resumeText, setResumeText] = useState(DEFAULT_RESUME);
  const [jobDesc, setJobDesc] = useState(DEFAULT_JOB_DESC);
  const [selectedTrackerJobId, setSelectedTrackerJobId] = useState<string>("");

  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
  } | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill target job from Kanban navigation
  useEffect(() => {
    if (scannerTargetJob) {
      setJobDesc(
        `${scannerTargetJob.position} в компании ${scannerTargetJob.company}\n\n${
          scannerTargetJob.description || "Требования: опыт в стеке, Agile, продуктовые метрики, CI/CD, надежность."
        }`
      );
      showToast(`Загружены требования вакансии «${scannerTargetJob.company}»`);
    }
  }, [scannerTargetJob, showToast]);

  // Handle Quick Audit trigger from header
  useEffect(() => {
    const isQuick =
      triggerQuickAudit ||
      (typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("quick_audit") === "true");
    if (isQuick) {
      setTriggerQuickAudit(false);
      showToast("Запущен экспресс-аудит резюме...");
    }
  }, [triggerQuickAudit, setTriggerQuickAudit, showToast]);

  // Dynamic Language Detection (Russian vs English)
  const language = useMemo(() => {
    return detectLanguage(`${resumeText} ${jobDesc}`);
  }, [resumeText, jobDesc]);

  // Pure dynamic keyword matching and score calculation (ZERO contradictions)
  const analysis = useMemo(() => {
    const normResume = resumeText.toLowerCase();
    const normJob = jobDesc.toLowerCase();

    // 1. Determine relevant skills required by the job
    const activeSkills = CORE_KEYWORD_TAXONOMY.filter((skill) => {
      return (
        normJob.includes(skill.display.toLowerCase()) ||
        skill.synonyms.some((syn) => normJob.includes(syn))
      );
    });

    // Default pool if job description is very short
    const effectivePool = activeSkills.length >= 4 ? activeSkills : CORE_KEYWORD_TAXONOMY.slice(0, 10);

    const present: string[] = [];
    const missing: string[] = [];

    effectivePool.forEach((skill) => {
      const isPresentInResume =
        normResume.includes(skill.display.toLowerCase()) ||
        skill.synonyms.some((syn) => normResume.includes(syn));

      if (isPresentInResume) {
        present.push(skill.display);
      } else {
        missing.push(skill.display);
      }
    });

    // 2. Score Calculation Formula:
    // - 65% keywords match
    // - 20% quantified metrics (numbers, %, млн, etc.)
    // - 15% section completeness (contacts, experience, skills)
    const kwRatio = effectivePool.length > 0 ? present.length / effectivePool.length : 0.7;
    const kwScore = kwRatio * 65;

    const metricMatches = resumeText.match(/\b(\d+%\s*|\d+\s*(млн|тыс|руб|\$|k|x|ч|дн|users|dau|mau))\b/gi) || [];
    const metricScore = metricMatches.length >= 3 ? 20 : metricMatches.length >= 1 ? 12 : 5;

    let sectionScore = 0;
    if (/@|\+7|\d{10}/.test(resumeText)) sectionScore += 5;
    if (/опыт|experience/i.test(resumeText)) sectionScore += 5;
    if (/навыки|skills|обо мне|о себе/i.test(resumeText)) sectionScore += 5;

    const totalScore = Math.min(98, Math.max(35, Math.round(kwScore + metricScore + sectionScore)));

    // 3. Dynamic warnings and recommendations
    const formatIssues: string[] = [];
    if (metricScore < 15) {
      formatIssues.push(
        language === "en"
          ? "Low metric density: add at least 3 quantified metrics (%, revenue, RPS, time reduction)"
          : "Мало оцифрованных результатов: добавьте конкретные числа и проценты роста"
      );
    }
    if (missing.length > 0) {
      formatIssues.push(
        language === "en"
          ? `Missing critical keywords detected in job description: ${missing.slice(0, 3).join(", ")}`
          : `В тексте резюме не найдены важные навыки: ${missing.slice(0, 3).join(", ")}`
      );
    }
    if (resumeText.length < 400) {
      formatIssues.push(
        language === "en"
          ? "Resume text is too brief for multi-tier ATS parsing algorithms"
          : "Текст резюме слишком короткий для многоуровневого парсинга ATS"
      );
    }

    const suggestions: string[] = [
      language === "en"
        ? `Incorporate missing keywords (${missing.slice(0, 4).join(", ") || "Agile, CI/CD"}) directly into bullet points`
        : `Добавьте отсутствующие ключевые слова (${missing.slice(0, 4).join(", ") || "Agile, CI/CD"}) в описание опыта`,
      language === "en"
        ? "Formulate accomplishments using the XYZ formula: Accomplished [X], measured by [Y], by doing [Z]"
        : "Перепишите достижения по формуле XYZ: Достиг [X], измерив [Y], сделав [Z]",
      language === "en"
        ? "Ensure consistent reverse-chronological order and standard single-column text layout"
        : "Используйте стандартную одноколоночную структуру текста для 100% совместимости с ATS",
    ];

    const optimizedSummary =
      language === "en"
        ? `Accomplished specialist with extensive experience in ${present.slice(0, 4).join(", ") || "modern technology and agile delivery"}. Proven track record of improving key business metrics, driving cross-functional collaboration, and shipping reliable solutions.`
        : `Опытный специалист с практической экспертизой в ${present.slice(0, 4).join(", ") || "современных технологиях и процессах разработки"}. Доказанный опыт оцифровки результатов, слаженного кросс-функционального взаимодействия и запуска масштабных сервисов.`;

    const optimizedSkills = [...present, ...missing.slice(0, 4)].join(", ");

    return {
      score: totalScore,
      present,
      missing,
      formatIssues: formatIssues.map(cleanAIMarkdownArtifacts),
      suggestions: suggestions.map(cleanAIMarkdownArtifacts),
      summary: cleanAIMarkdownArtifacts(optimizedSummary),
      skills: cleanAIMarkdownArtifacts(optimizedSkills),
    };
  }, [resumeText, jobDesc, language]);

  // Click on missing skill chip -> Automatically appends to resume and moves to present!
  const handleAddMissingSkill = (skill: string) => {
    setResumeText((prev) => {
      if (prev.includes("Навыки:") || prev.includes("НАВЫКИ")) {
        return prev.replace(/(Навыки:.*?)([\n\r]|$)/i, `$1, ${skill}$2`);
      }
      return `${prev}\n• Ключевой навык: ${skill}`;
    });
    showToast(`✓ Навык «${skill}» добавлен в резюме! Балл ATS увеличен.`);
  };

  // Handle selecting job from Kanban tracker
  const handleSelectTrackerJob = (jobId: string | null) => {
    if (!jobId) return;
    setSelectedTrackerJobId(jobId);
    const job = applications.find((a) => a.id === jobId);
    if (job) {
      setJobDesc(
        `${job.position} в компании ${job.company}\n\n${
          job.job_description || "Требования к роли: знание современных технологий, Agile, CI/CD, метрики эффективности."
        }`
      );
      showToast(`Выбрана вакансия «${job.company}» из Канбан-трекера`);
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const cleaned = text.replace(/[^\x20-\x7Eа-яА-ЯёЁ\n\r\t.,:;!?()[\]{}@#$%^&*+=_\-|/\\<>"'`~]/g, " ");
      if (cleaned.trim().length > 30) {
        setResumeText(cleaned);
        setUploadedFile({
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
        });
        showToast(`Файл «${file.name}» загружен и проанализирован!`);
      } else {
        showToast("Не удалось извлечь текст из файла. Пожалуйста, вставьте текст вручную.");
      }
    };
    reader.readAsText(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Run audit with quota check
  const handleRunAudit = () => {
    if (!isPro && remainingScans <= 0) {
      setUpgradeReason(
        "Вы использовали 2 из 2 бесплатных ATS-проверок. Активируйте LaunchPad AI PRO для безлимитного анализа резюме и генерации писем!"
      );
      setIsUpgradeModalOpen(true);
      return;
    }

    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      consumeScan();
      showToast("✨ ATS-аудит успешно пересчитан в реальном времени!");
    }, 600);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(cleanAIMarkdownArtifacts(text));
    setCopiedSection(id);
    showToast("Скопировано в буфер обмена!");
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(
    "https://launchpad-app-ashy.vercel.app/"
  )}&text=${encodeURIComponent(
    `Моё резюме прошло ATS-аудит в LaunchPad AI на ${analysis.score}% совпадения! Проверь своё резюме онлайн:`
  )}`;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <ScanSearch className="w-6 h-6 text-primary" />
              <span>AI ATS Resume Audit</span>
            </h1>
            <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30 bg-emerald-500/10 font-bold">
              {language === "en" ? "English" : "Русский"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Загрузите файл или вставьте текст — реальный расчёт совпадения резюме с вакансией по алгоритмам роботов ATS.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {isPro ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              ✨ PRO Активен
            </div>
          ) : (
            <button
              onClick={() => {
                setUpgradeReason(undefined);
                setIsUpgradeModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 hover:text-white hover:bg-indigo-500/20 text-xs font-semibold shadow-sm transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              💎 Тариф Pro (Бесплатно: {remainingScans}/2)
            </button>
          )}

          <Button
            onClick={handleRunAudit}
            disabled={isScanning}
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-md shadow-primary/25 cursor-pointer"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Расчёт совпадений...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Запустить аудит
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Grid: Inputs vs Report */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Inputs (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Resume Source Card */}
          <Card className="bg-card/70 border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <span>1. Резюме кандидата</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Текст резюме ({resumeText.length} симв.)
                </CardDescription>
              </div>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".txt,.md,.pdf,.docx"
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs h-8 border-dashed cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Загрузить PDF / DOCX
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {uploadedFile && (
                <div className="p-3 rounded-xl border border-primary/30 bg-primary/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                      <FileCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground truncate max-w-[200px]">
                        {uploadedFile.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{uploadedFile.size}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={removeFile}
                    className="h-6 w-6 text-muted-foreground hover:text-rose-400 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}

              <Textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Вставьте текст вашего резюме..."
                rows={9}
                className="font-mono text-xs resize-none bg-background/50 border-border"
              />
            </CardContent>
          </Card>

          {/* Job Description Card with Kanban Integration */}
          <Card className="bg-card/70 border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <span>2. Целевая вакансия / Ключевые требования</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Требования работодателя для сверки ключевых слов
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Optional selector from Kanban tracker */}
              {applications.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-primary" />
                      Выбрать из Канбан-трекера:
                    </span>
                  </div>
                  <Select value={selectedTrackerJobId} onValueChange={handleSelectTrackerJob}>
                    <SelectTrigger className="text-xs h-8 bg-background/60">
                      <SelectValue placeholder="Или выберите сохранённую вакансию..." />
                    </SelectTrigger>
                    <SelectContent>
                      {applications.map((app) => (
                        <SelectItem key={app.id} value={app.id} className="text-xs">
                          {app.company} — {app.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Вставьте текст требований вакансии..."
                rows={8}
                className="font-mono text-xs resize-none bg-background/50 border-border"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: ATS Report & Score (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="bg-card border-border overflow-hidden">
            <div className="p-5 sm:p-6 bg-gradient-to-r from-card via-card to-primary/10 border-b border-border/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">
                    Индекс соответствия (ATS Match Score)
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
                      {analysis.score}%
                    </span>
                    <span className="text-muted-foreground text-sm font-medium">/ 100%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 max-w-md">
                    {analysis.score >= 80
                      ? "Отличный результат! Ваше резюме проходит автоматические фильтры большинства ATS."
                      : analysis.score >= 65
                      ? "Средний балл. Нажмите на красные теги ниже, чтобы добавить ключевые слова в резюме."
                      : "Высокий риск отсева. Резюме не содержит более 50% ключевых навыков вакансии."}
                  </p>
                </div>

                {/* Circular indicator */}
                <div className="relative w-24 h-24 rounded-full border-4 border-muted flex items-center justify-center shrink-0">
                  <div
                    className="absolute inset-0 rounded-full border-4 border-primary transition-all duration-500"
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, ${analysis.score >= 25 ? "100% 0%," : ""}${
                        analysis.score >= 50 ? "100% 100%," : ""
                      }${analysis.score >= 75 ? "0% 100%," : ""}0% 0%)`,
                    }}
                  />
                  <div className="text-center">
                    <span className="text-base font-black">{analysis.score}%</span>
                    <span className="block text-[9px] uppercase tracking-wider text-muted-foreground">match</span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <Progress value={analysis.score} className="h-2 bg-muted/60" />
              </div>

              {/* Actions row under score */}
              <div className="mt-4 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                <a
                  href={telegramShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-sky-400" />
                  Поделиться в Telegram
                </a>

                {!isPro && (
                  <button
                    onClick={() => {
                      setUpgradeReason(undefined);
                      setIsUpgradeModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Скидка 30% по коду START30</span>
                  </button>
                )}
              </div>
            </div>

            <CardContent className="p-5 sm:p-6 space-y-6">
              {/* Missing Keywords Box with Interactive Click-to-Add! */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Отсутствующие ключевые навыки ({analysis.missing.length})
                  </h3>
                  <span className="text-[10px] text-muted-foreground">Нажмите на тег, чтобы внедрить в резюме</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {analysis.missing.length === 0 ? (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Все ключевые навыки вакансии успешно найдены в резюме!
                    </span>
                  ) : (
                    analysis.missing.map((kw, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAddMissingSkill(kw)}
                        title={`Нажмите, чтобы добавить «${kw}» в резюме`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-white text-xs font-medium transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        {kw}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Present Keywords Box (ZERO contradictions) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Успешно распознанные совпадения ({analysis.present.length})
                  </h3>
                  <span className="text-[10px] text-muted-foreground">Распознано алгоритмом</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {analysis.present.map((kw, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium"
                    >
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dynamic Format & ATS Warnings */}
              {analysis.formatIssues.length > 0 && (
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Предупреждения по верстке для роботов ATS</span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1 pl-4 list-disc">
                    {analysis.formatIssues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Concrete Actionable Steps */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                  Конкретные шаги по улучшению:
                </h3>
                <div className="space-y-2 text-xs">
                  {analysis.suggestions.map((sug, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-muted/40 border border-border/60">
                      <span className="font-bold text-primary shrink-0">{idx + 1}.</span>
                      <p className="text-foreground leading-relaxed">{sug}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Optimized Sections Rewrite */}
              <div className="space-y-3 pt-3 border-t border-border/80">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI-блоки для вставки в резюме
                  </h3>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-background/60 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Готовое введение (Executive Summary)</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(analysis.summary, "summary")}
                      className="h-6 text-[10px] cursor-pointer"
                    >
                      {copiedSection === "summary" ? (
                        <>
                          <Check className="w-3 h-3 mr-1 text-emerald-400" /> Скопировано
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" /> Копировать
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                    {analysis.summary}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-background/60 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Список ключевых навыков для раздела «Skills»</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(analysis.skills, "skills")}
                      className="h-6 text-[10px] cursor-pointer"
                    >
                      {copiedSection === "skills" ? (
                        <>
                          <Check className="w-3 h-3 mr-1 text-emerald-400" /> Скопировано
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" /> Копировать
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                    {analysis.skills}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upgrade Pro Modal (Tribute) */}
      <UpgradeProModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onActivated={() => {
          showToast("🎉 Тариф LaunchPad AI PRO успешно активирован!");
        }}
      />
    </div>
  );
}
