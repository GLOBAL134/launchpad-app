"use client";

import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Briefcase,
  Users,
  DollarSign,
  Calculator,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";

export default function HiringFunnelCalculator() {
  const { authSession, openAuthModal } = useApp();

  const [submissions, setSubmissions] = useState<number>(40);
  const [currentScore, setCurrentScore] = useState<number>(55);

  const stats = useMemo(() => {
    // 1. Standard search calculations
    const normalConversion = Math.max(2, Math.round((currentScore / 100) * 4.5));
    const normalInterviews = Math.max(1, Math.round((submissions * normalConversion) / 100));
    const normalOffers = Math.max(0, Math.round(normalInterviews * 0.18));
    const normalMonths = Math.max(3, Math.round(20 / Math.max(1, normalInterviews)));
    const lostSalaryMonths = Math.max(1, normalMonths - 1);
    const lostIncome = lostSalaryMonths * 280000; // 280k avg IT salary

    // 2. LaunchPad AI PRO search calculations (17% base + 34% follow-up boost = 22.8%)
    const proConversion = 17;
    const proBoosted = Math.round(proConversion * 1.34); // ~23%
    const proInterviews = Math.max(2, Math.round((submissions * proBoosted) / 100));
    const proOffers = Math.max(1, Math.round(proInterviews * 0.32));
    const proMonths = 1.2;

    return {
      normalConversion,
      normalInterviews,
      normalOffers,
      normalMonths,
      lostIncome,
      proConversion,
      proBoosted,
      proInterviews,
      proOffers,
      proMonths,
      interviewsDiff: proInterviews - normalInterviews,
      offersDiff: Math.max(1, proOffers - normalOffers),
    };
  }, [submissions, currentScore]);

  const handleCta = () => {
    if (authSession) {
      window.location.href = "/scanner";
    } else {
      openAuthModal("register");
    }
  };

  return (
    <section id="funnel-calculator" className="py-20 relative overflow-hidden bg-card/30 border-y border-border/60">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Calculator className="w-3.5 h-3.5" />
            <span>Интерактивный калькулятор потерь</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Посчитайте вашу{" "}
            <span className="bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-400 bg-clip-text text-transparent">
              потерю офферов
            </span>{" "}
            и времени
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Роботы ATS отсеивают до 75% резюме без человека, а отсутствие Follow-Up срезает 34% конверсии.
            Узнайте, сколько приглашений и зарплаты вы теряете прямо сейчас.
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 bg-card border border-border p-6 rounded-2xl shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>Параметры вашего поиска:</span>
            </h3>

            {/* Slider 1: Submissions per month */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  Откликов в месяц:
                </label>
                <span className="text-sm font-mono font-black text-primary px-2.5 py-0.5 rounded-lg bg-primary/10 border border-primary/20">
                  {submissions} вак.
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={200}
                step={5}
                value={submissions}
                onChange={(e) => setSubmissions(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>10 откликов</span>
                <span>100 откликов</span>
                <span>200 откликов</span>
              </div>
            </div>

            {/* Slider 2: Current resume score */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  Текущий скор вашего резюме:
                </label>
                <span
                  className={`text-sm font-mono font-black px-2.5 py-0.5 rounded-lg border ${
                    currentScore >= 75
                      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                      : currentScore >= 55
                      ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                      : "text-rose-400 bg-rose-500/10 border-rose-500/20"
                  }`}
                >
                  {currentScore}%
                </span>
              </div>
              <input
                type="range"
                min={40}
                max={95}
                step={1}
                value={currentScore}
                onChange={(e) => setCurrentScore(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>40% (Слабый)</span>
                <span>65% (Средний)</span>
                <span>95% (BigTech)</span>
              </div>
            </div>

            {/* Financial loss highlight */}
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-1.5">
              <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-rose-400" />
                <span>Недополученный доход соискателя:</span>
              </div>
              <div className="text-2xl font-black text-rose-400">
                ~{stats.lostIncome.toLocaleString("ru-RU")} ₽
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Из-за затягивания поиска на лишние {stats.normalMonths - 1} мес. без оптимизированного резюме и Follow-Up.
              </p>
            </div>

            {/* Channel Yield Matrix */}
            <div className="space-y-2 pt-2 border-t border-border">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Вероятность звонка рекрутера по каналам:
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-background border border-border/80">
                  <div className="text-[10px] text-muted-foreground">Рефералка</div>
                  <div className="text-base font-black text-emerald-400 mt-0.5">67%</div>
                </div>
                <div className="p-2.5 rounded-lg bg-background border border-border/80">
                  <div className="text-[10px] text-muted-foreground">Хабр Карьера</div>
                  <div className="text-base font-black text-blue-400 mt-0.5">40%</div>
                </div>
                <div className="p-2.5 rounded-lg bg-background border border-border/80">
                  <div className="text-[10px] text-muted-foreground">HeadHunter</div>
                  <div className="text-base font-black text-amber-400 mt-0.5">25%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Real-Time Comparison (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Ordinary Search Card */}
              <div className="p-5 rounded-2xl border border-rose-500/30 bg-card/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                      Обычный поиск
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">Без Follow-Up</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <span className="text-muted-foreground">Конверсия в ответ:</span>
                    <span className="font-bold text-foreground">{stats.normalConversion}%</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <span className="text-muted-foreground">Интервью в месяц:</span>
                    <span className="font-bold text-rose-300 text-sm">{stats.normalInterviews}</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <span className="text-muted-foreground">Отсев роботами ATS:</span>
                    <span className="font-bold text-rose-400">до 75% заявок</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <span className="text-muted-foreground">Среднее время ответа:</span>
                    <span className="font-bold text-foreground">18.5 дней</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Итоговых офферов:</span>
                    <span className="font-black text-foreground text-sm">{stats.normalOffers}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-rose-500/10 text-[11px] text-rose-300">
                  ⚠️ Резюме тонет в сотнях заявок на хедхантере без системного подхода.
                </div>
              </div>

              {/* LaunchPad AI PRO Card */}
              <div className="p-5 rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-card via-card to-emerald-500/10 space-y-4 shadow-lg shadow-emerald-500/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      С LaunchPad AI PRO
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                    +34% буст
                  </Badge>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <span className="text-muted-foreground">Конверсия в ответ:</span>
                    <span className="font-bold text-emerald-400">{stats.proBoosted}%</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <span className="text-muted-foreground">Интервью в месяц:</span>
                    <span className="font-black text-emerald-400 text-sm flex items-center gap-1">
                      <span>{stats.proInterviews}</span>
                      <span className="text-[10px] text-emerald-300">(+{stats.interviewsDiff})</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <span className="text-muted-foreground">Прохождение ATS:</span>
                    <span className="font-bold text-emerald-400">98% (Стандарт 55/15/15/15)</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <span className="text-muted-foreground">Среднее время ответа:</span>
                    <span className="font-bold text-emerald-400">3.4 дня</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Итоговых офферов:</span>
                    <span className="font-black text-emerald-400 text-sm flex items-center gap-1">
                      <span>{stats.proOffers}</span>
                      <span className="text-[10px] text-emerald-300">(+{stats.offersDiff})</span>
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-[11px] text-emerald-300">
                  ✨ Полная оцифровка буллетов XYZ, адаптация под вакансию и умные напоминания.
                </div>
              </div>
            </div>

            {/* CTA Banner under calculator */}
            <div className="p-5 rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/15 via-card to-card flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Перестаньте терять до {stats.offersDiff} офферов каждый месяц</span>
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Запустите бесплатный аудит резюме прямо сейчас и поднимите свой скор до 94%.
                </p>
              </div>

              <Button
                onClick={handleCta}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs shadow-lg shadow-primary/25 h-10 px-6 cursor-pointer shrink-0"
              >
                <span>Увеличить скор до 94% →</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}