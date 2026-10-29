"use client";

import { useState } from "react";
import { Sparkles, Trophy, ArrowRight, Plus, Trash2, CheckCircle2, AlertTriangle, ShieldCheck, Kanban, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { simulateAtsParser } from "@/lib/ats-parser-simulator";
import { analyzeJobRedFlags } from "@/lib/job-red-flags";
import { useApp } from "@/context/AppContext";

export interface BatchJobItem {
  id: string;
  title: string;
  company: string;
  text: string;
}

interface BatchJobComparatorProps {
  resumeText: string;
  onSelectJobForScanner: (jobText: string) => void;
  onToast: (msg: string) => void;
}

const DEFAULT_BATCH_JOBS: BatchJobItem[] = [
  {
    id: "batch-1",
    company: "Торговый Холдинг «Лидер»",
    title: "Ведущий специалист / Менеджер",
    text: `Ведущий специалист направления
Компания: Торговый Холдинг «Лидер»
Обязанности:
• Управление ключевыми рабочими процессами, планирование и сдача регулярной отчетности.
• Контроль первичных документов, работа в 1С и CRM-системах, координация смежных отделов.
• Выполнение квартальных нормативов и KPI.
Требования:
• Опыт от 3 лет, знание отраслевых стандартов, внимание к деталям, системность.`,
  },
  {
    id: "batch-2",
    company: "ГК «Ресурс-Плюс»",
    title: "Руководитель направления",
    text: `Руководитель направления
Компания: ГК «Ресурс-Плюс»
Обязанности:
• Организация работы подразделения, оптимизация затрат, перестройка регламентов.
• Развитие команды, внедрение автоматизации, переговоры с ключевыми партнерами.
Требования:
• Стрессоустойчивость, готовность к ненормированному дню, доход без потолка по результатам KPI.`,
  },
  {
    id: "batch-3",
    company: "Инновационная группа «Вектор»",
    title: "Эксперт проекта",
    text: `Эксперт направления
Компания: Инновационная группа «Вектор»
Обязанности:
• Анализ данных, контроль качества, управление рисками, ведение проектной документации.
• Соблюдение дедлайнов, подготовка презентаций руководству, командное взаимодействие.
Требования:
• Высшее образование, грамотная речь, навыки анализа и оцифровки результатов. Белая зарплата, ДМС со стоматологией.`,
  },
];

export function BatchJobComparator({
  resumeText,
  onSelectJobForScanner,
  onToast,
}: BatchJobComparatorProps) {
  const { addApplication } = useApp();
  const [jobs, setJobs] = useState<BatchJobItem[]>(DEFAULT_BATCH_JOBS);
  const [isComparing, setIsComparing] = useState(false);
  const [comparedResults, setComparedResults] = useState<
    Array<{
      job: BatchJobItem;
      atsScore: number;
      adequacyScore: number;
      overallRankScore: number;
      redFlagVerdict: string;
      redFlagTone: "safe" | "warning" | "danger";
      topSkills: string[];
    }> | null
  >(null);

  const handleAddJobSlot = () => {
    if (jobs.length >= 5) {
      onToast("Максимум 5 вакансий для одновременного сравнения.");
      return;
    }
    const newJob: BatchJobItem = {
      id: "batch-" + Date.now(),
      company: `Компания №${jobs.length + 1}`,
      title: "Целевая должность",
      text: "",
    };
    setJobs([...jobs, newJob]);
  };

  const handleRemoveJob = (id: string) => {
    if (jobs.length <= 2) {
      onToast("Для сравнения нужно как минимум 2 вакансии.");
      return;
    }
    setJobs(jobs.filter((j) => j.id !== id));
  };

  const handleUpdateJob = (id: string, field: keyof BatchJobItem, value: string) => {
    setJobs(
      jobs.map((j) => (j.id === id ? { ...j, [field]: value } : j))
    );
  };

  const handleRunComparison = () => {
    setIsComparing(true);

    setTimeout(() => {
      const results = jobs.map((j) => {
        const fullJobText = `${j.title} в компании ${j.company}\n\n${j.text}`;
        const atsSim = simulateAtsParser(resumeText, fullJobText, "ru");
        const redFlags = analyzeJobRedFlags(fullJobText);

        // Overall formula: 70% ATS Match + 30% Adequacy
        const overallRankScore = Math.round(atsSim.score.total * 0.7 + redFlags.adequacyScore * 0.3);

        return {
          job: j,
          atsScore: atsSim.score.total,
          adequacyScore: redFlags.adequacyScore,
          overallRankScore,
          redFlagVerdict: redFlags.verdictTitle,
          redFlagTone: redFlags.verdictTone,
          topSkills: atsSim.verifiedSkills.slice(0, 3).map((s) => s.name),
        };
      });

      // Sort by rank descending
      results.sort((a, b) => b.overallRankScore - a.overallRankScore);

      setComparedResults(results);
      setIsComparing(false);
      onToast("✓ Рейтинг вакансий рассчитан!");
    }, 400);
  };

  const handleSaveAllToKanban = () => {
    if (!comparedResults) return;
    for (const r of comparedResults) {
      addApplication({
        company: r.job.company,
        position: r.job.title,
        job_description: r.job.text,
        stage: "wishlist",
        resume_version: `${r.atsScore}% ATS Match`,
      });
    }
    onToast(`✓ Все ${comparedResults.length} вакансии сохранены в Канбан-трекер!`);
  };

  return (
    <Card className="bg-card border-border overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold">
              🔥
            </div>
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <span>Пакетное сравнение вакансий: «Куда откликаться в первую очередь»</span>
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Сравните до 5 предложений по ATS-совпадению и прозрачности условий, чтобы не тратить время на токсичные варианты
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddJobSlot}
              disabled={jobs.length >= 5}
              className="text-xs h-8 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Добавить вакансию ({jobs.length}/5)
            </Button>

            <Button
              size="sm"
              onClick={handleRunComparison}
              disabled={isComparing}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-8 font-bold shadow-md shadow-primary/20 cursor-pointer flex items-center gap-1.5"
            >
              {isComparing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              )}
              <span>Сравнить шансы</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-4 text-xs">
        {/* Results Banner if compared */}
        {comparedResults && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Trophy className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-foreground">
                    Победитель рейтинга: Вакансия №1 — «{comparedResults[0].job.company}»
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Наивысший шанс на оффер: совпадение резюме <strong>{comparedResults[0].atsScore}%</strong> при индексе адекватности <strong>{comparedResults[0].adequacyScore}%</strong>. Рекомендуем откликаться сюда в первую очередь!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={() => onSelectJobForScanner(`${comparedResults[0].job.title} в компании ${comparedResults[0].job.company}\n\n${comparedResults[0].job.text}`)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 cursor-pointer"
                >
                  Выбрать в сканер
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSaveAllToKanban}
                  className="text-xs border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 cursor-pointer"
                >
                  <Kanban className="w-3.5 h-3.5 mr-1" />
                  Все в Канбан
                </Button>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="border border-border/80 rounded-xl overflow-hidden bg-card/40">
              <div className="grid grid-cols-12 p-3 bg-muted/60 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <div className="col-span-1 text-center">Ранг</div>
                <div className="col-span-4">Вакансия и компания</div>
                <div className="col-span-2 text-center">ATS Match</div>
                <div className="col-span-2 text-center">Адекватность</div>
                <div className="col-span-3 text-right">Действие</div>
              </div>

              <div className="divide-y divide-border/60">
                {comparedResults.map((item, idx) => (
                  <div
                    key={item.job.id}
                    className={`grid grid-cols-12 p-3 items-center text-xs transition ${
                      idx === 0 ? "bg-emerald-500/5 font-semibold" : "hover:bg-muted/30"
                    }`}
                  >
                    <div className="col-span-1 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-black text-xs ${
                          idx === 0
                            ? "bg-amber-400 text-black shadow-sm"
                            : idx === 1
                            ? "bg-zinc-400 text-black"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        #{idx + 1}
                      </span>
                    </div>

                    <div className="col-span-4 pr-2">
                      <div className="font-bold text-foreground truncate">{item.job.title}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{item.job.company}</div>
                    </div>

                    <div className="col-span-2 text-center">
                      <span
                        className={`font-black font-mono text-sm ${
                          item.atsScore >= 80 ? "text-emerald-400" : item.atsScore >= 60 ? "text-amber-400" : "text-rose-400"
                        }`}
                      >
                        {item.atsScore}%
                      </span>
                    </div>

                    <div className="col-span-2 text-center">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                          item.redFlagTone === "safe"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                            : item.redFlagTone === "warning"
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                            : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                        }`}
                      >
                        {item.adequacyScore}%
                      </span>
                    </div>

                    <div className="col-span-3 text-right flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          onSelectJobForScanner(
                            `${item.job.title} в компании ${item.job.company}\n\n${item.job.text}`
                          )
                        }
                        className="h-7 text-xs text-primary hover:bg-primary/10 cursor-pointer"
                      >
                        Выбрать
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {jobs.map((job, idx) => (
            <div
              key={job.id}
              className="p-3 rounded-xl border border-border/80 bg-card/60 space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-primary/20 text-primary flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span>Вакансия #{idx + 1}</span>
                  </span>

                  {jobs.length > 2 && (
                    <button
                      onClick={() => handleRemoveJob(job.id)}
                      className="text-muted-foreground hover:text-rose-400 p-1 transition cursor-pointer"
                      title="Удалить слот"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Input
                    value={job.company}
                    onChange={(e) => handleUpdateJob(job.id, "company", e.target.value)}
                    placeholder="Компания"
                    className="h-7 text-xs"
                  />
                  <Input
                    value={job.title}
                    onChange={(e) => handleUpdateJob(job.id, "title", e.target.value)}
                    placeholder="Должность"
                    className="h-7 text-xs"
                  />
                </div>

                <Textarea
                  value={job.text}
                  onChange={(e) => handleUpdateJob(job.id, "text", e.target.value)}
                  placeholder="Вставьте текст обязанностей и требований..."
                  rows={4}
                  className="text-xs font-mono resize-none bg-background/50"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
