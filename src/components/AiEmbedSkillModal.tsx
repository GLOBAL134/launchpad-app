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
import { Sparkles, Check, Wand2, RefreshCw, ArrowRight, ShieldCheck } from "lucide-react";
import { callAI } from "@/lib/ai-client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  skillName: string;
  jobTitle: string;
  resumeText: string;
  onApplyBullet: (generatedBullet: string) => void;
}

export default function AiEmbedSkillModal({
  isOpen,
  onClose,
  skillName,
  jobTitle,
  resumeText,
  onApplyBullet,
}: Props) {
  const [bulletText, setBulletText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [providerUsed, setProviderUsed] = useState("");

  const generateBullet = async () => {
    if (!skillName) return;
    setIsLoading(true);

    try {
      const systemPrompt = `You are an elite career strategist. Your task is to generate 1-2 realistic, high-impact bullet points for the candidate's work experience section that naturally demonstrates their practical mastery of the specified skill according to Google's X-Y-Z formula: "Accomplished [X] measured by [Y] doing [Z]".
Write plain human Russian text only. NEVER use Markdown asterisks (**), hashtags (#), or code fences. Start the bullet with "• ". Include realistic quantifiable metrics (%, руб, млн, ч, x, сроки).`;

      const userPrompt = `Целевая профессия / роль: ${jobTitle || "Специалист"}
Ключевой навык для встраивания: «${skillName}»

Контекст резюме кандидата:
${resumeText.slice(0, 700)}

Сгенерируй 1-2 мощных буллета для блока «Опыт работы», доказывающих практическое применение навыка «${skillName}» с оцифрованным бизнес-результатом.`;

      const res = await callAI({
        systemPrompt,
        userPrompt,
        temperature: 0.3,
        mode: "embed_skill",
      });

      setBulletText(res.text.trim());
      setProviderUsed(res.provider);
    } catch (err) {
      console.error(err);
      setBulletText(
        `• Успешно внедрил и применил «${skillName}» в ключевых рабочих процессах, сократив временные затраты на 32% и обеспечив 100% выполнение целевых показателей.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && skillName) {
      generateBullet();
    }
  }, [isOpen, skillName]);

  const handleApply = () => {
    if (!bulletText.trim()) return;
    onApplyBullet(bulletText.trim());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl bg-card border-border shadow-2xl text-foreground">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <span>ИИ-встраивание навыка в опыт работы</span>
                <Badge variant="outline" className="text-[10px] bg-rose-500/10 text-rose-300 border-rose-500/30">
                  {skillName}
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                По формуле 55/15/15/15 навык даёт баллы, только если подтвержден реальным результатом в опыте.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-1">
            <div className="flex items-center justify-between text-muted-foreground font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Формула Google X-Y-Z: Достиг [X], измерив [Y], сделав [Z]
              </span>
              <span className="text-[10px] text-primary font-mono">+12% к Hard Skills</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Нейросеть сгенерировала готовый буллет с упоминанием «{skillName}» и оцифрованной метрикой. Вы можете скорректировать цифры под свой реальный опыт.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-primary" />
                <span>Сгенерированный буллет для раздела «Опыт работы»:</span>
              </label>
              <button
                onClick={generateBullet}
                disabled={isLoading}
                className="text-[11px] text-primary hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
                <span>Перегенерировать</span>
              </button>
            </div>

            {isLoading ? (
              <div className="h-28 rounded-xl border border-dashed border-primary/40 bg-primary/5 flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
                <RefreshCw className="w-5 h-5 text-primary animate-spin" />
                <span>Нейросеть адаптирует формулу X-Y-Z под навык «{skillName}»...</span>
              </div>
            ) : (
              <Textarea
                value={bulletText}
                onChange={(e) => setBulletText(e.target.value)}
                rows={4}
                className="font-mono text-xs resize-none bg-background/60 border-border focus:border-primary/60"
                placeholder="• Успешно внедрил..."
              />
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-border/60">
          <span className="text-[10px] text-muted-foreground">
            {providerUsed ? `Модель: ${providerUsed}` : "Бесплатная нейросеть LaunchPad"}
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-xs cursor-pointer">
              Отмена
            </Button>
            <Button
              size="sm"
              disabled={isLoading || !bulletText.trim()}
              onClick={handleApply}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold shadow-md shadow-primary/20 cursor-pointer flex-1 sm:flex-none"
            >
              <Check className="w-3.5 h-3.5 mr-1.5" />
              Встроить в опыт работы
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
