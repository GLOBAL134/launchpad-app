import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/next";
import { AppProvider } from "@/context/AppContext";
import UserProfileModal from "@/components/UserProfileModal";
import AddJobModal from "@/components/AddJobModal";
import AuthGateModal from "@/components/AuthGateModal";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#080B12",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://launchpad-app-ashy.vercel.app"),
  title: "LaunchPad — AI-система управления поиском работы и ATS-сканер",
  description:
    "Проходите фильтры роботов ATS, получайте на 300% больше приглашений на интервью, генерируйте сопроводительные письма и управляйте откликами в едином командном центре.",
  keywords: [
    "поиск работы",
    "ATS сканер",
    "резюме онлайн",
    "сопроводительное письмо AI",
    "канбан трекер вакансий",
    "Яндекс вакансии",
    "Т-Банк вакансии",
    "подготовка к интервью",
    "проверка резюме",
  ],
  authors: [{ name: "LaunchPad AI" }],
  openGraph: {
    title: "LaunchPad — AI-система поиска работы и прохождения фильтров ATS",
    description:
      "Узнайте, почему роботы ATS отклоняют 75% резюме. Проверьте своё резюме онлайн бесплатно и получайте в 3 раза больше интервью!",
    url: "https://launchpad-app-ashy.vercel.app",
    siteName: "LaunchPad AI",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "/price-list.png",
        width: 1200,
        height: 630,
        alt: "LaunchPad AI Job Search Command Center",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LaunchPad — AI Командный центр поиска работы",
    description:
      "Проверьте резюме через AI ATS-сканер бесплатно и перестаньте терять вакансии в черных дырах алгоритмов.",
    images: ["/price-list.png"],
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLdSoftware = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "LaunchPad AI PRO",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web, iOS, Android, macOS, Windows",
  "description": "Интеллектуальная система управления поиском работы: детерминированный ATS-сканер резюме 55/15/15/15, генератор сопроводительных писем без нейрозвёздочек и Канбан-трекер с центром напоминаний.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "RUB",
    "description": "Бесплатный стартовый тариф с 2 проверками и Канбан-трекером"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "1240"
  }
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Что такое ATS и почему 75% резюме отсеиваются роботами?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ATS (Applicant Tracking System) — это автоматизированное ПО (Workday, Taleo, Greenhouse, E-Staff, Поток и др.), которое парсит и фильтрует резюме соискателей до того, как их увидит человек. Если в тексте резюме не хватает точных ключевых слов из описания вакансии или используется несовместимое форматирование, кандидат автоматически получает низкий рейтинг соответствия и отсеивается."
      }
    },
    {
      "@type": "Question",
      "name": "Как работает формула оценки 55/15/15/15 в LaunchPad AI PRO?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Формула оценивает резюме по 4 объективным критериям: 55% точные цитируемые Hard Skills, 15% оцифрованные метрики по формуле Google XYZ, 15% Soft Skills и 15% одноколоночный формат Harvard ATS Layout."
      }
    },
    {
      "@type": "Question",
      "name": "Как активировать скидку 30% по промокоду START30?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "В окне активации PRO введите промокод START30 для получения мгновенной скидки 30% на безлимитный доступ к ATS-сканеру и всем инструментам."
      }
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AppProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <UserProfileModal />
          <AddJobModal />
          <AuthGateModal />
        </AppProvider>
        <Analytics />
      </body>
    </html>
  );
}
