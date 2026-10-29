"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import UpgradeProModal from "@/components/UpgradeProModal";
import HiringFunnelCalculator from "@/components/HiringFunnelCalculator";
import ProductHuntBanner from "@/components/ProductHuntBanner";
import { useApp } from "@/context/AppContext";
import {
  isUserPro,
  getRemainingFreeScans,
  verifyAndActivateProKey,
} from "@/lib/monetization";

export default function LandingPage() {
  const router = useRouter();
  const {
    authSession,
    openAuthModal,
    logout,
    userProfile,
  } = useApp();

  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isPro, setIsPro] = useState(false);
  const [remainingScans, setRemainingScans] = useState(2);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const proKey = params.get("pro_key");
    if (proKey && verifyAndActivateProKey(proKey)) {
      setIsPro(true);
      setRemainingScans(Infinity);
      showToast("🎉 Тариф LaunchPad AI PRO успешно активирован!");
      const url = new URL(window.location.href);
      url.searchParams.delete("pro_key");
      window.history.replaceState({}, "", url.pathname + (url.search ? url.search : ""));
    } else {
      setIsPro(isUserPro());
      setRemainingScans(getRemainingFreeScans());
    }
  }, []);

  const handleOpenUpgrade = () => {
    setUpgradeOpen(true);
  };

  const faqs = [
    {
      q: "Что такое ATS и почему 75% резюме отсеиваются роботами?",
      a: "ATS (Applicant Tracking System) — это автоматизированное ПО (Workday, Taleo, Greenhouse, E-Staff, Поток и др.), которое парсит и фильтрует резюме соискателей до того, как их увидит человек. Если в тексте резюме не хватает точных ключевых слов из описания вакансии или используется несовместимое форматирование (таблицы, графика, многоколоночные блоки), кандидат автоматически получает низкий рейтинг соответствия и отсеивается.",
    },
    {
      q: "Как работает оплата тарифа PRO?",
      a: "Мы подключены к официальному сертифицированному платежному шлюзу Tribute (Web + Telegram). Вы можете безопасно оплатить подписку любой банковской картой (МИР, Visa, Mastercard) в браузере или через Telegram Stars / приложение. После оплаты вы получаете ключ активации для мгновенного доступа ко всем безлимитным возможностям.",
    },
    {
      q: "Безопасны ли мои персональные данные и файлы резюме?",
      a: "Абсолютно. Ваши резюме и данные об откликах принадлежат только вам. Мы не передаем персональные данные сторонним рекрутинговым агентствам и не продаем базу резюме. Анализ текста осуществляется в изолированном контексте нейросети без обучения на ваших конфиденциальных данных.",
    },
    {
      q: "Могу ли я полноценно использовать LaunchPad бесплатно?",
      a: "Да! Базовый тариф Starter навсегда бесплатен. Вы получаете доступ к Канбан-доске откликов, до 15 активных вакансий в пайплайне, а также 2 бесплатным ATS-сканированиям резюме и генерациям сопроводительных писем. Этого достаточно, чтобы оценить всю силу сервиса.",
    },
    {
      q: "Подходит ли сервис для международного поиска работы (FAANG, удаленка, релокация)?",
      a: "Да, наш AI-сканер и модуль сопроводительных писем одинаково эффективно работают как с вакансиями на русском языке (hh.ru, Хабр Карьера, Т-Банк, Яндекс), так и на английском языке (LinkedIn, RemoteOK, Wellfound, Crunchbase) с учётом стандартов международного резюме формата US/EU.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[9999] px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-semibold shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          {toastMessage}
        </div>
      )}

      {/* Product Hunt Launch Banner with START30 promo */}
      <ProductHuntBanner onOpenUpgrade={handleOpenUpgrade} onToast={showToast} />

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
            <Link href="/examples" className="text-primary hover:text-primary/80 font-semibold transition-colors flex items-center gap-1">
              <span>Примеры резюме (95%)</span>
            </Link>
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
            {isPro ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                ✨ PRO Активен
              </div>
            ) : (
              <button
                onClick={handleOpenUpgrade}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 hover:text-white hover:bg-indigo-500/20 text-xs font-semibold shadow-sm transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                💎 Upgrade to PRO (Бесплатно: {remainingScans}/2)
              </button>
            )}

            {authSession ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 font-medium text-xs sm:text-sm cursor-pointer">
                    Открыть кабинет ({userProfile.name.trim().split(/\s+/)[0]})
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
                <button
                  onClick={logout}
                  title="Выйти из аккаунта (Logout)"
                  className="text-muted-foreground hover:text-rose-400 p-2 rounded-lg hover:bg-muted/70 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => openAuthModal("login")}
                  className="text-xs text-muted-foreground hover:text-foreground cursor-pointer font-semibold"
                >
                  Войти
                </Button>
                <Button
                  onClick={() => openAuthModal("register")}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 font-medium text-xs sm:text-sm cursor-pointer"
                >
                  Запустить командный центр
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            )}
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

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Проходите фильтры роботов ATS и получайте{" "}
            <span className="bg-gradient-to-r from-primary via-indigo-400 to-sky-400 bg-clip-text text-transparent">
              в 3 раза больше
            </span>{" "}
            приглашений на интервью
          </h1>

          <p className="mt-6 text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Автоматический аудит резюме алгоритмами ATS, генерация персонализированных сопроводительных писем без артефактов и Канбан-трекер откликов в едином командном центре.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => {
                if (authSession) {
                  router.push("/scanner");
                } else {
                  openAuthModal("register");
                }
              }}
              className="w-full sm:w-auto h-12 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/25 font-bold cursor-pointer"
            >
              Запустить ATS-аудит резюме
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base border-border/80 hover:bg-muted/50 cursor-pointer">
                Как это работает
              </Button>
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Бесплатные проверки на старте</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Оплата картами РФ и через Telegram</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Без «нейрозвёздочек» и шаблонной воды</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Hiring Funnel & Lost Salary Calculator */}
      <HiringFunnelCalculator />

      {/* Pain Points Section */}
      <section id="pain-points" className="py-20 border-t border-border/60 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Почему 75% резюме отклоняются роботами до того, как их увидит рекрутер?
            </h2>
            <p className="mt-4 text-muted-foreground text-sm sm:text-base">
              Современные компании используют системы автоматического скрининга (ATS), которые безжалостно отсеивают отличных кандидатов.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-lg">
                ✕
              </div>
              <h3 className="text-lg font-bold">Отсутствие точных ключевых слов</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Если в вашем резюме нет специфических терминов из описания вакансии, алгоритм ставит резюме оценку 40% и отправляет в архив.
              </p>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                ⚠️
              </div>
              <h3 className="text-lg font-bold">Несовместимое форматирование</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Таблицы, колонки, графические шкалы навыков и иконки «ломают» парсеры, превращая текст резюме в нечитаемую кашу.
              </p>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg">
                📉
              </div>
              <h3 className="text-lg font-bold">Размытые результаты без цифр</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Описания вроде «занимался разработкой» вместо оцифрованных результатов снижают шансы выделиться среди сотен других откликов.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 border-t border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-3 text-primary border-primary/30 bg-primary/10">
              Командный центр
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Всё необходимое для оффера мечты в одной экосистеме
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card/70 border border-border p-6 rounded-2xl space-y-3">
              <ScanSearch className="w-8 h-8 text-primary" />
              <h3 className="text-lg font-bold">AI ATS-сканер резюме</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Моментальный расчёт коэффициента совпадения с вакансией, выявление упущенных ключевых навыков и конкретные советы по усилению.
              </p>
            </div>

            <div className="bg-card/70 border border-border p-6 rounded-2xl space-y-3">
              <PenTool className="w-8 h-8 text-primary" />
              <h3 className="text-lg font-bold">Студия сопроводительных писем</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Генерация живых текстов под культуру компании без шаблонных заглушек и нейрозвёздочек, готовых к отправке в 1 клик.
              </p>
            </div>

            <div className="bg-card/70 border border-border p-6 rounded-2xl space-y-3">
              <Kanban className="w-8 h-8 text-primary" />
              <h3 className="text-lg font-bold">Канбан-трекер откликов</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Наглядное управление этапами (Избранное, Отправлено, Скрининг, Интервью, Оффер) и своевременные напоминания о повторных письмах.
              </p>
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
              Инвестируйте в карьеру с гарантией результата
            </h2>
            <p className="mt-4 text-muted-foreground text-sm">
              Официальная оплата через Tribute любыми российскими и зарубежными банковскими картами (МИР, Visa, Mastercard) или через Telegram.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Tier */}
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1">Базовый старт</h3>
                <p className="text-xs text-muted-foreground mb-4">Для спокойного поиска и первого знакомства</p>
                <div className="text-3xl font-bold mb-6">0 ₽ <span className="text-xs font-normal text-muted-foreground">/ навсегда</span></div>
                <ul className="space-y-3 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> До 15 активных откликов в пайплайне
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 2 бесплатные AI ATS-проверки резюме
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Генератор сопроводительных писем
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Канбан-доска вакансий
                  </li>
                </ul>
              </div>
              <Link href="/dashboard" className="mt-8">
                <Button variant="outline" className="w-full cursor-pointer">Перейти в кабинет</Button>
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-card border-2 border-indigo-500 rounded-2xl p-6 flex flex-col justify-between relative shadow-xl shadow-indigo-500/10 bg-indigo-500/[0.02]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                Полный доступ
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">LaunchPad AI PRO</h3>
                <p className="text-xs text-muted-foreground mb-4">Максимальная мощность для быстрого оффера</p>
                <div className="text-3xl font-bold mb-6">PRO <span className="text-xs font-normal text-muted-foreground">/ Безлимит</span></div>
                <ul className="space-y-3 text-xs text-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Безлимитный трекинг вакансий
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Безлимитные AI ATS-проверки резюме
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Безлимитные сопроводительные письма
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Точечное усиление строк резюме (XYZ)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Очистка от всех нейрозвёздочек и артефактов
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Оплата картой или Telegram Stars
                  </li>
                </ul>
              </div>
              <Button
                onClick={handleOpenUpgrade}
                className="mt-8 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/25 cursor-pointer"
              >
                {isPro ? "✨ PRO уже активен" : "💎 Активировать PRO"}
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
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base hover:text-primary transition-colors cursor-pointer"
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

      {/* Footer */}
      <footer className="border-t border-border/60 py-10 bg-background text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <span>🎯</span>
            <span>LaunchPad © 2026. Все права защищены. Интеллектуальный помощник для поиска работы.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/examples" className="text-primary hover:underline font-semibold">Примеры 95% ATS</Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Дашборд</Link>
            <Link href="/tracker" className="hover:text-foreground transition-colors">Канбан-трекер</Link>
            <Link href="/scanner" className="hover:text-foreground transition-colors">ATS-сканер</Link>
            <Link href="/cover-letter" className="hover:text-foreground transition-colors">Генератор писем</Link>
          </div>
        </div>
      </footer>

      {/* Upgrade Pro Modal (Tribute) */}
      <UpgradeProModal
        isOpen={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        onActivated={() => {
          setIsPro(true);
          setRemainingScans(Infinity);
          showToast("🎉 Тариф LaunchPad AI PRO успешно активирован!");
        }}
      />
    </div>
  );
}
