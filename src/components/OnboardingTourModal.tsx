"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ScanSearch,
  Mail,
  Kanban,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Flame,
  Award,
  TrendingUp,
  Clock,
  ShieldCheck,
  Target,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

const ONBOARDING_STORAGE_KEY = "lp_onboarding_completed_v1";

interface Step {
  id: number;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  highlights: { title: string; desc: string; icon: React.ReactNode }[];
  route?: string;
  routeLabel?: string;
}

export default function OnboardingTourModal() {
  const router = useRouter();
  const { isOnboardingOpen, setIsOnboardingOpen } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  // Auto-open for first-time visitors once
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const completed = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (!completed) {
        // Small delay so page transition completes
        const timer = setTimeout(() => {
          setIsOnboardingOpen(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, [setIsOnboardingOpen]);

  const handleClose = () => {
    setIsOnboardingOpen(false);
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    } catch {
      // ignore
    }
  };

  const steps: Step[] = [
    {
      id: 0,
      badge: "Шаг 1 из 4 • Знакомство",
      badgeColor: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
      title: "Добро пожаловать в LaunchPad AI PRO",
      subtitle:
        "Персональный командный центр соискателя, созданный для преодоления роботов-фильтров ATS и кратного роста приглашений на интервью.",
      icon: <Sparkles className="w-6 h-6 text-indigo-400" />,
      highlights: [
        {
          title: "Почему роботы отсекают 75% резюме?",
          desc: "ATS (Workday, Taleo, E-Staff) сканируют текст на ключевые Hard Skills и отклоняют двухколоночную верстку ещё до взгляда рекрутера.",
          icon: <ShieldCheck className="w-4 h-4 text-rose-400" />,
        },
        {
          title: "Формула аудита 55/15/15/15",
          desc: "Объективная оценка соответствия: 55% точные навыки вакансии, 15% оцифрованные метрики, 15% Soft Skills и 15% гарвардская одноколоночная верстка.",
          icon: <Award className="w-4 h-4 text-emerald-400" />,
        },
        {
          title: "Синхронизация профиля",
          desc: "Ваше имя, контакты и отрасль автоматически внедряются во все генерируемые документы.",
          icon: <Target className="w-4 h-4 text-amber-400" />,
        },
      ],
    },
    {
      id: 1,
      badge: "Шаг 2 из 4 • Сканер резюме",
      badgeColor: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
      title: "AI ATS-Сканер и Улучшение до 90%+",
      subtitle:
        "Аудит любого резюме против любой вакансии в режиме реального времени с авто-внедрением недостающих навыков по формуле Google X-Y-Z.",
      icon: <ScanSearch className="w-6 h-6 text-cyan-400" />,
      route: "/scanner",
      routeLabel: "Перейти в Сканер",
      highlights: [
        {
          title: "Быстрое сравнение текстов",
          desc: "Вставьте текст резюме и вакансии либо выберите готовую профессию из пресетов (Бухгалтер, Продажи, IT, Учитель, Актер и др.).",
          icon: <CheckCircle2 className="w-4 h-4 text-cyan-400" />,
        },
        {
          title: "«Улучшить резюме с ИИ (до 90%+)»",
          desc: "Нейросеть переписывает буллеты опыта работы, устраняет сиротские навыки и вплетает требования вакансии с сохранением вашего ФИО.",
          icon: <Flame className="w-4 h-4 text-amber-400" />,
        },
        {
          title: "Экспорт в Harvard Standard",
          desc: "Копируйте результат для HeadHunter в 1 клик или сохраняйте готовую карточку отклика прямо в Канбан.",
          icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
        },
      ],
    },
    {
      id: 2,
      badge: "Шаг 3 из 4 • Сопроводительные письма",
      badgeColor: "bg-purple-500/15 text-purple-300 border-purple-500/30",
      title: "Генератор адресных писем без штампов",
      subtitle:
        "Создавайте персонализированные сопроводительные письма с оцифрованными достижениями, строго релевантными вашей целевой роли.",
      icon: <Mail className="w-6 h-6 text-purple-400" />,
      route: "/cover-letter",
      routeLabel: "Перейти к письмам",
      highlights: [
        {
          title: "Никаких шаблонных фраз",
          desc: "Забудьте о штампах «Я коммуникабельный и стрессоустойчивый». Письмо строится вокруг болей работодателя и ваших фактов.",
          icon: <CheckCircle2 className="w-4 h-4 text-purple-400" />,
        },
        {
          title: "Умный синтез достижений",
          desc: "Если поле ключевого достижения оставлено пустым — ИИ сам сформирует оцифрованный метрический факт строго под вашу профессию.",
          icon: <Sparkles className="w-4 h-4 text-amber-400" />,
        },
        {
          title: "3 тональности на выбор",
          desc: "Уверенный профи, ориентированный на цифры или тёплый дружелюбный тон под культуру стартапа.",
          icon: <Target className="w-4 h-4 text-sky-400" />,
        },
      ],
    },
    {
      id: 3,
      badge: "Шаг 4 из 4 • Канбан и Воронка",
      badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      title: "Канбан-трекер и Центр напоминаний",
      subtitle:
        "Управляйте воронкой откликов, контролируйте конверсию каждого этапа и не теряйте контакт с рекрутерами.",
      icon: <Kanban className="w-6 h-6 text-emerald-400" />,
      route: "/tracker",
      routeLabel: "Открыть Канбан",
      highlights: [
        {
          title: "Карточки со всеми материалами",
          desc: "Каждая карточка хранит текст вакансии, адаптированное резюме, сгенерированное письмо и историю этапов.",
          icon: <Kanban className="w-4 h-4 text-emerald-400" />,
        },
        {
          title: "Авто-напоминания (Follow-Up)",
          desc: "Система подскажет, если рекрутер молчит более 3-5 дней, и составит вежливое письмо-напоминание для возобновления диалога.",
          icon: <Clock className="w-4 h-4 text-amber-400" />,
        },
        {
          title: "Чистый старт или примеры",
          desc: "Демо-примеры наглядно показывают структуру воронки. Вы можете очистить их в 1 клик или начать добавлять свои реальные отклики.",
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
        },
      ],
    },
  ];

  const current = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleNavigateToRoute = (route?: string) => {
    if (route) {
      handleClose();
      router.push(route);
    }
  };

  return (
    <Dialog open={isOnboardingOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-24px)] sm:max-w-xl p-0 overflow-hidden bg-card/95 border border-border/80 shadow-2xl backdrop-blur-2xl text-foreground"
      >
        {/* Header with Step Indicator */}
        <div className="relative p-5 sm:p-6 pb-4 bg-gradient-to-b from-primary/15 via-primary/5 to-transparent border-b border-border/60">
          <div className="flex items-center justify-between gap-3 mb-3">
            <Badge className={`${current.badgeColor} border text-[10px] sm:text-xs font-semibold py-0.5 px-2.5`}>
              {current.badge}
            </Badge>

            <button
              onClick={handleClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition cursor-pointer"
              title="Закрыть обучение"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-background/80 border border-border flex items-center justify-center shrink-0 shadow-md">
              {current.icon}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground leading-snug">
                {current.title}
              </h2>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {current.subtitle}
              </p>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5 mt-4">
            {steps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentStep(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentStep
                    ? "w-8 bg-primary"
                    : idx < currentStep
                    ? "w-4 bg-primary/40 hover:bg-primary/60"
                    : "w-3 bg-muted hover:bg-muted-foreground/40"
                }`}
                title={`Перейти к шагу ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Highlights Body */}
        <div className="p-5 sm:p-6 space-y-3">
          {current.highlights.map((h, i) => (
            <div
              key={i}
              className="p-3 sm:p-3.5 rounded-xl border border-border/60 bg-background/50 hover:bg-background/80 transition flex items-start gap-3"
            >
              <div className="w-7 h-7 rounded-lg bg-card border border-border/70 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                {h.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-foreground leading-tight">
                  {h.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {h.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-border bg-card/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                className="text-xs cursor-pointer h-9 px-3"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Назад
              </Button>
            )}

            {current.route && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigateToRoute(current.route)}
                className="text-xs text-primary hover:text-primary hover:bg-primary/10 cursor-pointer h-9"
              >
                <span>{current.routeLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-xs text-muted-foreground hover:text-foreground cursor-pointer h-9"
            >
              Пропустить
            </Button>

            <Button
              size="sm"
              onClick={handleNext}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs shadow-md shadow-primary/20 cursor-pointer h-9 px-4 flex-1 sm:flex-none"
            >
              <span>{currentStep === steps.length - 1 ? "Завершить обучение" : "Далее"}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
