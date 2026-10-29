"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Send,
  ExternalLink,
  Layers,
  Flame,
  Globe,
  FileText,
  Target,
  Video,
  Share2,
  ChevronRight,
  ShieldAlert,
  ArrowLeft,
  Sliders,
  Award,
  KeyRound,
  Download,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  PR_TARGET_ROLES,
  PR_FEATURES,
  buildPrBatchWave,
  PrBatchResult,
  PrChannelContent,
} from "@/lib/pr-generator";
import { callAI } from "@/lib/ai-client";
import { AiSettingsModal } from "@/components/AiSettingsModal";

function PrStudioContent() {
  const [selectedRole, setSelectedRole] = useState(PR_TARGET_ROLES[0].id);
  const [customRole, setCustomRole] = useState("");
  const [selectedFeature, setSelectedFeature] = useState(PR_FEATURES[0].id);
  const [tone, setTone] = useState<"viral" | "case_study" | "guide">("viral");

  const [isLoading, setIsLoading] = useState(false);
  const [batchResult, setBatchResult] = useState<PrBatchResult | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [editableChannels, setEditableChannels] = useState<Record<string, string>>({});
  const [providerBadge, setProviderBadge] = useState<string>("LaunchPad AI Engine");
  const [isAiSettingsOpen, setIsAiSettingsOpen] = useState(false);
  const [hasCustomKey, setHasCustomKey] = useState(false);

  // Get active role title
  const activeRoleLabel =
    customRole.trim() ||
    PR_TARGET_ROLES.find((r) => r.id === selectedRole)?.label ||
    "Специалист";

  // Check saved keys in localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const g = localStorage.getItem("lp_groq_api_key");
      const gem = localStorage.getItem("lp_gemini_api_key");
      setHasCustomKey(Boolean(g?.trim() || gem?.trim()));
    }
  }, [isAiSettingsOpen]);

  // Initial generation on load
  useEffect(() => {
    const initialBatch = buildPrBatchWave(activeRoleLabel, selectedFeature, undefined, tone);
    setBatchResult(initialBatch);
    const initialTexts: Record<string, string> = {};
    Object.entries(initialBatch.channels).forEach(([k, v]) => {
      initialTexts[k] = v.content;
    });
    setEditableChannels(initialTexts);
  }, []);

  const handleSelectRole = (roleId: string) => {
    setSelectedRole(roleId);
    setCustomRole("");
    const roleObj = PR_TARGET_ROLES.find((r) => r.id === roleId);
    const label = roleObj?.label || "Специалист";
    const freshBatch = buildPrBatchWave(label, selectedFeature, undefined, tone);
    setBatchResult(freshBatch);
    const newTexts: Record<string, string> = {};
    Object.entries(freshBatch.channels).forEach(([k, v]) => {
      newTexts[k] = v.content;
    });
    setEditableChannels(newTexts);
  };

  const handleSelectFeature = (featId: string) => {
    setSelectedFeature(featId);
    const freshBatch = buildPrBatchWave(activeRoleLabel, featId, undefined, tone);
    setBatchResult(freshBatch);
    const newTexts: Record<string, string> = {};
    Object.entries(freshBatch.channels).forEach(([k, v]) => {
      newTexts[k] = v.content;
    });
    setEditableChannels(newTexts);
  };

  const handleSelectTone = (t: "viral" | "case_study" | "guide") => {
    setTone(t);
    const freshBatch = buildPrBatchWave(activeRoleLabel, selectedFeature, undefined, t);
    setBatchResult(freshBatch);
    const newTexts: Record<string, string> = {};
    Object.entries(freshBatch.channels).forEach(([k, v]) => {
      newTexts[k] = v.content;
    });
    setEditableChannels(newTexts);
  };

  const handleGenerateWave = async () => {
    setIsLoading(true);

    const featureObj = PR_FEATURES.find((f) => f.id === selectedFeature) || PR_FEATURES[0];

    const systemPrompt = `You are the Head of Growth and Chief PR Strategist for LaunchPad AI PRO (an ATS resume optimization, red flag detection, and salary negotiation platform for ALL professions).
Generate a viral marketing wave of 7 high-converting posts formatted exactly with the following delimiter tags:
===PIKABU===
(Engaging first-person storytelling, promo code START30 for 30% discount, STRICTLY NO direct links)
===TENCHAT===
(Business expert breakdown with clean bullets, reminder "link in 1st comment", engaging closing question)
===LINKEDIN===
(Punchy 2-line hook before 'see more', bullets with ✅, comment-bait asking readers to comment their job title)
===VC===
(In-depth case study with numbers: from 60% to 95% ATS match, Google X-Y-Z formula breakdown)
===HASHNODE===
(Technical career deep dive in English explaining 55/15/15/15 ATS heuristics and Harvard formatting)
===INDIEHACKERS===
(English Build in Public update. STRICTLY NO .vercel.app links, STRICTLY NO words like 'free', 'promo', 'discount'. Focus on AI tech stack, MRR traction, and retention)
===CREATIVE===
(Nano Banana image prompt for Midjourney/Flux + 10-second vertical video script with 0-3s Hook, 3-7s Pain/Demo, 7-10s CTA)`;

    const userPrompt = `TARGET ROLE: ${activeRoleLabel}
FEATURE FOCUS: ${featureObj.label} (${featureObj.desc})
TONE: ${tone === "viral" ? "Вирусный / Провокационный" : tone === "case_study" ? "Глубокий кейс с цифрами" : "Экспертный обучающий гайд"}
BRAND: LaunchPad AI PRO (https://launchpad-app-ashy.vercel.app)
PROMO CODE: START30 (30% скидка на PRO)

Сгенерируй все 7 готовых публикаций по тегам ===PIKABU===, ===TENCHAT===, ===LINKEDIN===, ===VC===, ===HASHNODE===, ===INDIEHACKERS===, ===CREATIVE===.`;

    try {
      const res = await callAI({
        systemPrompt,
        userPrompt,
        temperature: 0.7,
        mode: "pr_studio",
      });

      if (res.provider) {
        setProviderBadge(res.provider);
      }

      const newBatch = buildPrBatchWave(activeRoleLabel, selectedFeature, res.text, tone);
      setBatchResult(newBatch);
      const newTexts: Record<string, string> = {};
      Object.entries(newBatch.channels).forEach(([k, v]) => {
        newTexts[k] = v.content;
      });
      setEditableChannels(newTexts);
    } catch (err) {
      console.warn("Using localized PR engine wave:", err);
      const fallback = buildPrBatchWave(activeRoleLabel, selectedFeature, undefined, tone);
      setBatchResult(fallback);
      setProviderBadge("LaunchPad Local Synthesizer");
      const newTexts: Record<string, string> = {};
      Object.entries(fallback.channels).forEach(([k, v]) => {
        newTexts[k] = v.content;
      });
      setEditableChannels(newTexts);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySingle = (channelId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(channelId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyAll = () => {
    if (!batchResult) return;
    const fullMarkdown = Object.entries(batchResult.channels)
      .map(([id, ch]) => {
        const text = editableChannels[id] || ch.content;
        return `## ${ch.platformName} (${ch.badge})\n\n${text}\n\n---\n`;
      })
      .join("\n");

    navigator.clipboard.writeText(fullMarkdown);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 3000);
  };

  const handleDownloadMarkdown = () => {
    if (!batchResult) return;
    const fullMarkdown = Object.entries(batchResult.channels)
      .map(([id, ch]) => {
        const text = editableChannels[id] || ch.content;
        return `## ${ch.platformName} (${ch.badge})\n\n${text}\n\n---\n`;
      })
      .join("\n");

    const blob = new Blob([fullMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pr-wave-${batchResult.roleName.toLowerCase().replace(/[^a-zа-я0-9]/gi, "-")}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getPlatformExternalUrl = (id: string): string => {
    switch (id) {
      case "pikabu":
        return "https://pikabu.ru/";
      case "tenchat":
        return "https://tenchat.ru/";
      case "linkedin":
        return "https://www.linkedin.com/feed/";
      case "vc":
        return "https://vc.ru/new";
      case "hashnode":
        return "https://hashnode.com/";
      case "indiehackers":
        return "https://www.indiehackers.com/";
      default:
        return "https://launchpad-app-ashy.vercel.app/";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Founder Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-card/80 backdrop-blur-md px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold px-2 py-1.5 rounded-lg hover:bg-muted transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">В кабинет</span>
          </Link>

          <div className="h-4 w-px bg-border/80 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-primary/30 shadow-md shadow-primary/20 shrink-0">
              <Image
                src="/logo.png"
                alt="LaunchPad AI PRO"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-foreground">LaunchPad</span>
                <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 text-[10px] font-black tracking-wider uppercase px-1.5 py-0.5">
                  PR-Комбайн Основателя
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs font-mono hidden md:inline-flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Founder Mode Active (?admin=pr)
          </Badge>

          <Link href="/scanner">
            <Button size="sm" variant="outline" className="text-xs border-border/80 cursor-pointer">
              <Target className="w-3.5 h-3.5 mr-1 text-primary" />
              <span>ATS-Сканер</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Hero Banner */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-card to-indigo-950/30 border border-purple-500/30 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Вирусный генератор контента в 7 каналов одновременно</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-foreground tracking-tight">
              PR & Growth Wave Generator
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Выберите целевую профессию и ключевую фичу LaunchPad AI — нейросеть мгновенно сгенерирует 7
              адаптированных постов под правила Пикабу, TenChat, LinkedIn, VC.ru, Hashnode, Indie Hackers и
              промпты для вирусных видео.
            </p>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="p-4 sm:p-6 rounded-2xl bg-card border border-border space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/70">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">Параметры контент-волны</h2>
            </div>
            <div className="flex items-center gap-2">
              {hasCustomKey ? (
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ИИ-движок подключен
                </span>
              ) : (
                <span className="text-[11px] text-cyan-400 font-medium flex items-center gap-1">
                  ⚡ Движок LaunchPad AI PRO
                </span>
              )}
            </div>
          </div>

          {/* 1. Target Profession Selector */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-foreground flex items-center justify-between">
              <span>1. Целевая профессия (для кого пишем):</span>
              <span className="text-[10px] text-primary">Поддерживает любые специальности</span>
            </label>

            {/* Quick Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {PR_TARGET_ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleSelectRole(role.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedRole === role.id && !customRole
                      ? "bg-primary text-primary-foreground border-primary font-bold shadow-md shadow-primary/20"
                      : "bg-background/80 border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>

            {/* Custom Profession Input */}
            <div className="pt-1">
              <Input
                placeholder="Или введите свою профессию (например: Финансовый директор, Врач, Шеф-повар, Дизайнер интерьеров)..."
                value={customRole}
                onChange={(e) => {
                  setCustomRole(e.target.value);
                  if (e.target.value.trim().length > 2) {
                    const freshBatch = buildPrBatchWave(e.target.value.trim(), selectedFeature, undefined, tone);
                    setBatchResult(freshBatch);
                    const newTexts: Record<string, string> = {};
                    Object.entries(freshBatch.channels).forEach(([k, v]) => {
                      newTexts[k] = v.content;
                    });
                    setEditableChannels(newTexts);
                  }
                }}
                className="text-xs bg-background/60 border-border/80 h-9"
              />
            </div>
          </div>

          {/* 2. Feature Focus Selector */}
          <div className="space-y-2.5 pt-2">
            <label className="text-xs font-bold text-foreground block">
              2. Фокусная фича для продвижения:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {PR_FEATURES.map((feat) => {
                const isSelected = selectedFeature === feat.id;
                return (
                  <div
                    key={feat.id}
                    onClick={() => handleSelectFeature(feat.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-primary/10 border-primary ring-1 ring-primary/40 shadow-sm"
                        : "bg-background/60 border-border/70 hover:border-border hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-foreground">{feat.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Tone Selector & Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-border/60">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-background border border-border/70 text-xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground px-2">
                Тон:
              </span>
              <button
                onClick={() => handleSelectTone("viral")}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  tone === "viral"
                    ? "bg-purple-600 text-white font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🔥 Вирусный
              </button>
              <button
                onClick={() => handleSelectTone("case_study")}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  tone === "case_study"
                    ? "bg-purple-600 text-white font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                📊 Кейс с цифрами
              </button>
              <button
                onClick={() => handleSelectTone("guide")}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  tone === "guide"
                    ? "bg-purple-600 text-white font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🎓 Гайд
              </button>
            </div>

            <Button
              onClick={handleGenerateWave}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 via-indigo-600 to-primary hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-600/25 h-10 px-5 cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Генерируем волну из 7 публикаций...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Сгенерировать контент-пачку (Волна)</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Results Section */}
        {batchResult && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-foreground">
                  Готовая контент-пачка для:
                </span>
                <Badge variant="outline" className="text-xs border-primary/40 text-primary">
                  {batchResult.roleName}
                </Badge>
                <span className="text-[11px] text-muted-foreground hidden md:inline">
                  • {providerBadge}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  size="sm"
                  onClick={handleCopyAll}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-md shadow-primary/20 cursor-pointer flex-1 sm:flex-none"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  <span>{copiedAll ? "Скопированы все 7 постов!" : "Скопировать ВСЕ (Markdown)"}</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownloadMarkdown}
                  className="text-xs border-border/80 cursor-pointer flex items-center gap-1"
                  title="Скачать все посты единым .md файлом"
                >
                  <Download className="w-3.5 h-3.5 text-purple-400" />
                  <span className="hidden sm:inline">Скачать .md</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleGenerateWave}
                  disabled={isLoading}
                  className="text-xs border-border/80 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-1 ${isLoading ? "animate-spin" : ""}`} />
                  <span>Обновить</span>
                </Button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                Все 7 каналов
              </button>
              {Object.entries(batchResult.channels).map(([id, ch]) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer whitespace-nowrap shrink-0 ${
                    activeTab === id
                      ? "bg-primary text-primary-foreground font-bold"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {ch.platformName}
                </button>
              ))}
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Object.entries(batchResult.channels)
                .filter(([id]) => activeTab === "all" || activeTab === id)
                .map(([id, ch]) => {
                  const currentText = editableChannels[id] ?? ch.content;
                  const isCopied = copiedId === id;
                  const charCount = currentText.length;
                  const wordCount = currentText.trim().split(/\s+/).filter(Boolean).length;

                  return (
                    <div
                      key={id}
                      className="rounded-2xl bg-card border border-border p-4 sm:p-5 flex flex-col justify-between space-y-3.5 hover:border-primary/40 transition shadow-sm"
                    >
                      {/* Card Header */}
                      <div className="space-y-1.5 border-b border-border/60 pb-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-foreground">
                              {ch.platformName}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 border-purple-500/30 bg-purple-500/10 text-purple-300"
                            >
                              {ch.badge}
                            </Badge>
                          </div>

                          <a
                            href={getPlatformExternalUrl(id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-primary hover:underline flex items-center gap-1"
                          >
                            <span>Открыть</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        <p className="text-[11px] text-muted-foreground leading-snug">
                          {ch.rulesHint}
                        </p>
                      </div>

                      {/* Editable Post Body */}
                      <div className="space-y-1.5 flex-1">
                        <Textarea
                          value={currentText}
                          onChange={(e) =>
                            setEditableChannels({ ...editableChannels, [id]: e.target.value })
                          }
                          rows={11}
                          className="font-mono text-xs leading-relaxed bg-background/60 border-border/80 focus:border-primary resize-y"
                        />

                        <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1">
                          <span>
                            {charCount} символов • ~{wordCount} слов
                          </span>
                          <span className="text-emerald-400">✓ Готово к публикации</span>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleCopySingle(id, currentText)}
                          className={`w-full text-xs font-bold shadow-sm transition cursor-pointer flex items-center justify-center gap-1.5 ${
                            isCopied
                              ? "bg-emerald-600 text-white"
                              : "bg-primary text-primary-foreground hover:bg-primary/90"
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Скопировано в буфер!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Скопировать для {ch.platformName}</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground bg-card/40 mt-12 flex flex-col items-center gap-2">
        <p>
          LaunchPad AI PRO Growth Engine • Внутренний закрытый инструмент основателя (?admin=pr)
        </p>
        <p className="text-[11px] text-muted-foreground/70 flex items-center gap-1 font-mono">
          <Terminal className="w-3 h-3 text-primary" />
          <span>Консольный генератор в терминале: <code>npm run pr-wave</code></span>
        </p>
      </footer>
    </div>
  );
}

export default function PrStudioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center p-6 text-xs text-muted-foreground">
          Загрузка PR-комбайна...
        </div>
      }
    >
      <PrStudioContent />
    </Suspense>
  );
}
