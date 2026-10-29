import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, Lock, Database, Cpu, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Политика конфиденциальности и обработки данных (152-ФЗ) — LaunchPad AI PRO",
  description: "Политика конфиденциальности сервиса LaunchPad AI PRO в соответствии с Федеральным законом РФ № 152-ФЗ «О персональных данных». Архитектура Local-First и Zero Server Storage.",
};

export default function PrivacyPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Соответствие 152-ФЗ РФ «О персональных данных»</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Политика конфиденциальности и защиты данных
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Редакция от 29 октября 2026 г. • Действует бессрочно до замены новой редакцией.
          </p>
        </div>

        {/* Local-First Architecture Callout */}
        <div className="p-5 sm:p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card to-card space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm sm:text-base">
            <Lock className="w-5 h-5" />
            <span>Архитектура Local-First (Zero Server Storage)</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Сервис LaunchPad AI PRO спроектирован по принципу <strong>нулевого серверного хранения (Zero Server Storage)</strong>. Все вводимые вами персональные данные (ФИО, телефон, email), тексты резюме, вакансии и карточки Канбан-трекера <strong>хранятся исключительно локально в памяти вашего браузера (localStorage)</strong> на вашем устройстве на территории Российской Федерации. Серверная база данных не аккумулирует ваши файлы и профили.
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            1. Общие положения
          </h2>
          <p>
            1.1. Настоящая Политика конфиденциальности определяет порядок обработки и защиты информации о физических лицах (далее — «Пользователь»), пользующихся программным сервисом LaunchPad AI PRO (далее — «Сервис»).
          </p>
          <p>
            1.2. Цель настоящей Политики — обеспечение надлежащей защиты персональных данных Пользователя от несанкционированного доступа и разглашения в соответствии с требованиями Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных».
          </p>
          <p>
            1.3. Используя Сервис (загружая текст резюме, создавая отклики или генерируя сопроводительные письма), Пользователь выражает свое полное согласие с условиями настоящей Политики.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            2. Состав и характер обрабатываемых данных
          </h2>
          <p>
            В рамках работы Сервиса Пользователь может вносить следующие сведения:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-foreground/90">
            <li>Фамилия, имя, отчество (ФИО);</li>
            <li>Контактный адрес электронной почты (Email);</li>
            <li>Номер телефона и контакт в мессенджерах;</li>
            <li>Профессиональный профиль (целевая должность, город, опыт работы, навыки);</li>
            <li>Тексты резюме и описания вакансий, добавляемые для анализа соответствия ATS.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" />
            <span>3. Механизм обезличивания (PII Masking) и трансграничная передача</span>
          </h2>
          <p>
            3.1. Во исполнение требований статьи 12 Федерального закона № 152-ФЗ при обращении к модулям искусственного интеллекта (LLM) Сервис применяет <strong>обязательное предварительное обезличивание персональных данных (PII Anonymization)</strong> на сервере:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-foreground/90">
            <li>Реальные ФИО заменяются нейтральным системным токеном <code>[ФИО КАНДИДАТА]</code>;</li>
            <li>Номера телефонов маскируются токеном <code>[ТЕЛЕФОН]</code>;</li>
            <li>Адреса электронной почты заменяются на <code>[EMAIL]</code>.</li>
          </ul>
          <p>
            3.2. Во внешние API нейросетей отправляется исключительно деперсонализированный профессиональный контекст (стек технологий, стаж, метрики). Восстановление оригинальных контактных данных Пользователя в готовом резюме осуществляется в обратном порядке на стороне устройства Пользователя либо в момент финальной компиляции ответа.
          </p>
          <p>
            3.3. В серверных логах (консоли и диагностических журналах) категорически запрещена и технически заблокирована фиксация персональных данных соискателей.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            <span>4. Использование Cookies и локального хранилища (localStorage)</span>
          </h2>
          <p>
            4.1. Сервис использует локальные файлы cookie и объектное хранилище Web Storage (localStorage) для следующих целей:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-foreground/90">
            <li>Сохранение сессии авторизации соискателя;</li>
            <li>Хранение карточек вакансий в Канбан-пайплайне;</li>
            <li>Фиксация статуса промокода START30 и Pro-тарифа;</li>
            <li>Сохранение черновиков писем и текущего резюме для предотвращения потери данных при перезагрузке страницы.</li>
          </ul>
          <p>
            4.2. Пользователь может в любой момент очистить указанные данные через настройки своего браузера либо встроенной кнопкой в профиле Сервиса.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>5. Право на забвение: полное удаление данных</span>
          </h2>
          <p>
            5.1. Пользователь имеет безусловное право на полное удаление всех своих данных в любой момент времени.
          </p>
          <p>
            5.2. В окне «Профиль соискателя» (клик по аватару в панели управления) доступна кнопка <strong>«🗑 Удалить все мои данные»</strong>, нажатие которой в 1 клик производит безвозвратную очистку всех локальных ключей хранилища и сброс сессии.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            6. Изменение Политики и обратная связь
          </h2>
          <p>
            6.1. Администрация Сервиса оставляет за собой право вносить изменения в настоящую Политику в случае обновления законодательства РФ. Актуальная версия всегда доступна по адресу: <code>https://launchpad-app-ashy.vercel.app/privacy</code>.
          </p>
          <p>
            6.2. По всем вопросам, связанным с обработкой данных и исполнением 152-ФЗ, Пользователь может направить обращение по адресу: <a href="mailto:support@launchpad.pro" className="text-primary hover:underline">support@launchpad.pro</a>.
          </p>
        </section>

        {/* Footer links */}
        <div className="pt-8 border-t border-border/60 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>© 2026 LaunchPad AI PRO. Все права защищены.</span>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-foreground underline">
              Пользовательское соглашение (Terms)
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
