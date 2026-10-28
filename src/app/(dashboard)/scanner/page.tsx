"use client";

import { useState, useRef } from "react";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { DEMO_ATS_RESULT } from "@/lib/demo-data";
import { ATSScanResult } from "@/types";
import { UpgradeModal } from "@/components/UpgradeModal";

const DEFAULT_RESUME = `Alex Morgan
Senior Product Manager | alex.morgan@email.com | (555) 234-5678 | San Francisco, CA

SUMMARY
Results-oriented Product Manager with 5+ years of experience leading cross-functional teams in SaaS environments. Strong background in product strategy, roadmap planning, and user research. Proven track record of launching user-centric features and improving product retention.

EXPERIENCE
Lead Product Manager — CloudScale Solutions (2022 - Present)
• Owned the product roadmap for the core SaaS enterprise analytics product, prioritizing feature backlog.
• Led daily scrum rituals, sprint planning, and backlog grooming for an engineering team of 8.
• Authored comprehensive Product Requirements Documents (PRDs) and wireframes for 12+ major feature releases.
• Collaborated closely with sales and customer support to gather user feedback and improve NPS by 18 points.

Product Manager — FinTech Global (2019 - 2022)
• Defined KPI targets and managed execution for the customer onboarding experience.
• Conducted qualitative user interviews with over 60 enterprise clients to uncover workflows.
• Partnered with UX design to redesign account management dashboard.

EDUCATION & SKILLS
B.S. in Computer Science — University of California, Berkeley
Skills: Product Management, Product Strategy, Roadmap Planning, User Research, Scrum, KPIs, PRDs, Sprint Planning.`;

