import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, FileText, AlertTriangle, Scale, CheckCircle2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Пользовательское соглашение и Отказ от ответственности — LaunchPad AI PRO",
  description: "Пользовательское соглашение сервиса LaunchPad AI PRO. Условия использования аналитических инструментов, AI-аудита и ограничение ответственности.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition group">
            <div className="w-8 h-8 rounded-xl overflow-hidden shadow-lg shadow-indigo-500/25 shrink-0 border border-white/10 group-hover:border-primary/50 transition">
              <Image
                src="/logo.png"
                alt="LaunchPad AI PRO"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold text-base tracking-tight text-foreground">
              LaunchPad <span className="text-primary text-xs uppercase font-mono">AI PRO</span>
            </span>
          </Link>

          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="text-xs cursor-pointer border-border">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              В личный кабинет
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10">
        <div className="space-y-3 border-b border-border/60 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-semibold text-indigo-400">
            <Scale className="w-3.5 h-3.5" />
            <span>Публичная оферта и правила использования</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Пользовательское соглашение и отказ от ответственности
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Редакция от 29 октября 2026 г. • Использование сервиса означает принятие условий настоящего соглашения.
          </p>
        </div>

        {/* Disclaimer Callout */}
        <div className="p-5 sm:p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-card space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm sm:text-base">
            <AlertTriangle className="w-5 h-5" />
            <span>Принцип «Как есть» (AS IS) и рекомендательный характер</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            LaunchPad AI PRO предоставляет информационно-аналитические инструменты для содействия в поиске работы. Скоринг ATS (по формуле 55/15/15/15), результаты аудита резюме и автоматически сгенерированные тексты носят <strong>исключительно рекомендательный характер</strong>. Администрация не гарантирует обязательное трудоустройство, приглашение на собеседование или получение оффера, поскольку итоговые решения всегда принимаются конкретными работодателями и их нанимающими менеджерами.
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            1. Предмет соглашения
          </h2>
          <p>
            1.1. Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между Администрацией сервиса LaunchPad AI PRO (далее — «Администрация») и любым физическим лицом, использующим возможности Сервиса (далее — «Пользователь»).
          </p>
          <p>
            1.2. Сервис представляет собой комплекс программных инструментов для подготовки резюме под стандарты Applicant Tracking Systems (ATS), автоматического расчета соответствия ключевым требованиям вакансий, формирования сопроводительных писем и ведения Канбан-воронки откликов.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            2. Условия использования и права на материалы
          </h2>
          <p>
            2.1. Пользователь сохраняет за собой все исключительные авторские права на свои оригинальные резюме, портфолио и сопроводительные материалы, загружаемые в Сервис.
          </p>
          <p>
            2.2. Тексты, созданные с участием генеративных AI-модулей Сервиса, передаются в распоряжение Пользователя для свободного некоммерческого и коммерческого использования при откликах на вакансии.
          </p>
          <p>
            2.3. Пользователь обязуется проверять достоверность сведений в сгенерированных резюме (даты работы, названия компаний, факты образования) перед отправкой реальным работодателям. Пользователь самостоятельно несет ответственность за предоставление недостоверной информации третьим лицам.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>3. Ограничение ответственности</span>
          </h2>
          <p>
            3.1. Администрация Сервиса прилагает все разумные усилия для обеспечения корректности работы ATS-сканера и генератора писем, однако не несет ответственности за:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-foreground/90">
            <li>Отказы работодателей в рассмотрении кандидатуры Пользователя;</li>
            <li>Изменения во внутренних алгоритмах внешних рекрутинговых систем (Workday, Taleo, HeadHunter, Greenhouse, E-Staff);</li>
            <li>Временные сбои в работе сторонних AI-провайдеров и каналов связи интернет-провайдеров;</li>
            <li>Утерю данных, вызванную принудительной ручной очисткой Пользователем кэша своего браузера без создания резервной копии (Export Backup).</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            4. Тарифы, промокоды и платные функции
          </h2>
          <p>
            4.1. Базовый функционал Сервиса (Канбан-трекер, базовые проверки резюме) предоставляется Пользователю бесплатно.
          </p>
          <p>
            4.2. Расширенный тариф LaunchPad AI PRO предоставляет безлимитный доступ к ATS-сканеру, автоматической перегенерации резюме по формуле Google X-Y-Z и генератору сопроводительных писем.
          </p>
          <p>
            4.3. Активация тарифа может производиться с использованием промокодов (включая акционный промокод <code>START30</code> на скидку 30%), лицензионных ключей либо встроенных платежных шлюзов.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            5. Заключительные положения
          </h2>
          <p>
            5.1. К настоящему Соглашению и отношениям между Пользователем и Администрацией применяется законодательство Российской Федерации.
          </p>
          <p>
            5.2. Если какое-либо условие настоящего Соглашения будет признано недействительным, это не влияет на юридическую силу остальных положений.
          </p>
          <p>
            5.3. Все вопросы и предложения по функционалу сервиса принимаются по адресу: <a href="mailto:support@launchpad.pro" className="text-primary hover:underline">support@launchpad.pro</a>.
          </p>
        </section>

        {/* Footer links */}
        <div className="pt-8 border-t border-border/60 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>© 2026 LaunchPad AI PRO. Все права защищены.</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground underline">
              Политика конфиденциальности (152-ФЗ)
            </Link>
            <Link href="/" className="hover:text-foreground">
              Главная
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
