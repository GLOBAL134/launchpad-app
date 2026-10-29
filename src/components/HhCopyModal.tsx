"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, HelpCircle, FileText, UserCheck, Sparkles, Award } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { splitResumeForHh, HhResumeBlocks } from "@/lib/export-resume";

interface HhCopyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeText: string;
}

export function HhCopyModal({ open, onOpenChange, resumeText }: HhCopyModalProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const blocks: HhResumeBlocks = splitResumeForHh(resumeText);

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => {
      setCopiedSection(null);
    }, 2500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-20px)] sm:max-w-2xl bg-card border-border text-foreground max-h-[92vh] flex flex-col p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 font-bold text-xs shrink-0">
              hh
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
                Умное копирование для HeadHunter (hh.ru)
              </DialogTitle>
              <DialogDescription className="text-[11px] sm:text-xs text-muted-foreground">
                Резюме разбито на 3 блока в точном соответствии с полями формы на hh.ru
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1 text-xs">
          {/* Tip Banner */}
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Почему это важно:</strong> Алгоритмы поиска кандидатов HeadHunter отдельно индексируют блоки <em>«Опыт работы»</em>, <em>«О себе»</em> и облако <em>«Ключевые навыки»</em>. Вставьте эти блоки в соответствующие поля на hh.ru, чтобы поднять анкету в топ выдачи рекрутеров.
            </div>
          </div>

          {/* Block 1: Experience */}
          <div className="space-y-2 p-3 bg-card/60 border border-border/80 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-primary" />
                1. Блок «Опыт работы» (Обязанности и оцифрованные достижения)
              </span>
              <Button
                size="sm"
                variant={copiedSection === "exp" ? "default" : "outline"}
                onClick={() => copyToClipboard(blocks.experience, "exp")}
                className={`text-xs h-7 cursor-pointer ${copiedSection === "exp" ? "bg-emerald-600 text-white" : ""}`}
              >
                {copiedSection === "exp" ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Скопировано!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    Скопировать для опыта
                  </>
                )}
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Вставьте в поле «Обязанности» у последнего места работы на hh.ru:
            </p>
            <Textarea
              readOnly
              value={blocks.experience}
              rows={4}
              className="font-mono text-xs bg-background/50 border-border resize-none"
            />
          </div>

          {/* Block 2: Summary */}
          <div className="space-y-2 p-3 bg-card/60 border border-border/80 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-amber-400" />
                2. Блок «О себе» (Summary)
              </span>
              <Button
                size="sm"
                variant={copiedSection === "summary" ? "default" : "outline"}
                onClick={() => copyToClipboard(blocks.summary, "summary")}
                className={`text-xs h-7 cursor-pointer ${copiedSection === "summary" ? "bg-emerald-600 text-white" : ""}`}
              >
                {copiedSection === "summary" ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Скопировано!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    Скопировать блок «О себе»
                  </>
                )}
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Вставьте в графу «О себе» внизу резюме на hh.ru:
            </p>
            <Textarea
              readOnly
              value={blocks.summary}
              rows={3}
              className="font-mono text-xs bg-background/50 border-border resize-none"
            />
          </div>

          {/* Block 3: Key Skills */}
          <div className="space-y-2 p-3 bg-card/60 border border-border/80 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-400" />
                3. Блок «Ключевые навыки» (Теги для поиска рекрутеров)
              </span>
              <Button
                size="sm"
                variant={copiedSection === "skills" ? "default" : "outline"}
                onClick={() => copyToClipboard(blocks.skills, "skills")}
                className={`text-xs h-7 cursor-pointer ${copiedSection === "skills" ? "bg-emerald-600 text-white" : ""}`}
              >
                {copiedSection === "skills" ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Скопировано!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    Скопировать теги навыков
                  </>
                )}
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Вставьте в поле «Ключевые навыки» на hh.ru (слова через запятую превратятся в поисковые теги):
            </p>
            <Textarea
              readOnly
              value={blocks.skills}
              rows={2}
              className="font-mono text-xs bg-background/50 border-border resize-none"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs cursor-pointer text-muted-foreground"
          >
            Закрыть
          </Button>

          <Button
            size="sm"
            onClick={() => window.open("https://hh.ru/applicant/resumes", "_blank")}
            className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-500/20 cursor-pointer flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Открыть мои резюме на hh.ru
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
