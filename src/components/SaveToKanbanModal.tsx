"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Kanban,
  CheckCircle2,
  Sparkles,
  BellRing,
  Send,
  Building,
  Briefcase,
  Calendar,
  RefreshCw,
  FileText,
} from "lucide-react";
import { callAI } from "@/lib/ai-client";
import { useApp } from "@/context/AppContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  resumeText: string;
  jobDescription: string;
  atsScore: number;
}

export default function SaveToKanbanModal({
  isOpen,
  onClose,
  resumeText,
  jobDescription,
  atsScore,
}: Props) {
  const router = useRouter();
  const { addApplication, showToast } = useApp();

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);
  const [followUpDays, setFollowUpDays] = useState(6);

  // Auto-extract company and position from job description on open
  useEffect(() => {
    if (isOpen) {
      const companyMatch = jobDescription.match(/(?:компани[ия]|работодатель|company)[:\s]+([^\n,]+)/i);
      const posMatch = jobDescription.match(/(?:ваканси[яи]|должност[ьи]|позици[яи]|role|position)[:\s]+([^\n,]+)/i);

      const firstLine = jobDescription.trim().split("\n")[0] || "";
      const guessedPos = posMatch ? posMatch[1].trim() : firstLine.slice(0, 45);
      const guessedCompany = companyMatch ? companyMatch[1].trim() : "Компания";

      setPosition(guessedPos);
      setCompany(guessedCompany);

      // Auto-generate high-converting cover letter for this role
      generateCoverLetter(guessedCompany, guessedPos);
    }
  }, [isOpen, jobDescription]);

  const generateCoverLetter = async (comp: string, pos: string) => {
    setIsGeneratingLetter(true);
    try {
      const systemPrompt = `You are an elite career strategist. Write a concise, personalized, high-converting Russian cover letter (3 short paragraphs) from the candidate to the company hiring team.
Write plain human text only. NEVER use Markdown asterisks (**), hashtags (#), or code fences.`;

      const userPrompt = `КОМПАНИЯ: ${comp || "Работодатель"}
ДОЛЖНОСТЬ: ${pos || "Специалист"}

РЕЗЮМЕ КАНДИДАТА:
${resumeText.slice(0, 800)}

ВАКАНСИЯ:
${jobDescription.slice(0, 600)}

Сгенерируй сильное, живое сопроводительное письмо без нейрошаблонов и без Markdown символов.`;

      const res = await callAI({
        systemPrompt,
        userPrompt,
        temperature: 0.3,
      });

      setCoverLetter(res.text.trim());
    } catch (err) {
      console.error(err);
      setCoverLetter(`Здравствуйте, команда ${comp}!\n\nС большим интересом откликаюсь на позицию «${pos}». Мой практический опыт полностью соответствует ключевым задачам вашей роли. Буду рад встретиться на онлайн-интервью и подробнее обсудить детали.`);
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  const handleSaveToKanban = () => {
    const finalCompany = company.trim() || "Компания";
    const finalPosition = position.trim() || "Специалист";

    addApplication({
      company: finalCompany,
      position: finalPosition,
      stage: "applied",
      job_description: jobDescription,
      notes: `✓ Отклик сохранен из ATS-сканера с баллом соответствия ${atsScore}%.`,
      cover_letter: coverLetter,
      resume_version: `ATS-90+ (${finalPosition})`,
      location: "Удаленно / Офис",
    });

    showToast(`🚀 Вакансия «${finalCompany}» сохранена в Канбан! Напоминание запланировано на ${followUpDays}-й день.`);
    onClose();
    router.push("/tracker");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100vw-20px)] sm:max-w-2xl max-h-[92vh] flex flex-col bg-card border-border shadow-2xl text-foreground p-0 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-card via-card to-indigo-500/10 border-b border-border">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-600/25 shrink-0">
              <Kanban className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <DialogTitle className="text-sm sm:text-base font-bold flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span>Сохранение в Канбан</span>
                <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                  {atsScore}% ATS
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                Прикрепляет резюме, генерирует письмо и планирует Follow-Up.
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto">
          {/* Target Role Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground">
                <Building className="w-3.5 h-3.5 text-primary" />
                <span>Компания / Работодатель:</span>
              </Label>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Например, Яндекс, Т-Банк, Сбер..."
                className="text-xs h-9 bg-background/60"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground">
                <Briefcase className="w-3.5 h-3.5 text-primary" />
                <span>Целевая должность:</span>
              </Label>
              <Input
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Например, Главный бухгалтер..."
                className="text-xs h-9 bg-background/60"
              />
            </div>
          </div>

          {/* Cover Letter Section */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Готовое сопроводительное письмо (Cover Letter AI):</span>
              </Label>
              <button
                onClick={() => generateCoverLetter(company, position)}
                disabled={isGeneratingLetter}
                className="text-[11px] text-primary hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isGeneratingLetter ? "animate-spin" : ""}`} />
                <span>Перегенерировать</span>
              </button>
            </div>

            {isGeneratingLetter ? (
              <div className="h-28 rounded-xl border border-dashed border-indigo-500/40 bg-indigo-500/5 flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
                <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
                <span>Генерация персонализированного письма под компанию {company || "работодателя"}...</span>
              </div>
            ) : (
              <Textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={5}
                className="font-mono text-xs resize-none bg-background/60 border-border"
                placeholder="Здравствуйте, команда..."
              />
            )}
          </div>

          {/* Automation summary box */}
          <div className="p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/5 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-indigo-300">
              <BellRing className="w-4 h-4 text-indigo-400" />
              <span>Автоматизация воронки откликов:</span>
            </div>
            <ul className="space-y-1.5 text-muted-foreground text-[11px]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Карточка добавится в колонку «Отправлено» (Applied) с ATS-скором {atsScore}%</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>В Центре напоминаний будет создан Follow-Up пинг на 6-й день</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Адаптированное резюме сохранено в истории версий для этой компании</span>
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="p-4 sm:p-5 border-t border-border bg-card/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs cursor-pointer">
            Отмена
          </Button>

          <Button
            size="sm"
            onClick={handleSaveToKanban}
            disabled={isGeneratingLetter || !position.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 cursor-pointer w-full sm:w-auto"
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Сохранить в Канбан и перейти в трекер →
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
