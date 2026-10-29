"use client";

import { useState } from "react";
import { AlertTriangle, ShieldCheck, AlertCircle, Sparkles, HelpCircle, Copy, Check, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { analyzeJobRedFlags, JobRedFlagsAnalysis, RedFlagTrigger } from "@/lib/job-red-flags";
import { callAI } from "@/lib/ai-client";

interface JobRedFlagsCardProps {
  jobText: string;
  companyName?: string;
  positionName?: string;
  onToast: (msg: string) => void;
}

export function JobRedFlagsCard({
  jobText,
  companyName = "Работодатель",
  positionName = "Специалист",
  onToast,
}: JobRedFlagsCardProps) {
  const analysis: JobRedFlagsAnalysis = analyzeJobRedFlags(jobText);

  const [expandedTriggerId, setExpandedTriggerId] = useState<string | null>(
    analysis.triggers[0]?.id || null
  );
  const [copiedQuestionIndex, setCopiedQuestionIndex] = useState<number | null>(null);
  const [aiQuestions, setAiQuestions] = useState<string[] | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleCopyQuestion = (question: string, index: number) => {
    navigator.clipboard.writeText(question);
    setCopiedQuestionIndex(index);
    onToast("✓ Вопрос для рекрутера скопирован!");
    setTimeout(() => setCopiedQuestionIndex(null), 2000);
  };

  const handleGenerateAiDeepCheck = async () => {
    setIsGeneratingAi(true);

    const userPrompt = `Проанализируй вакансию на позицию «${positionName}» в компании «${companyName}» и сформулируй 3 точечных вежливых вопроса рекрутеру или руководителю на первом собеседовании.
    
ТЕКСТ ВАКАНСИИ:
${jobText.slice(0, 1600)}

ТРЕБОВАНИЯ:
- Напиши ровно 3 вопроса с нумерацией 1, 2, 3.
- Вопросы должны быть максимально дипломатичными, но вскрывать реальные подводные камни: переработки, реальный размер оклада без скрытых штрафов, причины ухода предыдущего сотрудника.
- Пиши чистым человеческим текстом БЕЗ звёздочек **, без решёток ###, без лишней воды.`;

    try {
      const res = await callAI({
        systemPrompt:
          "Ты независимый консультант по карьерной безопасности. Формулируй острые дипломатичные проверочные вопросы для кандидатов без разметки markdown.",
        userPrompt,
        temperature: 0.3,
        mode: "text",
      });

      if (res.text) {
        const questions = res.text
          .split(/\n+/)
          .map((line) => line.replace(/^\d+[\.\)]\s*/, "").trim())
          .filter((line) => line.length > 20 && !line.toLowerCase().includes("вопрос"))
          .slice(0, 3);

        if (questions.length > 0) {
          setAiQuestions(questions);
          onToast("✓ ИИ сформулировал 3 персональных вопроса для собеседования!");
        } else {
          setAiQuestions(analysis.recommendedQuestions);
        }
      }
    } catch (err) {
      console.warn("AI questions generation error:", err);
      setAiQuestions(analysis.recommendedQuestions);
      onToast("Использованы проверенные вопросы карьерных экспертов.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const questionsToDisplay = aiQuestions || analysis.recommendedQuestions;

  return (
    <Card className="bg-card border-border overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                analysis.verdictTone === "safe"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : analysis.verdictTone === "warning"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
              }`}
            >
              🚩
            </div>
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <span>Рентген вакансии: Детектор «Красных флагов»</span>
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Автоматический разбор текста на скрытые переработки, токсичность и размытые KPI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Индекс адекватности
              </span>
              <span
                className={`text-lg font-black ${
                  analysis.adequacyScore >= 85
                    ? "text-emerald-400"
                    : analysis.adequacyScore >= 60
                    ? "text-amber-400"
                    : "text-rose-400"
                }`}
              >
                {analysis.adequacyScore}%
              </span>
            </div>
            <div
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                analysis.verdictTone === "safe"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : analysis.verdictTone === "warning"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-300 animate-pulse"
              }`}
            >
              {analysis.verdictTitle}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-4 text-xs">
        {/* Verdict Banner */}
        <div
          className={`p-3.5 rounded-xl border flex items-start gap-3 ${
            analysis.verdictTone === "safe"
              ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-200"
              : analysis.verdictTone === "warning"
              ? "bg-amber-500/10 border-amber-500/25 text-amber-200"
              : "bg-rose-500/10 border-rose-500/25 text-rose-200"
          }`}
        >
          {analysis.verdictTone === "safe" ? (
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <span className="font-bold text-xs block">{analysis.verdictTitle}</span>
            <p className="text-[11px] leading-relaxed opacity-90">{analysis.verdictDescription}</p>
          </div>
        </div>

        {/* Found Triggers List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
              <span>Обнаруженные сигналы в вакансии:</span>
              <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px]">
                {analysis.triggers.length}
              </span>
            </span>
            <span className="text-[11px] text-muted-foreground">Нажмите для перевода с HR-языка</span>
          </div>

          {analysis.triggers.length === 0 ? (
            <div className="p-4 border border-dashed border-border rounded-xl text-center text-muted-foreground text-xs space-y-1">
              <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto opacity-70" />
              <div className="font-semibold text-foreground">Прямых скрытых ловушек не обнаружено</div>
              <p className="text-[11px]">Работодатель не использует типичные манипулятивные маркеры переработок.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {analysis.triggers.map((trigger) => {
                const isExpanded = expandedTriggerId === trigger.id;
                return (
                  <div
                    key={trigger.id}
                    className="border border-border/80 rounded-xl bg-card/60 overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setExpandedTriggerId(isExpanded ? null : trigger.id)}
                      className="w-full p-3 flex items-center justify-between text-left hover:bg-muted/40 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            trigger.severity === "high"
                              ? "bg-rose-500 animate-pulse"
                              : trigger.severity === "medium"
                              ? "bg-amber-400"
                              : "bg-blue-400"
                          }`}
                        />
                        <span className="font-bold text-foreground text-xs">{trigger.foundKeyword}</span>
                        <Badge variant="outline" className="text-[10px] py-0 border-border/60 text-muted-foreground">
                          {trigger.categoryRu}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span className="text-[10px] hidden sm:inline">
                          {isExpanded ? "Скрыть" : "Что это значит?"}
                        </span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-3 pt-0 border-t border-border/50 bg-background/40 space-y-2 text-[11px]">
                        <div>
                          <span className="text-muted-foreground block text-[10px] uppercase font-bold mb-0.5">
                            🗣 Перевод с языка HR на человеческий:
                          </span>
                          <p className="text-foreground leading-relaxed font-sans">{trigger.humanTranslation}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary-foreground/90">
                          <span className="text-primary font-bold block text-[10px] uppercase mb-0.5">
                            💡 Как проверить на интервью:
                          </span>
                          <p className="text-foreground">{trigger.advice}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 3 Questions for HR with AI Generator */}
        <div className="pt-3 border-t border-border space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-primary" />
                3 вопроса для первого созвона с рекрутером
              </span>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Задайте их, чтобы сразу проверить адекватность руководства и реальные условия
              </p>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handleGenerateAiDeepCheck}
              disabled={isGeneratingAi}
              className="text-xs h-7 border-primary/40 text-primary hover:bg-primary/10 cursor-pointer flex items-center gap-1 shrink-0 font-semibold"
            >
              {isGeneratingAi ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3 text-amber-400" />
              )}
              <span>{isGeneratingAi ? "Генерация с ИИ..." : "Сгенерировать с ИИ"}</span>
            </Button>
          </div>

          <div className="space-y-2">
            {questionsToDisplay.map((q, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-border/70 bg-card/40 flex items-start justify-between gap-2.5 hover:border-border transition"
              >
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs leading-relaxed text-foreground">{q}</p>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopyQuestion(q, idx)}
                  className="h-7 px-2 text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                  title="Скопировать вопрос"
                >
                  {copiedQuestionIndex === idx ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