const DEFAULT_JOB_DESC = `Senior Product Manager, Cloud Infrastructure & AI
Company: Google LLC
Location: Mountain View, CA / Remote

About the Role:
We are seeking a Senior Product Manager to accelerate developer velocity in our Cloud AI ecosystem. In this role, you will define product vision, align cross-functional collaboration between engineering, research, and sales, and deliver enterprise-ready CI/CD tooling.

Key Qualifications:
• 5+ years in Product Management with Agile methodologies and CI/CD development pipelines.
• Proven ability in stakeholder management, communicating across engineering leadership and executives.
• Expertise with A/B testing methodologies and data-driven decisions to optimize conversion funnels.
• Strong experience writing PRDs and collaborating with distributed cross-functional teams.
• B.S. or equivalent practical experience in technical domain.`;

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setScanResult(data);
    } catch (err: any) {
      alert(err.message || "Ошибка при анализе резюме");
    } finally {
      setIsScanning(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUpgradeModalOpen(true)}
            className="text-xs border-amber-500/40 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Тариф Pro (ЮKassa)
          </Button>

          <Button
            onClick={handleScan}
            disabled={isScanning}
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-md shadow-primary/25"
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

      {/* Main Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Resume Upload / Text Card */}
          <Card className="bg-card/70 border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold">1. Резюме кандидата</CardTitle>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.docx,.doc,.txt"
                className="hidden"
                id="resume-file-input"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-7 text-xs border-dashed border-primary/50 text-primary hover:bg-primary/10"
              >
                <Upload className="w-3 h-3 mr-1" /> Загрузить PDF / DOCX
              </Button>
            </CardHeader>
            <CardContent>
              {uploadedFile ? (
                <div className="p-4 rounded-xl border border-primary/40 bg-primary/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-foreground block truncate max-w-[200px]">
                        {uploadedFile.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{uploadedFile.size} • Готов к анализу</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={removeFile} className="h-7 w-7 text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Textarea
                  rows={10}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Вставьте текст резюме или нажмите «Загрузить PDF» выше..."
                  className="font-mono text-xs leading-relaxed resize-y bg-background/50 border-border"
                />
              )}
            </CardContent>
          </Card>

          {/* Job Description Card */}
          <Card className="bg-card/70 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center justify-between">
                <span>2. Описание целевой вакансии</span>
                <span className="text-[11px] font-normal text-muted-foreground">Текст вакансии</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={9}
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Вставьте требования из описания вакансии (LinkedIn, hh.ru, Indeed)..."
                className="font-mono text-xs leading-relaxed resize-y bg-background/50 border-border"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Audit Results (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Score Card */}
          <Card className="bg-card/70 border-border overflow-hidden">
            <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-primary/10 via-card to-card border-b border-border/70">
              <div className="text-center sm:text-left">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Индекс соответствия (ATS Match Score)
                </span>
                <h3 className="text-3xl font-black mt-1 text-foreground">
                  {scanResult.match_score}% / 100%
                </h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  {scanResult.match_score >= 80
                    ? "Отличный результат! Резюме с высокой вероятностью пройдёт автоматический отбор."
                    : "Средний балл. Добавьте выделенные ключевые слова, чтобы роботы ATS не отсеяли резюме."}
                </p>
              </div>

              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <div
                  className="w-full h-full rounded-full flex items-center justify-center shadow-inner"
                  style={{
                    background: `conic-gradient(#6366f1 ${scanResult.match_score * 3.6}deg, #27272a 0deg)`,
                  }}
                >
                  <div className="w-20 h-20 rounded-full bg-card flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-black text-foreground">{scanResult.match_score}%</span>
                    <span className={`text-[9px] uppercase font-bold ${scanResult.match_score >= 80 ? "text-emerald-400" : "text-amber-400"}`}>
                      {scanResult.match_score >= 80 ? "Pass" : "Review"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-5 space-y-5">
              {/* Keywords Comparison */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5 font-semibold text-red-400">
                    <span className="flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> Отсутствующие ключевые навыки ({scanResult.missing_keywords.length})
                    </span>
                    <span className="text-[11px] text-muted-foreground font-normal">Критично для прохождения фильтра</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {scanResult.missing_keywords.map((kw) => (
                      <Badge
                        key={kw}
                        variant="outline"
                        className="text-xs bg-red-500/10 text-red-400 border-red-500/30 font-medium py-1"
                      >
                        +{kw}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5 font-semibold text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Успешно распознанные совпадения ({scanResult.present_keywords.length})
                    </span>
                    <span className="text-[11px] text-muted-foreground font-normal">Найдены роботом</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {scanResult.present_keywords.map((kw) => (
                      <Badge
                        key={kw}
                        variant="outline"
                        className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-medium py-1"
                      >
                        ✓ {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Formatting Risks */}
              {scanResult.format_issues && scanResult.format_issues.length > 0 && (
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Предупреждения по верстке для роботов ATS</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {scanResult.format_issues.map((issue, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {scanResult.suggestions && scanResult.suggestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-foreground">Конкретные шаги по улучшению:</h4>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {scanResult.suggestions.map((sug, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary font-bold">{idx + 1}.</span>
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AI Rewritten Recommendations */}
              {scanResult.optimized_sections && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>AI-сгенерированные блоки для вставки в резюме</span>
                  </h4>

                  {/* Rewritten Summary */}
                  {scanResult.optimized_sections.summary && (
                    <div className="rounded-xl border border-border p-3.5 bg-background/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">
                          Оптимизированное саммари (ATS Score: 98%)
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(scanResult.optimized_sections.summary, "summary")
                          }
                          className="h-7 text-xs text-muted-foreground hover:text-foreground"
                        >
                          {copiedSection === "summary" ? (
                            <>
                              <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                              Скопировано!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 mr-1" />
                              Копировать
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed italic bg-card/60 p-2.5 rounded-lg border border-border/50">
                        "{scanResult.optimized_sections.summary}"
                      </p>
                    </div>
                  )}

                  {/* Rewritten Skills List */}
                  {scanResult.optimized_sections.skills && (
                    <div className="rounded-xl border border-border p-3.5 bg-background/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">
                          Оптимальный блок навыков (Comma-separated)
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(scanResult.optimized_sections.skills, "skills")
                          }
                          className="h-7 text-xs text-muted-foreground hover:text-foreground"
                        >
                          {copiedSection === "skills" ? (
                            <>
                              <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                              Скопировано!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 mr-1" />
                              Копировать
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed font-mono bg-card/60 p-2.5 rounded-lg border border-border/50">
                        {scanResult.optimized_sections.skills}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upgrade to Pro Modal (YooKassa) */}
      <UpgradeModal
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
      />
    </div>
  );
}
