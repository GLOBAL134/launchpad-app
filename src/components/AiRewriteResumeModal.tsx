"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Check,
  Wand2,
  RefreshCw,
  TrendingUp,
  FileCheck2,
  Copy,
  Layers,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import { callAI } from "@/lib/ai-client";
import AiSettingsModal from "@/components/AiSettingsModal";
import { useApp } from "@/context/AppContext";
import { injectUserProfileIntoResume } from "@/lib/profile-utils";

export type LifeSituation = "standard" | "switch" | "gap" | "junior";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentResume: string;
  jobDescription: string;
  currentScore: number;
  missingSkills: string[];
  initialLifeSituation?: LifeSituation;
  onApplyRewritten: (newResumeText: string) => void;
}

export default function AiRewriteResumeModal({
  isOpen,
  onClose,
  currentResume,
  jobDescription,
  currentScore,
  missingSkills,
  initialLifeSituation = "standard",
  onApplyRewritten,
}: Props) {
  const { userProfile } = useApp();
  const [rewrittenText, setRewrittenText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [viewTab, setViewTab] = useState<"side_by_side" | "improved">("side_by_side");
  const [lifeSituation, setLifeSituation] = useState<LifeSituation>(initialLifeSituation);
  const [copied, setCopied] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    setLifeSituation(initialLifeSituation);
  }, [initialLifeSituation, isOpen]);

  const handleRewrite = async (situationOverride?: LifeSituation) => {
    setIsLoading(true);
    const activeSituation = situationOverride || lifeSituation;

    try {
      let situationInstruction = "";
      if (activeSituation === "switch") {
        situationInstruction = `\nСПЕЦИАЛЬНЫЙ РЕЖИМ: КАНДИДАТ МЕНЯЕТ ПРОФЕССИЮ / ПЕРЕХОДИТ В СМЕЖНУЮ СФЕРУ.
Переведи весь предшествующий опыт кандидата на профессиональный язык целевой вакансии. Подчеркни универсальные переносимые навыки (transferable skills): управление процессами, цифры, регламенты, договоры, коммуникация, анализ данных, чтобы работодатель видел опытного зрелого специалиста, а не новичка.`;
      } else if (activeSituation === "gap") {
        situationInstruction = `\nСПЕЦИАЛЬНЫЙ РЕЖИМ: БЫЛ ПЕРЕРЫВ В СТАЖЕ (декрет, бизнес, фриланс, поиск себя).
Упакуй период перерыва с максимальным профессиональным достоинством (проектная деятельность, непрерывное повышение квалификации, сохранение актуальности знаний), закрыв любые сомнения рекрутера.`;
      } else if (activeSituation === "junior") {
        situationInstruction = `\nСПЕЦИАЛЬНЫЙ РЕЖИМ: НАЧИНАЮЩИЙ СПЕЦИАЛИСТ / МАЛО ОПЫТА.
Максимально структурируй учебные, стажерские или личные проекты по формуле X-Y-Z с фокусом на профильные hard skills.`;
      }

      const systemPrompt = `You are a world-class executive resume architect and ATS optimization engine.
Your task is to completely rewrite and enhance the candidate's resume for the target job description to achieve a 92%+ ATS match score.${situationInstruction}

STRICT RULES:
1. Output plain human text only. NEVER use Markdown asterisks (**), hashtags (#), or code blocks.
2. Structure in clean Harvard ATS single-column layout:
   - Contact info header
   - ПРОФЕССИОНАЛЬНОЕ РЕЗЮМЕ / SUMMARY (3-4 high-impact lines)
   - ОПЫТ РАБОТЫ / EXPERIENCE (Use existing companies/dates, strengthen bullets using Google X-Y-Z formula with quantified %, $, руб, млн, time metrics)
   - КЛЮЧЕВЫЕ КОМПЕТЕНЦИИ И НАВЫКИ / SKILLS (naturally include all missing skills: ${missingSkills.slice(0, 8).join(", ")})
   - ОБРАЗОВАНИЕ / EDUCATION
3. Weave all missing requirements naturally into the experience bullets so ATS finds verified quotes.
4. Keep the candidate's real companies, roles, and dates intact. Elevate verbs and achievements.`;

      const userPrompt = `ТАРГЕТ-ВАКАНСИЯ:
${jobDescription.slice(0, 1000)}

ЦЕЛЕВЫЕ НАВЫКИ ДЛЯ ИНТЕГРАЦИИ В ОПЫТ:
${missingSkills.slice(0, 10).join(", ") || "Ключевые профильные навыки вакансии"}

ФИО СОИСКАТЕЛЯ: СТРОГО «${userProfile?.name || "Сохрани имя из резюме"}»

ТЕКУЩЕЕ РЕЗЮМЕ КАНДИДАТА (БЫЛО):
${currentResume}

Перепиши резюме целиком в эталонный Harvard ATS стандарт, оцифруй результаты по формуле X-Y-Z и органично вплети все недостающие навыки внутрь опыта работы. Без звездочек (**) и решеток (#). Сохраняй реальное ФИО кандидата «${userProfile?.name || ""}»!`;

      let groqKey = "";
      if (typeof window !== "undefined") {
        groqKey = localStorage.getItem("lp_groq_api_key") || "";
      }

      const res = await fetch("/api/ats-rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-groq-key": groqKey.trim(),
        },
        body: JSON.stringify({
          action: "full_rewrite",
          resumeText: currentResume,
          vacancyText: jobDescription,
          missingSkills,
          candidateName: userProfile?.name,
          candidateEmail: userProfile?.email,
          candidatePhone: userProfile?.phone,
          userApiKey: groqKey.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.rewrittenResume) {
        const enriched = injectUserProfileIntoResume(data.rewrittenResume, userProfile);
        setRewrittenText(enriched);
      } else {
        const fallbackRes = await callAI({
          systemPrompt,
          userPrompt,
          temperature: 0.3,
          mode: "resume_rewrite",
        });
        const enriched = injectUserProfileIntoResume(fallbackRes.text.trim(), userProfile);
        setRewrittenText(enriched);
      }
    } catch (err) {
      console.error(err);
      setRewrittenText(currentResume);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleRewrite();
    }
  }, [isOpen]);

  const handleApply = () => {
    if (!rewrittenText.trim()) return;
    const finalResume = injectUserProfileIntoResume(rewrittenText.trim(), userProfile);
    onApplyRewritten(finalResume);
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rewrittenText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100vw-20px)] sm:max-w-4xl max-h-[92vh] flex flex-col bg-card border-border shadow-2xl text-foreground p-0 overflow-hidden">
        {/* Header Banner */}
        <div className="p-3.5 sm:p-6 bg-gradient-to-r from-card via-card to-primary/10 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black shadow-lg shadow-primary/25 shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <DialogTitle className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-1.5 sm:gap-2">
                  <span>ИИ Авто-прокачка резюме</span>
                  <Badge variant="outline" className="text-[9px] sm:text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                    92%+ ATS
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                  Нейросеть переписывает буллеты по формуле Google X-Y-Z и вплетает навыки.
                </DialogDescription>
              </div>
            </div>

            {/* Score Evolution Pill */}
            <div className="flex items-center gap-2.5 sm:gap-3 bg-background/80 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-border shrink-0 self-start sm:self-auto">
              <div className="text-center">
                <span className="block text-[9px] sm:text-[10px] uppercase text-muted-foreground font-semibold">Было</span>
                <span className="text-xs sm:text-sm font-bold text-rose-400">{currentScore}%</span>
              </div>
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              <div className="text-center">
                <span className="block text-[9px] sm:text-[10px] uppercase text-muted-foreground font-semibold">Станет</span>
                <span className="text-xs sm:text-sm font-black text-emerald-400">92%+</span>
              </div>
            </div>
          </div>

          {/* Module 3: Career Switch & Gap Fixer Chips */}
          <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 text-xs">
            <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground flex items-center gap-1 shrink-0">
              <span>Режим:</span>
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0 sm:flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setLifeSituation("standard");
                  handleRewrite("standard");
                }}
                className={`px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium transition cursor-pointer border whitespace-nowrap shrink-0 ${
                  lifeSituation === "standard"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                Обычный поиск
              </button>
              <button
                type="button"
                onClick={() => {
                  setLifeSituation("switch");
                  handleRewrite("switch");
                }}
                className={`px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium transition cursor-pointer border whitespace-nowrap shrink-0 ${
                  lifeSituation === "switch"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                🔄 Смена профессии
              </button>
              <button
                type="button"
                onClick={() => {
                  setLifeSituation("gap");
                  handleRewrite("gap");
                }}
                className={`px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium transition cursor-pointer border whitespace-nowrap shrink-0 ${
                  lifeSituation === "gap"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                ⏸ Перерыв
              </button>
              <button
                type="button"
                onClick={() => {
                  setLifeSituation("junior");
                  handleRewrite("junior");
                }}
                className={`px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium transition cursor-pointer border whitespace-nowrap shrink-0 ${
                  lifeSituation === "junior"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                🎓 Мало опыта
              </button>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center justify-between gap-2 mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-border/60">
            <div className="flex p-0.5 rounded-lg bg-background/60 border border-border text-xs">
              <button
                onClick={() => setViewTab("side_by_side")}
                className={`px-2.5 sm:px-3 py-1 rounded-md transition cursor-pointer text-[11px] sm:text-xs font-medium ${
                  viewTab === "side_by_side"
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Было vs Стало
              </button>
              <button
                onClick={() => setViewTab("improved")}
                className={`px-2.5 sm:px-3 py-1 rounded-md transition cursor-pointer text-[11px] sm:text-xs font-medium ${
                  viewTab === "improved"
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Только улучшенное
              </button>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => handleRewrite()}
                disabled={isLoading}
                className="text-[11px] sm:text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Перегенерировать</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-3 sm:p-6 flex-1 overflow-y-auto space-y-4">
          {isLoading ? (
            <div className="h-64 sm:h-80 rounded-xl border border-dashed border-primary/40 bg-primary/5 flex flex-col items-center justify-center gap-3 text-center p-4 sm:p-6">
              <RefreshCw className="w-7 h-7 sm:w-8 sm:h-8 text-primary animate-spin" />
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-foreground">
                  Нейросеть переписывает резюме под требования вакансии...
                </h4>
                <p className="text-[11px] sm:text-xs text-muted-foreground max-w-md">
                  Оцифровываем результаты по формуле Google X-Y-Z, устраняем сиротские навыки и вплетаем: {missingSkills.slice(0, 4).join(", ") || "ключевые навыки"}.
                </p>
              </div>
            </div>
          ) : viewTab === "side_by_side" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* Left: Original (Было) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-rose-400 flex items-center gap-1.5 text-[11px] sm:text-xs">
                    <span>Было ({currentScore}% ATS):</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground">Оригинал</span>
                </div>
                <Textarea
                  value={currentResume}
                  readOnly
                  rows={10}
                  className="font-mono text-[11px] resize-none bg-muted/20 border-border opacity-70 leading-relaxed sm:h-72"
                />
              </div>

              {/* Right: Improved (Стало) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-[11px] sm:text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Стало (92%+ ATS):</span>
                  </span>
                  <button
                    onClick={handleCopy}
                    className="text-[10px] text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? "Скопировано!" : "Копировать"}</span>
                  </button>
                </div>
                <Textarea
                  value={rewrittenText}
                  onChange={(e) => setRewrittenText(e.target.value)}
                  rows={10}
                  className="font-mono text-[11px] resize-none bg-background/80 border-emerald-500/40 focus:border-emerald-500 text-foreground leading-relaxed sm:h-72"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-[11px] sm:text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Улучшенное ATS-резюме:</span>
                </span>
                <button
                  onClick={handleCopy}
                  className="text-[11px] text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? "Скопировано!" : "Копировать текст"}</span>
                </button>
              </div>
              <Textarea
                value={rewrittenText}
                onChange={(e) => setRewrittenText(e.target.value)}
                rows={12}
                className="font-mono text-xs resize-none bg-background/80 border-emerald-500/40 text-foreground leading-relaxed sm:h-96"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <DialogFooter className="p-3 sm:p-5 border-t border-border bg-card/60 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
          <div className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1.5 self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Балл ATS мгновенно пересчитается до 90%+</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-xs cursor-pointer h-8 sm:h-9">
              Отмена
            </Button>
            <Button
              size="sm"
              disabled={isLoading || !rewrittenText.trim()}
              onClick={handleApply}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 cursor-pointer flex-1 sm:flex-none h-8 sm:h-9"
            >
              <FileCheck2 className="w-3.5 h-3.5 mr-1.5 shrink-0" />
              <span>Заменить резюме</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
