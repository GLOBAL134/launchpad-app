"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ScanSearch,
  Kanban,
  PenTool,
  BellRing,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Clock,
  Send,
  FileText,
  Target,
  ChevronRight,
  ChevronDown,
  Star,
  Quote,
  Briefcase,
  Layers,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UpgradeModal } from "@/components/UpgradeModal";

export default function LandingPage() {
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [targetPlan, setTargetPlan] = useState<"pro_monthly" | "pro_quarterly">("pro_monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleOpenUpgrade = (plan: "pro_monthly" | "pro_quarterly") => {
    setTargetPlan(plan);
    setUpgradeOpen(true);
  };

  const faqs = [
    {
      q: "Что такое ATS и почему 75% резюме отсеиваются роботами?",
      a: "ATS (Applicant Tracking System) — это автоматизированное ПО (Workday, Taleo, Greenhouse, E-Staff, Поток и др.), которое парсит и фильтрует резюме соискателей до того, как их увидит человек. Если в тексте резюме не хватает точных ключевых слов из описания вакансии или используется несовместимое форматирование (таблицы, графика, многоколоночные блоки), кандидат автоматически получает низкий рейтинг соответствия и отсеивается.",
    },
    {
      q: "Как работает оплата тарифа через ЮKassa?",
      a: "Мы подключены к официальному сертифицированному платежному шлюзу ЮKassa. Вы можете безопасно оплатить подписку любой российской банковской картой (МИР, Visa, Mastercard) или через Систему быстрых платежей (СБП). Платежи надежно зашифрованы по протоколу PCI DSS, чек высылается на вашу электронную почту согласно 54-ФЗ.",
    },
    {
      q: "Безопасны ли мои персональные данные и файлы резюме?",
      a: "Абсолютно. Ваши резюме и данные об откликах принадлежат только вам. Мы не передаем персональные данные сторонним рекрутинговым агентствам и не продаем базу резюме. Анализ текста осуществляется в изолированном контексте нейросети без обучения на ваших конфиденциальных данных.",
    },
    {
      q: "Могу ли я полноценно использовать LaunchPad бесплатно?",
      a: "Да! Базовый тариф Starter навсегда бесплатен. Вы получаете доступ к Канбан-доске откликов, до 15 активных вакансий в пайплайне, а также стартовому пакету сканирований резюме и генераций сопроводительных писем. Этого достаточно, чтобы оценить всю силу сервиса.",
    },
    {
      q: "Подходит ли сервис для международного поиска работы (FAANG, удаленка, релокация)?",
      a: "Да, наш AI-сканер и модуль сопроводительных писем одинаково эффективно работают как с вакансиями на русском языке (hh.ru, Хабр Карьера, Т-Банк, Яндекс), так и на английском языке (LinkedIn, RemoteOK, Wellfound, Crunchbase) с учётом стандартов международного резюме формата US/EU.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-xl shadow-lg shadow-primary/25">
              🎯
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
                LaunchPad
              </span>
              <span className="text-[10px] uppercase font-semibold text-primary ml-1.5 px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                AI Pro
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Возможности
            </a>
            <a href="#pain-points" className="hover:text-foreground transition-colors">
              Проблема
            </a>
            <a href="#workflow" className="hover:text-foreground transition-colors">
              Как это работает
            </a>
            <a href="#reviews" className="hover:text-foreground transition-colors">
              Отзывы
            </a>
            <a href="#pricing" className="hover:text-foreground transition-colors">
              Тарифы
            </a>
            <a href="#faq" className="hover:text-foreground transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Войти
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 font-medium">
                Открыть демо
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs font-semibold text-primary mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Платформа поиска работы 2026 с поддержкой нейросетей</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Ваш персональный командный центр{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-primary bg-clip-text text-transparent">
              поиска работы с ИИ
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Хватит терять вакансии в черных дырах фильтров ATS и путаться в хаосе таблиц.
            Анализируйте резюме с помощью ИИ, ведите прозрачную воронку откликов, создавайте точечные
            сопроводительные письма и не упускайте важные фоллоу-апы.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-12 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/25 font-semibold">
                Запустить командный центр
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/scanner">
              <Button size="lg" variant="outline" className="h-12 px-6 text-base border-border bg-card/50 hover:bg-card">
                <ScanSearch className="w-4 h-4 mr-2 text-primary" />
                Проверить резюме в ATS
              </Button>
            </Link>
          </div>

          {/* Social proof / stats */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Без привязки банковской карты</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Бесплатный базовый тариф навсегда</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Официальная оплата через ЮKassa (МИР / СБП)</span>
            </div>
          </div>

          {/* Mockup Dashboard Preview */}
          <div className="mt-14 relative mx-auto max-w-5xl rounded-2xl border border-border/80 bg-card/60 p-3 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 px-3 border-b border-border/50 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 font-mono text-[11px] text-muted-foreground/80">launchpad.app/tracker</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] bg-primary/10 border-primary/30 text-primary">
                  Интерактивное рабочее пространство
                </Badge>
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
              {/* Column 1 */}
              <div className="bg-background/60 rounded-xl p-3 border border-border/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold flex items-center gap-1.5">
                    <span>📌</span> Избранное
                  </span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">2</Badge>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-card border border-border/80 text-xs shadow-sm">
                    <p className="font-semibold text-foreground">Т-Банк</p>
                    <p className="text-muted-foreground text-[11px]">Senior Product Designer</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="text-emerald-400 font-mono">280 000 — 350 000 ₽</span>
                      <span>2 дня назад</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-card border border-border/80 text-xs shadow-sm">
                    <p className="font-semibold text-foreground">Авито</p>
                    <p className="text-muted-foreground text-[11px]">Lead Backend Go Developer</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="text-emerald-400 font-mono">380 000+ ₽</span>
                      <span>Целевая роль</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="bg-background/60 rounded-xl p-3 border border-border/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold flex items-center gap-1.5">
                    <span>📨</span> Отправлено
                  </span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">3</Badge>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-card border border-blue-500/40 text-xs shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-blue-500" />
                    <p className="font-semibold text-foreground">Ozon</p>
                    <p className="text-muted-foreground text-[11px]">Senior Frontend Engineer (React)</p>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="text-blue-400 font-medium">Фоллоу-ап: Сегодня</span>
                      <span className="text-muted-foreground">Отправлено 7 дн. назад</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 3 */}
              <div className="bg-background/60 rounded-xl p-3 border border-border/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold flex items-center gap-1.5">
                    <span>📞</span> Интервью
                  </span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">1</Badge>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-card border border-yellow-500/40 text-xs shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-yellow-500" />
                    <p className="font-semibold text-foreground">Яндекс</p>
                    <p className="text-muted-foreground text-[11px]">Senior Product Manager</p>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="text-amber-400 font-medium">Технический этап завтра</span>
                      <span className="text-muted-foreground font-mono">94% ATS</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 4 */}
              <div className="bg-background/60 rounded-xl p-3 border border-border/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold flex items-center gap-1.5">
                    <span>🎉</span> Офферы
                  </span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-emerald-500/20 text-emerald-400">1</Badge>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-card border border-emerald-500/40 text-xs shadow-sm relative overflow-hidden bg-emerald-500/5">
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-emerald-500" />
                    <p className="font-semibold text-foreground">VK</p>
                    <p className="text-muted-foreground text-[11px]">Principal ML Engineer</p>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="text-emerald-400 font-bold">420 000 ₽ + Опционы</span>
                      <span className="text-muted-foreground">До 3 ноября</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section id="pain-points" className="py-20 border-t border-border/60 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold text-red-400 tracking-wider mb-2">
              Суровая реальность рынка труда
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Почему отправка резюме вслепую превращается в крик в пустоту?
            </h3>
            <p className="mt-4 text-muted-foreground text-sm sm:text-base">
              Современный процесс найма автоматизирован алгоритмами. Соискатели с сильным опытом
              отсеиваются роботами еще до того, как их резюме откроет человек.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card/70 border-border/80 hover:border-red-500/40 transition-colors">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-lg mb-4">
                  75%
                </div>
                <h4 className="font-semibold text-base mb-2">Автоматический отсев ATS</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  3 из 4 резюме отклоняются роботами на этапе первичного скрининга из-за несовпадения ключевых слов или ошибок верстки.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/70 border-border/80 hover:border-amber-500/40 transition-colors">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg mb-4">
                  150+
                </div>
                <h4 className="font-semibold text-base mb-2">Потерянных откликов</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Таблицы Excel и заметки быстро превращаются в хаос. Кандидаты забывают, кому писали, кто HR и какую версию резюме отправляли.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/70 border-border/80 hover:border-yellow-500/40 transition-colors">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 text-yellow-400 flex items-center justify-center font-bold text-lg mb-4">
                  45 мин
                </div>
                <h4 className="font-semibold text-base mb-2">На каждое письмо</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Ручное написание качественных сопроводительных писем отнимает часы, приводя к выгоранию и шаблонным ошибкам «копировать-вставить».
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/70 border-border/80 hover:border-primary/40 transition-colors">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-lg mb-4">
                  85%
                </div>
                <h4 className="font-semibold text-base mb-2">Игнорирование и молчание</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Кандидаты не отправляют повторные напоминания. При этом вежливый и своевременный фоллоу-ап увеличивает конверсию в ответ на 30+%.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-24 border-t border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-3 text-primary border-primary/30 bg-primary/10">
              Полный набор инструментов
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Всё необходимое, чтобы превратить отклики в офферы
            </h2>
            <p className="mt-4 text-muted-foreground text-sm sm:text-base">
              LaunchPad заменяет 5 разрозненных сервисов и хаос в заметках единым удобным центром управления карьерой.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card/60 border border-border/80 rounded-2xl p-6 hover:border-primary/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5">
                  <ScanSearch className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">AI ATS-сканер резюме</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Загрузите PDF или вставьте текст резюме и вакансии. Нейросеть оценит плотность ключевых навыков,
                  риски форматирования и покажет точный процент соответствия алгоритмам отбора.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-medium text-blue-400">
                <span>Целевой скор 90%+</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-card/60 border border-border/80 rounded-2xl p-6 hover:border-primary/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5">
                  <Kanban className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Канбан-пайплайн откликов</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Высокоскоростная визуальная доска, созданная специально для соискателей. Отслеживайте стадии
                  от сохранения до оффера, фиксируйте зарплатные вилки и контакты нанимающих менеджеров.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-medium text-emerald-400">
                <span>Никакого хаоса в таблицах</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-card/60 border border-border/80 rounded-2xl p-6 hover:border-primary/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5">
                  <PenTool className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Студия сопроводительных писем</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Генерируйте живые, убедительные и персонализированные письма за считанные секунды на базе вашего
                  реального бэкграунда и ключевых требований целевой компании.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-medium text-purple-400">
                <span>Разные тональности и экспорт</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-card/60 border border-border/80 rounded-2xl p-6 hover:border-primary/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5">
                  <BellRing className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Умный контроль фоллоу-апов</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Не позволяйте отклику раствориться в молчании. Получайте расчетные напоминания на 7-й, 14-й и 21-й день
                  с уже составленными вежливыми письмами для отправки рекрутеру.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-medium text-amber-400">
                <span>+30% к конверсии в ответ</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-card/60 border border-border/80 rounded-2xl p-6 hover:border-primary/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-5">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Аналитика воронки найма</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Узнайте, где отсеиваются отклики. Сравнивайте эффективность каналов поиска (hh.ru, Хабр, рефералы),
                  среднее время ответа и конверсию каждого этапа воронки.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-medium text-rose-400">
                <span>Поиск работы на основе данных</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-card/60 border border-border/80 rounded-2xl p-6 hover:border-primary/50 transition-all flex flex-col justify-between bg-gradient-to-br from-primary/10 to-card">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-5">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">Мгновенное добавление вакансий</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Быстро фиксируйте позиции с любых job-сайтов и Telegram-каналов в 1 клик с автоматическим выделением
                  стека технологий, локации и зарплатной вилки.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-medium text-primary">
                <span>Экономия до 10 часов в неделю</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-20 border-t border-border/60 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold text-primary tracking-wider mb-2">
              Простой процесс из 3 шагов
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
              От первого отклика до заветного оффера в рекордные сроки
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-card/70 border border-border p-6 rounded-2xl">
              <div className="text-3xl font-black text-primary/40 mb-3">01</div>
              <h4 className="text-lg font-semibold mb-2">Сохраните и проверьте</h4>
              <p className="text-sm text-muted-foreground">
                Вставьте описание вакансии и запустите проверку в ATS-сканере, чтобы устранить пробелы в ключевых навыках до отправки.
              </p>
            </div>
            <div className="bg-card/70 border border-border p-6 rounded-2xl">
              <div className="text-3xl font-black text-primary/40 mb-3">02</div>
              <h4 className="text-lg font-semibold mb-2">Адаптируйте и откликнитесь</h4>
              <p className="text-sm text-muted-foreground">
                Сгенерируйте точечное сопроводительное письмо и усильте формулировки опыта под ожидания нанимающего менеджера.
              </p>
            </div>
            <div className="bg-card/70 border border-border p-6 rounded-2xl">
              <div className="text-3xl font-black text-primary/40 mb-3">03</div>
              <h4 className="text-lg font-semibold mb-2">Контролируйте воронку</h4>
              <p className="text-sm text-muted-foreground">
                Передвигайте карточки по этапам Канбана, отправляйте напоминания вовремя и уверенно проходите интервью.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews / Testimonials Section */}
      <section id="reviews" className="py-24 border-t border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-3 text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
              Истории успеха
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Специалисты, получившие офферы мечты
            </h2>
            <p className="mt-4 text-muted-foreground text-sm sm:text-base">
              Посмотрите, как соискатели увеличили конверсию откликов и вышли на новый уровень дохода.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic mb-6">
                  «Благодаря ATS-сканеру понял, почему мои отклики игнорировали крупные компании: в моем PDF не считывались
                  библиотеки и архитектурные термины. Исправил формулировки — и получил 4 приглашения на интервью за первую же неделю!»
                </p>
              </div>
              <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Михаил Воронов</h4>
                  <p className="text-xs text-muted-foreground">Lead Backend Developer, Т-Банк</p>
                </div>
                <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  3 оффера за 18 дней
                </Badge>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic mb-6">
                  «Студия сопроводительных писем сэкономила мне десятки часов. Письма получаются персонализированными и без
                  шаблонной водянистости. А напоминания помогли реанимировать отклик, который в итоге стал моим оффером.»
                </p>
              </div>
              <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Елена Смирнова</h4>
                  <p className="text-xs text-muted-foreground">Senior Product Manager, Ozon</p>
                </div>
                <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Конверсия +45%
                </Badge>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic mb-6">
                  «Канбан-трекер невероятно удобен. Раньше вел Excel-таблицу на 60 строк и постоянно забывал, кто мне ответил,
                  а кто нет. В LaunchPad вся воронка как на ладони, прямо как привычная рабочая Jira.»
                </p>
              </div>
              <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Артём Кузнецов</h4>
                  <p className="text-xs text-muted-foreground">Senior QA Automation, Яндекс</p>
                </div>
                <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Зарплата +35%
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 border-t border-border/60 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-3 text-primary border-primary/30 bg-primary/10">
              Честные и прозрачные тарифы
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Инвестируйте в карьеру, а не в переплаты
            </h2>
            <p className="mt-4 text-muted-foreground text-sm">
              Официальная оплата через ЮKassa любыми российскими банковскими картами (МИР, Visa, Mastercard, СБП).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1">Базовый старт</h3>
                <p className="text-xs text-muted-foreground mb-4">Для спокойного поиска и первого знакомства</p>
                <div className="text-3xl font-bold mb-6">0 ₽ <span className="text-xs font-normal text-muted-foreground">/ навсегда</span></div>
                <ul className="space-y-3 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> До 15 активных откликов
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 5 AI ATS-сканирований в месяц
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 3 AI сопроводительных письма в месяц
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Канбан-доска пайплайна
                  </li>
                </ul>
              </div>
              <Link href="/dashboard" className="mt-8">
                <Button variant="outline" className="w-full">Начать бесплатно</Button>
              </Link>
            </div>

            {/* Pro Tier (Popular) */}
            <div className="bg-card border-2 border-primary rounded-2xl p-6 flex flex-col justify-between relative shadow-xl shadow-primary/10 bg-primary/[0.02]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full uppercase tracking-wider">
                Хит продаж
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Job Hunter Pro</h3>
                <p className="text-xs text-muted-foreground mb-4">Максимальная мощность для быстрого оффера</p>
                <div className="text-3xl font-bold mb-6">1 490 ₽ <span className="text-xs font-normal text-muted-foreground">/ месяц</span></div>
                <ul className="space-y-3 text-xs text-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Безлимитный трекинг откликов
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Безлимитные AI ATS-проверки резюме
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Безлимитные сопроводительные письма
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Умные напоминания и фоллоу-апы
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Полная аналитика воронки конверсии
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Экспорт документов в PDF и Word
                  </li>
                </ul>
              </div>
              <Button
                onClick={() => handleOpenUpgrade("pro_monthly")}
                className="mt-8 w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md shadow-primary/20"
              >
                Оформить подписку
              </Button>
            </div>

            {/* Pro Quarterly / Coach */}
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
                  Экономия 25%
                </div>
                <h3 className="text-lg font-bold mb-1">Карьерный рывок (3 мес)</h3>
                <p className="text-xs text-muted-foreground mb-4">Полный цикл до получения и выбора оффера</p>
                <div className="text-3xl font-bold mb-6">3 490 ₽ <span className="text-xs font-normal text-muted-foreground">/ 3 месяца</span></div>
                <ul className="space-y-3 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Все возможности тарифа Pro на 3 месяца
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Шаблоны для зарубежных вакансий
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Персональная воронка целей
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Приоритетный доступ к новым моделям ИИ
                  </li>
                </ul>
              </div>
              <Button
                variant="outline"
                onClick={() => handleOpenUpgrade("pro_quarterly")}
                className="mt-8 w-full border-border hover:bg-card"
              >
                Выбрать 3 месяца
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 border-t border-border/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-3 text-primary border-primary/30 bg-primary/10">
              Вопросы и ответы
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Часто задаваемые вопросы
            </h2>
            <p className="mt-4 text-muted-foreground text-sm">
              Всё, что вам нужно знать о работе сервиса и возможностях платформы.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-border/80 bg-card/60 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base hover:text-primary transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4 bg-background/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 border-t border-border/60 bg-gradient-to-b from-card to-background text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Перестаньте ждать у моря погоды. Получите оффер мечты.
          </h2>
          <p className="mt-4 text-muted-foreground text-base max-w-xl mx-auto">
            Опробуйте все возможности сервиса прямо сейчас в интерактивном рабочем кабинете с готовыми демонстрационными данными.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="h-12 px-9 text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/25 font-bold">
                Открыть командный центр
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-10 bg-background text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <span>🎯</span>
            <span>LaunchPad © 2026. Все права защищены. Интеллектуальный помощник для поиска работы.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Обзор</Link>
            <Link href="/tracker" className="hover:text-foreground transition-colors">Канбан-трекер</Link>
            <Link href="/scanner" className="hover:text-foreground transition-colors">ATS-сканер</Link>
            <Link href="/cover-letter" className="hover:text-foreground transition-colors">Генератор писем</Link>
            <Link href="/follow-ups" className="hover:text-foreground transition-colors">Фоллоу-апы</Link>
            <Link href="/analytics" className="hover:text-foreground transition-colors">Аналитика</Link>
          </div>
        </div>
      </footer>

      {/* Upgrade Modal for YooKassa checkout */}
      <UpgradeModal
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        defaultPlan={targetPlan}
      />
    </div>
  );
}
