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
  Award,
  Layers,
  Code2,
  Terminal,
  Wand2,
  Eye,
  Sliders,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UpgradeProModal from "@/components/UpgradeProModal";
import AtsScoreCardModal from "@/components/AtsScoreCardModal";
import AtsCleanResumeModal from "@/components/AtsCleanResumeModal";
import { cleanAIMarkdownArtifacts } from "@/lib/monetization";
import { detectLanguage } from "@/lib/language";
import { simulateAtsParser, AtsSimulationResult, XyzImprovement } from "@/lib/ats-parser-simulator";
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
Навыки: Product Management, Product Strategy, Roadmap Planning, CustDev, Scrum, PRD, Unit-экономика, A/B-тестирование, CI/CD, SQL, Docker, Kubernetes.`;

const DEFAULT_JOB_DESC = `Senior Product Manager (AI & Cloud Services)
Компания: Яндекс
Локация: Москва / Удаленно

О команде и роли:
Мы ищем Senior Product Manager для развития облачной AI-инфраструктуры. Вам предстоит определять видение продукта, выстраивать кросс-функциональное взаимодействие между разработкой, исследователями данных и продажами, а также запускать инструменты для масштабирования сервисов.

Требования:
• 5+ лет в управлении продуктом в технологических компаниях.
• Опыт работы с Agile, Scrum, CI/CD, A/B-тестированием и метриками (Retention, LTV, Unit-экономика).
• Умение проектировать Product Strategy, формировать Roadmap и составлять PRD.
• Опыт взаимодействия с инженерами: Microservices, REST API, Cloud Infrastructure, Docker, SQL.
• Сильные навыки работы со стейкхолдерами: Stakeholder Management и Cross-functional лидерство.`;

export default function ATSScannerPage() {
  const {
    userProfile,
    applications,
    scannerTargetJob,
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
  const [activeResultsTab, setActiveResultsTab] = useState<"overview" | "raw_ats" | "xyz_diff">("overview");
  const [rawViewMode, setRawViewMode] = useState<"text" | "json">("text");

  // Modals for Module 2 & Module 3
  const [isScoreCardOpen, setIsScoreCardOpen] = useState(false);
  const [isCleanResumeOpen, setIsCleanResumeOpen] = useState(false);

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

  // Deterministic 55/15/15/15 ATS Simulator
  const simulation: AtsSimulationResult = useMemo(() => {
    return simulateAtsParser(resumeText, jobDesc, language);
  }, [resumeText, jobDesc, language]);

  // Handle selecting job from Kanban tracker
  const handleSelectTrackerJob = (jobId: string | null) => {
    if (!jobId) return;
    setSelectedTrackerJobId(jobId);
    const job = applications.find((a) => a.id === jobId);
    if (job) {
      setJobDesc(
        `${job.position} в компании ${job.company}\n\n${
          job.job_description || "Требования: знание современных технологий, Agile, CI/CD, метрики эффективности."
        }`
      );
      showToast(`Выбрана вакансия «${job.company}» из Канбан-трекера`);
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeStr = (file.size / 1024).toFixed(1) + " KB";
    setUploadedFile({ name: file.name, size: fileSizeStr });

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text && text.trim().length > 50) {
        setResumeText(cleanAIMarkdownArtifacts(text));
        showToast(`Файл «${file.name}» успешно загружен и обработан!`);
      } else {
        showToast("Файл прочитан. Проверьте содержимое в поле ввода.");
      }
    };
    reader.readAsText(file);
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Click on missing skill chip -> Automatically appends to resume
  const handleAddMissingSkill = (skill: string) => {
    setResumeText((prev) => {
      if (prev.includes("Навыки:") || prev.includes("НАВЫКИ")) {
        return prev.replace(/(Навыки:.*?)([\n\r]|$)/i, `$1, ${skill}$2`);
      }
      return `${prev}\n• Ключевой навык: ${skill}`;
    });
    showToast(`✓ Навык «${skill}» добавлен в резюме! Балл ATS увеличен.`);
  };

  // 1-Click apply XYZ bullet improvement
  const handleApplyXyz = (item: XyzImprovement) => {
    setResumeText((prev) => {
      if (prev.includes(item.original)) {
        return prev.replace(item.original, item.improved);
      }
      return `${prev}\n• ${item.improved}`;
    });
    showToast(`✨ Буллет улучшен по формуле XYZ! +${item.scoreBoost}% к итоговому баллу ATS.`);
  };

  const handleStartScan = () => {
    if (!isPro && remainingScans <= 0) {
      setUpgradeReason("Бесплатные проверки исчерпаны. Перейдите на тариф Pro для безлимитного ATS-сканера!");
      setIsUpgradeModalOpen(true);
      return;
    }

    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      consumeScan();
      showToast("✓ ATS-аудит резюме завершён по стандарту 55/15/15/15!");
    }, 600);
  };

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(cleanAIMarkdownArtifacts(text));
    setCopiedSection(sectionId);
    showToast("Текст скопирован в буфер обмена!");
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(
    "https://launchpad-app-ashy.vercel.app"
  )}&text=${encodeURIComponent(
    language === "en"
      ? `My resume scored ${simulation.score.total}% on the LaunchPad AI PRO ATS Audit! Check yours:`
      : `Моё резюме набрало ${simulation.score.total}% в ATS-сканере LaunchPad AI PRO! Проверь своё:`
  )}`;

  const targetRoleTitle = scannerTargetJob ? `${scannerTargetJob.position} (${scannerTargetJob.company})` : "Senior Product Manager";

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <ScanSearch className="w-6 h-6 text-primary" />
            <span>AI ATS-сканер резюме (Deterministic 55/15/15/15 Standard)</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Проверьте резюме алгоритмами корпоративных ATS (Workday, Taleo, Greenhouse, E-Staff) без склейки и противоречий.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Module 2: Score Card Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsScoreCardOpen(true)}
            className="text-xs border-border/80 hover:bg-muted/80 flex items-center gap-1.5 cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Сертификат ATS</span>
          </Button>

          {/* Module 3: Clean Single-Column Resume Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsCleanResumeOpen(true)}
            className="text-xs border-border/80 hover:bg-muted/80 flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-primary" />
            <span>Собрать ATS-резюме</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Inputs (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: Resume Input */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>1. Текст вашего резюме</span>
                </CardTitle>
                <div className="flex items-center gap-2">
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
                    className="h-7 text-xs border-dashed border-primary/50 text-primary hover:bg-primary/10 cursor-pointer"
                  >
                    <Upload className="w-3 h-3 mr-1" />
                    Загрузить файл
                  </Button>
                </div>
              </div>
              <CardDescription className="text-xs">
                Вставьте текст резюме или загрузите файл (.txt, .md, .docx, .pdf)
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {uploadedFile && (
                <div className="p-2.5 rounded-lg border border-primary/30 bg-primary/5 flex items-center justify-between text-xs animate-in fade-in">
                  <div className="flex items-center gap-2 text-foreground font-medium truncate">
                    <FileCheck className="w-4 h-4 text-primary shrink-0" />
                    <span className="truncate">{uploadedFile.name}</span>
                    <span className="text-muted-foreground text-[10px]">({uploadedFile.size})</span>
                  </div>
                  <button
                    onClick={handleClearFile}
                    className="text-muted-foreground hover:text-foreground p-1 transition cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <Textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Вставьте сюда текст вашего резюме..."
                rows={12}
                className="font-mono text-xs resize-none bg-background/50 border-border"
              />
            </CardContent>
          </Card>

          {/* Card 2: Job Description Input */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span>2. Целевая вакансия</span>
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
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

              <Button
                onClick={handleStartScan}
                disabled={isScanning}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs shadow-md shadow-primary/20 cursor-pointer h-9"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Сканирование алгоритмами ATS...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    Пересчитать ATS Match
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: ATS Report & Score (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="bg-card border-border overflow-hidden">
            {/* Top Score Summary Banner */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-card via-card to-primary/10 border-b border-border/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1 flex items-center gap-1.5">
                    <span>Индекс соответствия (ATS Match Index)</span>
                    <Badge variant="outline" className="text-[9px] text-primary border-primary/30 bg-primary/10">
                      Стандарт 55/15/15/15
                    </Badge>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
                      {simulation.score.total}%
                    </span>
                    <span className="text-muted-foreground text-sm font-medium">/ 100%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 max-w-md">
                    {simulation.score.total >= 80
                      ? "Отличный результат! Ваше резюме проходит автоматические фильтры большинства ATS."
                      : simulation.score.total >= 65
                      ? "Средний балл. Добавьте подтверждения в буллеты опыта и устраните сиротские навыки."
                      : "Высокий риск отсева. Не хватает оцифрованных результатов и подтвержденных ключевых слов."}
                  </p>
                </div>

                {/* Circular indicator */}
                <div className="relative w-24 h-24 rounded-full border-4 border-muted flex items-center justify-center shrink-0">
                  <div
                    className="absolute inset-0 rounded-full border-4 border-primary transition-all duration-500"
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, ${simulation.score.total >= 25 ? "100% 0%," : ""}${
                        simulation.score.total >= 50 ? "100% 100%," : ""
                      }${simulation.score.total >= 75 ? "0% 100%," : ""}0% 0%)`,
                    }}
                  />
                  <div className="text-center">
                    <span className="text-base font-black">{simulation.score.total}%</span>
                    <span className="block text-[9px] uppercase tracking-wider text-muted-foreground">match</span>
                  </div>
                </div>
              </div>

              {/* 4 Formula Progress Bars (55 / 15 / 15 / 15) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-border/60">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Hard Skills</span>
                    <span className="font-bold text-indigo-400">{simulation.score.hardSkills}/55</span>
                  </div>
                  <Progress value={(simulation.score.hardSkills / 55) * 100} className="h-1.5" />
                  <span className="text-[10px] text-muted-foreground block truncate">Цитаты в опыте</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Метрики</span>
                    <span className="font-bold text-emerald-400">{simulation.score.metrics}/15</span>
                  </div>
                  <Progress value={(simulation.score.metrics / 15) * 100} className="h-1.5" />
                  <span className="text-[10px] text-muted-foreground block truncate">%, $, x, время</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Soft Skills</span>
                    <span className="font-bold text-sky-400">{simulation.score.softSkills}/15</span>
                  </div>
                  <Progress value={(simulation.score.softSkills / 15) * 100} className="h-1.5" />
                  <span className="text-[10px] text-muted-foreground block truncate">Agile, лидерство</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Вёрстка</span>
                    <span className="font-bold text-amber-400">{simulation.score.layout}/15</span>
                  </div>
                  <Progress value={(simulation.score.layout / 15) * 100} className="h-1.5" />
                  <span className="text-[10px] text-muted-foreground block truncate">1 колонка, даты</span>
                </div>
              </div>

              {/* Actions row under score */}
              <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsScoreCardOpen(true)}
                    className="h-7 text-xs border-border hover:bg-muted text-emerald-400 font-semibold cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5 mr-1" />
                    Скачать сертификат ATS
                  </Button>

                  <a
                    href={telegramShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium transition cursor-pointer text-sky-400"
                  >
                    <Send className="w-3 h-3" />
                    Поделиться в TG
                  </a>
                </div>

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

            {/* Tab Switcher for 3 Modes */}
            <div className="px-5 pt-3 pb-2 border-b border-border/70 flex gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveResultsTab("overview")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  activeResultsTab === "overview"
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Анализ и навыки</span>
              </button>

              <button
                onClick={() => setActiveResultsTab("raw_ats")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  activeResultsTab === "raw_ats"
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Глазами робота ATS</span>
                {simulation.layoutIssues.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                )}
              </button>

              <button
                onClick={() => setActiveResultsTab("xyz_diff")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  activeResultsTab === "xyz_diff"
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                <span>X-Y-Z Улучшатель ({simulation.xyzImprovements.length})</span>
              </button>
            </div>

            <CardContent className="p-5 sm:p-6 space-y-6">
              {/* TAB 1: OVERVIEW & SKILLS */}
              {activeResultsTab === "overview" && (
                <div className="space-y-6">
                  {/* Missing Keywords Box with Interactive Click-to-Add */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Отсутствующие навыки в вакансии ({simulation.missingSkills.length})
                      </h3>
                      <span className="text-[10px] text-muted-foreground">Нажмите на тег, чтобы внедрить в резюме</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {simulation.missingSkills.length === 0 ? (
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Все ключевые навыки вакансии найдены в резюме!
                        </span>
                      ) : (
                        simulation.missingSkills.map((kw, idx) => (
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

                  {/* Verified Keywords Box */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Подтвержденные навыки с цитатами ({simulation.verifiedSkills.length})
                      </h3>
                      <span className="text-[10px] text-muted-foreground">Формула 55/15/15/15: начислены баллы</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {simulation.verifiedSkills.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium"
                          title={item.quote}
                        >
                          ✓ {item.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Orphan Skills Warning */}
                  {simulation.orphanSkills.length > 0 && (
                    <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Сиротские навыки: указаны в списке, но дают 0 баллов</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        По формуле роботов ATS навыки, которые есть только в шапке/списке, но не имеют подтверждения в описании реального опыта, не засчитываются.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {simulation.orphanSkills.map((o, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono"
                          >
                            ⚠️ {o.name} (0 б.)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actionable Steps */}
                  <div className="space-y-3 pt-3 border-t border-border/80">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Рекомендации по оптимизации:
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-lg bg-muted/40 border border-border/60">
                        1. Перенесите сиротские навыки в конкретные буллеты опыта с указанием контекста проекта.
                      </div>
                      <div className="p-3 rounded-lg bg-muted/40 border border-border/60">
                        2. Оцифруйте достижения по формуле XYZ: Достиг [X], измерив [Y], сделав [Z].
                      </div>
                      <div className="p-3 rounded-lg bg-muted/40 border border-border/60">
                        3. Используйте эталонную 1-колоночную верстку стандарта Harvard / BigTech.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RAW ATS PARSER VIEW */}
              {activeResultsTab === "raw_ats" && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-background/60 border border-border">
                    <div>
                      <div className="text-xs font-bold text-foreground flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span>Симулятор токенизации и AST-дерева робота ATS</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Показывает резюме точно так, как его видят парсеры Workday, Taleo и Greenhouse
                      </p>
                    </div>

                    <div className="flex p-0.5 rounded-lg bg-background border border-border text-xs shrink-0">
                      <button
                        onClick={() => setRawViewMode("text")}
                        className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                          rawViewMode === "text"
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Сырой поток (OCR)
                      </button>
                      <button
                        onClick={() => setRawViewMode("json")}
                        className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                          rawViewMode === "json"
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        JSON AST
                      </button>
                    </div>
                  </div>

                  {/* Red Layout Anomalies */}
                  {simulation.layoutIssues.length > 0 && (
                    <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 space-y-2.5">
                      <div className="text-xs font-bold text-rose-300 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                        <span>Критические ошибки вёрстки и структуры для ATS ({simulation.layoutIssues.length}):</span>
                      </div>
                      <div className="space-y-2">
                        {simulation.layoutIssues.map((issue) => (
                          <div key={issue.id} className="p-2.5 rounded-lg bg-background/60 border border-rose-500/30 text-xs">
                            <div className="font-semibold text-rose-200">{issue.title}</div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{issue.description}</p>
                            <span className="text-[10px] font-mono text-rose-400 block mt-1">Триггер: {issue.evidence}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Yellow Orphan Skills Alert */}
                  {simulation.orphanSkills.length > 0 && (
                    <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 space-y-2">
                      <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span>Сиротские навыки (0 баллов по формуле 55/15/15/15):</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Роботы ATS требуют доказательства практического применения каждого навыка в буллетах опыта. Навыки без цитат получают 0 баллов:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {simulation.orphanSkills.map((item, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-background/50 border border-amber-500/20 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-amber-200">{item.name}</span>
                              <span className="text-[10px] text-amber-400 font-mono font-bold">0 баллов</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground block mt-0.5">{item.reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Raw Stream Viewer */}
                  <div className="rounded-xl border border-border bg-zinc-950 p-4 font-mono text-xs overflow-x-auto max-h-[380px]">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-[11px] text-zinc-400">
                      <span>{rawViewMode === "text" ? "TOKENIZED RAW STREAM" : "ATS_AST_SCHEMA.json"}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(rawViewMode === "text" ? simulation.rawTextStream : JSON.stringify(simulation.parsedAstJson, null, 2), "raw")}
                        className="h-6 text-[10px] hover:text-white"
                      >
                        {copiedSection === "raw" ? <Check className="w-3 h-3 text-emerald-400 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                        <span>Копировать</span>
                      </Button>
                    </div>

                    <pre className="text-emerald-400 text-[11px] leading-relaxed whitespace-pre-wrap">
                      {rawViewMode === "text"
                        ? simulation.rawTextStream
                        : JSON.stringify(simulation.parsedAstJson, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* TAB 3: X-Y-Z BULLET IMPROVER (BEFORE / AFTER DIFF) */}
              {activeResultsTab === "xyz_diff" && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-card to-emerald-500/10 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-foreground flex items-center gap-1.5">
                        <Wand2 className="w-4 h-4 text-amber-400" />
                        <span>X-Y-Z Улучшатель процессных формулировок</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Заменяет слабые фразы («отвечал за», «занимался») на оцифрованные результаты с ростом ATS-скора
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shrink-0">
                      До 60% → После 94%
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {simulation.xyzImprovements.map((item) => (
                      <div key={item.id} className="p-4 rounded-xl border border-border bg-card/70 space-y-3">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-muted-foreground flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                            Слабый паттерн: <code className="text-amber-300 font-mono font-bold bg-background/80 px-1 py-0.5 rounded">{item.weakKeyword}</code>
                          </span>
                          <span className="text-emerald-400 font-bold font-mono">+{item.scoreBoost}% к ATS Score</span>
                        </div>

                        {/* Before / After Diff Visualizer */}
                        <div className="space-y-2 text-xs font-mono">
                          {/* Было */}
                          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-2">
                            <span className="font-bold text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 shrink-0">
                              Было
                            </span>
                            <span className="line-through opacity-80">{item.original}</span>
                          </div>

                          {/* Стало */}
                          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start gap-2">
                            <span className="font-bold text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 shrink-0">
                              Стало XYZ
                            </span>
                            <span className="font-medium">{item.improved}</span>
                          </div>
                        </div>

                        {/* Action row */}
                        <div className="flex items-center justify-between pt-1 text-xs">
                          <span className="text-[11px] text-muted-foreground">
                            Внедрены метрики: <strong className="text-emerald-400">{item.metricsAdded.join(", ")}</strong>
                          </span>

                          <Button
                            size="sm"
                            onClick={() => handleApplyXyz(item)}
                            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer shadow-sm shadow-emerald-500/20 flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Применить в 1 клик</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Module 2: Viral ATS Score Card Modal (Canvas) */}
      <AtsScoreCardModal
        isOpen={isScoreCardOpen}
        onClose={() => setIsScoreCardOpen(false)}
        simulation={simulation}
        candidateName={userProfile.name}
        targetRole={targetRoleTitle}
        language={language}
      />

      {/* Module 3: Clean Single-Column Harvard ATS Resume Modal */}
      <AtsCleanResumeModal
        isOpen={isCleanResumeOpen}
        onClose={() => setIsCleanResumeOpen(false)}
        rawResumeText={resumeText}
        candidateName={userProfile.name}
        candidateEmail={userProfile.email}
        candidatePhone={userProfile.phone}
        targetRole={targetRoleTitle}
        language={language}
      />

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