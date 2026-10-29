"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Printer,
  ChevronRight,
  DollarSign,
  ShieldAlert,
  Layers,
  Award,
  Zap,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SeoResumeExample } from "@/data/seo-resume-examples";
import { useApp } from "@/context/AppContext";

interface Props {
  example: SeoResumeExample;
}

export default function ExampleDetailClient({ example }: Props) {
  const { lang, setLang } = useApp();
  const [activeTab, setActiveTab] = useState<"after" | "before">("after");
  const [copied, setCopied] = useState(false);

  const role = lang === "ru" ? example.roleRu : example.roleEn;
  const salary = lang === "ru" ? example.salaryRangeRu : example.salaryRangeEn;
  const flaws = lang === "ru" ? example.flawsRu : example.flawsEn;
  const improvements = lang === "ru" ? example.improvementsRu : example.improvementsEn;
  const resumeText =
    activeTab === "after"
      ? lang === "ru"
        ? example.afterResumeTextRu
        : example.afterResumeTextEn
      : lang === "ru"
      ? example.beforeResumeTextRu
      : example.beforeResumeTextEn;

  const handleCopy = () => {
    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLoadInScanner = () => {
    if (typeof window !== "undefined") {
      const resume = lang === "ru" ? example.afterResumeTextRu : example.afterResumeTextEn;
      const job = lang === "ru" ? example.sampleJobSnippetRu : example.sampleJobSnippetEn;
      localStorage.setItem("launchpad_scanner_resume", resume);
      localStorage.setItem("launchpad_scanner_job", job);
      window.location.href = "/scanner";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg overflow-hidden shadow shrink-0 border border-white/10 group-hover:border-primary/40 transition">
                <Image
                  src="/logo.png"
                  alt="LaunchPad AI PRO"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold hidden sm:inline">LaunchPad</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link href="/examples" className="text-muted-foreground hover:text-foreground transition-colors">
              {lang === "ru" ? "Библиотека" : "Library"}
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold text-primary truncate max-w-[140px] sm:max-w-[280px]">
              {example.slug}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "ru" ? "en" : "ru")}
              className="px-2.5 py-1 text-xs font-medium rounded-lg border border-border bg-card hover:bg-muted transition text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {lang === "ru" ? "🇷🇺 RU" : "🇬🇧 EN"}
            </button>

            <Button
              size="sm"
              onClick={handleLoadInScanner}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              <span>{lang === "ru" ? "Загрузить в ATS-сканер" : "Load in ATS Scanner"}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 flex-1 w-full">
        {/* Back Link */}
        <div>
          <Link
            href="/examples"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{lang === "ru" ? "Назад ко всем 8 эталонным резюме" : "Back to all 8 benchmark resumes"}</span>
          </Link>
        </div>

        {/* Hero Card */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="text-xs bg-muted/60 border-border">
              {example.level}
            </Badge>
            <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
              {example.demandBadge}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {role}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span className="text-foreground font-semibold">{salary}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span>{lang === "ru" ? "Стандарт: Harvard Single-Column ATS" : "Standard: Harvard Single-Column ATS"}</span>
            </div>
          </div>
        </div>

        {/* Score Comparison Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Before 60% */}
          <div className="p-6 rounded-2xl border border-rose-500/30 bg-rose-500/[0.03] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>{lang === "ru" ? "ДО ОПТИМИЗАЦИИ (Типовое резюме)" : "BEFORE AUDIT (Standard Resume)"}</span>
              </div>
              <div className="text-2xl font-black text-rose-400 font-mono">
                {example.beforeScore}%
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {lang === "ru"
                ? "75% резюме с такой структурой автоматически отбраковываются Taleo и Workday до звонка рекрутера."
                : "75% of resumes with this structure are dropped by corporate ATS before human review."}
            </p>

            <div className="space-y-2 pt-2 border-t border-rose-500/20">
              <div className="text-xs font-bold text-rose-300">
                {lang === "ru" ? "3 фатальные ошибки, сбившие рейтинг:" : "3 fatal flaws that triggered rejections:"}
              </div>
              {flaws.map((flaw, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-rose-300/80">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>{flaw}</span>
                </div>
              ))}
            </div>
          </div>

          {/* After 95% */}
          <div className="p-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/[0.04] space-y-4 shadow-xl shadow-emerald-500/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>{lang === "ru" ? "ПОСЛЕ СТАНДАРТА LAUNCHPAD" : "AFTER LAUNCHPAD OPTIMIZATION"}</span>
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {example.afterScore}%
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {lang === "ru"
                ? "Гарантированный проход ATS-скрининга и попадание в топ-3% релевантных кандидатов в базе вакансии."
                : "Guaranteed ATS bypass placing the candidate into the top 3% pool in modern ATS engines."}
            </p>

            <div className="space-y-2 pt-2 border-t border-emerald-500/20">
              <div className="text-xs font-bold text-emerald-300">
                {lang === "ru" ? "3 ключевых улучшения по формуле XYZ:" : "3 key improvements via XYZ formula:"}
              </div>
              {improvements.map((imp, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-emerald-300/90">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{imp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 55/15/15/15 Breakdown Progress Bar */}
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold">
                {lang === "ru" ? "Детализация баллов по формуле 55 / 15 / 15 / 15" : "55 / 15 / 15 / 15 Scoring Breakdown"}
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {example.afterScore} / 100 PTS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5 p-3 rounded-xl bg-background/60 border border-border/60">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Hard Skills (55%)</span>
                <span className="font-mono font-bold text-primary">{example.breakdown.hardSkills}% / 55%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${(example.breakdown.hardSkills / 55) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5 p-3 rounded-xl bg-background/60 border border-border/60">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">{lang === "ru" ? "Метрики XYZ (15%)" : "XYZ Metrics (15%)"}</span>
                <span className="font-mono font-bold text-emerald-400">{example.breakdown.quantMetrics}% / 15%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${(example.breakdown.quantMetrics / 15) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5 p-3 rounded-xl bg-background/60 border border-border/60">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Soft Skills (15%)</span>
                <span className="font-mono font-bold text-sky-400">{example.breakdown.softSkills}% / 15%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all"
                  style={{ width: `${(example.breakdown.softSkills / 15) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5 p-3 rounded-xl bg-background/60 border border-border/60">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">ATS Layout (15%)</span>
                <span className="font-mono font-bold text-amber-400">{example.breakdown.atsLayout}% / 15%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${(example.breakdown.atsLayout / 15) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Target Job Requirements Snippet */}
        <div className="p-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/[0.02] space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>{lang === "ru" ? "Фрагмент требований реальной вакансии (Job Spec):" : "Reference Job Description Excerpt:"}</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-mono bg-background/60 p-4 rounded-xl border border-border/60">
            {lang === "ru" ? example.sampleJobSnippetRu : example.sampleJobSnippetEn}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[11px] text-muted-foreground self-center mr-1">
              {lang === "ru" ? "Ключевые слова для ATS:" : "ATS Keywords:"}
            </span>
            {example.targetSkills.map((sk) => (
              <span key={sk} className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* Interactive Resume Viewer */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-card border border-border">
              <button
                onClick={() => setActiveTab("after")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === "after"
                    ? "bg-emerald-600 text-white shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {lang === "ru" ? "✨ Эталонное резюме (95% ATS)" : "✨ Optimized Resume (95% ATS)"}
              </button>
              <button
                onClick={() => setActiveTab("before")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === "before"
                    ? "bg-rose-600 text-white shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {lang === "ru" ? "⚠️ Исходный вариант (60%)" : "⚠️ Weak Version (60%)"}
              </button>
            </div>

            {/* Actions for active resume */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="text-xs font-medium cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                <span>{copied ? (lang === "ru" ? "Скопировано!" : "Copied!") : lang === "ru" ? "Копировать текст" : "Copy Text"}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="text-xs font-medium cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 mr-1.5" />
                <span>{lang === "ru" ? "Печать / PDF" : "Print / PDF"}</span>
              </Button>
            </div>
          </div>

          {/* Resume Box */}
          <div className="p-6 sm:p-10 rounded-2xl border border-border/80 bg-card/60 shadow-inner font-sans text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-text print:bg-white print:text-black print:border-none print:p-0">
            {resumeText}
          </div>
        </div>

        {/* 1-Click Load CTA Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-600/20 via-primary/20 to-sky-600/20 border-2 border-emerald-500/40 text-center space-y-5 shadow-2xl">
          <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
            {lang === "ru" ? "Готово к тестированию" : "Ready for live audit"}
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {lang === "ru"
              ? "Загрузите этот шаблон в ATS-сканер прямо сейчас"
              : "Load this optimized template into the ATS Scanner in 1 click"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            {lang === "ru"
              ? "Мы автоматически вставим это резюме и фрагмент вакансии в сканер, чтобы вы могли протестировать распознавание и заменить данные на свой реальный опыт."
              : "We will prefill the ATS scanner with this resume and target job spec so you can experience full parsing and customize it."}
          </p>
          <Button
            size="lg"
            onClick={handleLoadInScanner}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base px-8 h-12 shadow-xl shadow-emerald-600/25 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            <span>{lang === "ru" ? "Загрузить шаблон в ATS-сканер →" : "Load Template into ATS Scanner →"}</span>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-8 bg-background text-xs text-muted-foreground text-center">
        <p>© 2026 LaunchPad AI PRO. Оптимизировано для роботов Taleo, Workday, Greenhouse и российских HR-систем.</p>
      </footer>
    </div>
  );
}
