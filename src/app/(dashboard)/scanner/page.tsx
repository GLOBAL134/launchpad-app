"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { DEMO_ATS_RESULT } from "@/lib/demo-data";
import { ATSScanResult } from "@/types";
import UpgradeProModal from "@/components/UpgradeProModal";
import {
  isUserPro,
  getRemainingFreeScans,
  incrementScanUsage,
  cleanAIMarkdownArtifacts,
} from "@/lib/monetization";

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
Навыки: Product Management, Product Strategy, Roadmap Planning, CustDev, Scrum, PRD, Unit-экономика, A/B-тестирование.`;

const DEFAULT_JOB_DESC = `Senior Product Manager (AI & Cloud Services)
Компания: Яндекс
Локация: Москва / Удаленно

О команде и роли:
Мы ищем Senior Product Manager для развития облачной AI-инфраструктуры. Вам предстоит определять видение продукта, выстраивать кросс-функциональное взаимодействие между разработкой, исследователями данных и продажами, а также запускать инструменты для масштабирования сервисов.

Требования:
• 5+ лет в управлении продуктом в технологических компаниях.
• Опыт работы с облачными платформами, AI/ML-сервисами или высоконагруженными B2B SaaS.
• Глубокое понимание метрик: Retention, LTV, Unit Economics, A/B-тестирование.
• Опыт фасилитации процессов разработки (Agile/Scrum), написания подробных PRD и технических спецификаций.
• Умение говорить на одном языке с инженерами: понимание CI/CD, архитектуры микросервисов и API.
• Высокие коммуникативные навыки для управления ожиданиями топ-стейкхолдеров.`;

export default function ATSScannerPage() {
  const [resumeText, setResumeText] = useState(DEFAULT_RESUME);
  const [jobDesc, setJobDesc] = useState(DEFAULT_JOB_DESC);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    base64: string;
    mimeType: string;
  } | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ATSScanResult>(DEMO_ATS_RESULT);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<string | undefined>(undefined);
  const [isPro, setIsPro] = useState(false);
  const [remainingScans, setRemainingScans] = useState(2);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsPro(isUserPro());
    setRemainingScans(getRemainingFreeScans());
  }, []);

  // Handle PDF/DOCX file selection
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1];
      setUploadedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        base64: base64String,
        mimeType: file.type || "application/pdf",
      });
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Run real ATS scan via API route
  const handleScan = async () => {
    if (!isUserPro() && getRemainingFreeScans() <= 0) {
      setUpgradeReason("Вы использовали 2 из 2 бесплатных ATS-проверок. Активируйте LaunchPad AI PRO для безлимитного анализа резюме и генерации писем!");
      setUpgradeModalOpen(true);
      return;
    }

    setIsScanning(true);
    try {
      const response = await fetch("/api/ats-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: uploadedFile ? undefined : resumeText,
          jobDescription: jobDesc,
          fileBase64: uploadedFile?.base64,
          fileMimeType: uploadedFile?.mimeType,
        }),
      });

      if (!response.ok) {
        throw new Error("Аудит не удался, попробуйте снова");
      }

      const data: ATSScanResult = await response.json();
      const cleanedData: ATSScanResult = {
        ...data,
        suggestions: (data.suggestions || []).map(cleanAIMarkdownArtifacts),
        format_issues: (data.format_issues || []).map(cleanAIMarkdownArtifacts),
        optimized_sections: {
          summary: cleanAIMarkdownArtifacts(data.optimized_sections?.summary || ''),
          skills: cleanAIMarkdownArtifacts(data.optimized_sections?.skills || ''),
        },
      };
      setScanResult(cleanedData);
      incrementScanUsage();
      setRemainingScans(getRemainingFreeScans());
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Ошибка при анализе резюме";
      alert(errorMsg);
    } finally {
      setIsScanning(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(cleanAIMarkdownArtifacts(text));
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

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
              Gemini AI
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Загрузите реальный PDF или вставьте текст — AI проверит совпадение с вакансией по алгоритмам роботов ATS.
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
                setUpgradeModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 hover:text-white hover:bg-indigo-500/20 text-xs font-semibold shadow-sm transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              💎 Upgrade to PRO (Бесплатно: {remainingScans}/2)
            </button>
          )}

          <Button
            onClick={handleScan}
            disabled={isScanning}
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-md shadow-primary/25 cursor-pointer"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Анализ резюме через AI...
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
                  PDF, DOCX или скопированный текст
                </CardDescription>
              </div>

              {/* Upload trigger */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs h-8 border-dashed"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Загрузить PDF / DOCX
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {uploadedFile ? (
                <div className="p-3.5 rounded-xl border border-primary/30 bg-primary/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground truncate max-w-[220px]">
                        {uploadedFile.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{uploadedFile.size}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={removeFile}
                    className="h-7 w-7 text-muted-foreground hover:text-rose-400"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Вставьте текст вашего резюме..."
                  rows={8}
                  className="font-mono text-xs resize-none bg-background/50 border-border"
                />
              )}
            </CardContent>
          </Card>

          {/* Job Description Card */}
          <Card className="bg-card/70 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <span>2. Описание целевой вакансии</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Скопируйте текст вакансии с hh.ru, Habr или сайта компании
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Вставьте текст требований и обязанностей вакансии..."
                rows={8}
                className="font-mono text-xs resize-none bg-background/50 border-border"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: ATS Report & Score (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Primary Score & Match Highlights */}
          <Card className="bg-card border-border overflow-hidden">
            <div className="p-5 sm:p-6 bg-gradient-to-r from-card via-card to-primary/10 border-b border-border/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">
                    Индекс соответствия (ATS Match Score)
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
                      {scanResult.match_score}%
                    </span>
                    <span className="text-muted-foreground text-sm font-medium">/ 100%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 max-w-md">
                    {scanResult.match_score >= 80
                      ? "Отличный результат! Ваше резюме проходит автоматические фильтры большинства ATS."
                      : scanResult.match_score >= 65
                      ? "Средний балл. Добавьте выделенные ключевые слова, чтобы роботы ATS не отсеяли резюме."
                      : "Высокий риск отсева. Резюме не содержит более 50% обязательных ключевых навыков."}
                  </p>
                </div>

                {/* Circular indicator representation */}
                <div className="relative w-24 h-24 rounded-full border-4 border-muted flex items-center justify-center shrink-0">
                  <div
                    className="absolute inset-0 rounded-full border-4 border-primary transition-all duration-700"
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, ${scanResult.match_score >= 25 ? "100% 0%," : ""}${scanResult.match_score >= 50 ? "100% 100%," : ""}${scanResult.match_score >= 75 ? "0% 100%," : ""}0% 0%)`
                    }}
                  />
                  <div className="text-center">
                    <span className="text-base font-black">{scanResult.match_score}%</span>
                    <span className="block text-[9px] uppercase tracking-wider text-muted-foreground">review</span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <Progress value={scanResult.match_score} className="h-2 bg-muted/60" />
              </div>

              {/* Actions row under score */}
              <div className="mt-4 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const shareText = `Моё резюме прошло ATS-аудит в LaunchPad на ${scanResult.match_score}% совпадения! Проверь своё: https://launchpad-app-ashy.vercel.app`;
                      window.open(`https://t.me/share/url?url=${encodeURIComponent("https://launchpad-app-ashy.vercel.app")}&text=${encodeURIComponent(shareText)}`, "_blank");
                    }}
                    className="h-8 text-xs font-medium"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
                    Поделиться в Telegram
                  </Button>
                </div>

                {!isPro && (
                  <button
                    onClick={() => setUpgradeModalOpen(true)}
                    className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Безлимитный PRO-тариф через Tribute</span>
                  </button>
                )}
              </div>
            </div>

            <CardContent className="p-5 sm:p-6 space-y-6">
              {/* Missing Keywords Box */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Отсутствующие ключевые навыки ({scanResult.missing_keywords.length})
                  </h3>
                  <span className="text-[10px] text-muted-foreground">Критично для прохождения фильтра</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {scanResult.missing_keywords.length === 0 ? (
                    <span className="text-xs text-muted-foreground">Все обязательные навыки найдены в резюме!</span>
                  ) : (
                    scanResult.missing_keywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium"
                      >
                        +{cleanAIMarkdownArtifacts(kw)}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Present Keywords Box */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Успешно распознанные совпадения ({scanResult.present_keywords.length})
                  </h3>
                  <span className="text-[10px] text-muted-foreground">Найдены роботом</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {scanResult.present_keywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium"
                    >
                      ✓ {cleanAIMarkdownArtifacts(kw)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Format & ATS Risks */}
              {scanResult.format_issues && scanResult.format_issues.length > 0 && (
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Предупреждения по верстке для роботов ATS</span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1 pl-4 list-disc">
                    {scanResult.format_issues.map((issue, idx) => (
                      <li key={idx}>{cleanAIMarkdownArtifacts(issue)}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Concrete Suggestions */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                  Конкретные шаги по улучшению:
                </h3>
                <div className="space-y-2 text-xs">
                  {scanResult.suggestions.map((sug, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-muted/40 border border-border/60">
                      <span className="font-bold text-primary shrink-0">{idx + 1}.</span>
                      <p className="text-foreground leading-relaxed">{cleanAIMarkdownArtifacts(sug)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Optimized Sections Rewrite */}
              {scanResult.optimized_sections && (
                <div className="space-y-3 pt-3 border-t border-border/80">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI-сгенерированные блоки для вставки в резюме
                    </h3>
                  </div>

                  {scanResult.optimized_sections.summary && (
                    <div className="p-3.5 rounded-xl border border-border bg-background/60 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>Готовое введение (Executive Summary)</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(scanResult.optimized_sections!.summary, "summary")}
                          className="h-6 text-[10px]"
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
                        {cleanAIMarkdownArtifacts(scanResult.optimized_sections.summary)}
                      </p>
                    </div>
                  )}

                  {scanResult.optimized_sections.skills && (
                    <div className="p-3.5 rounded-xl border border-border bg-background/60 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>Список ключевых навыков для раздела «Skills»</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(scanResult.optimized_sections!.skills, "skills")}
                          className="h-6 text-[10px]"
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
                        {cleanAIMarkdownArtifacts(scanResult.optimized_sections.skills)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upgrade to Pro Modal (Tribute) */}
      <UpgradeProModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        onActivated={() => {
          setIsPro(true);
          setRemainingScans(Infinity);
        }}
        reasonMessage={upgradeReason}
      />
    </div>
  );
}
