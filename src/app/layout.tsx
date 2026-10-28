import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
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
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://launchpad-app-ashy.vercel.app"),
  title: "LaunchPad AI PRO — Job Aggregator, ATS Resume Scanner & Cover Letter Generator",
  description:
    "LaunchPad AI PRO — Job Aggregator, ATS Resume Scanner & Cover Letter Generator. Проходите фильтры роботов ATS, получайте на 300% больше приглашений на интервью, генерируйте сопроводительные письма и управляйте откликами в едином командном центре.",
  keywords: [
    "LaunchPad AI PRO",
    "поиск работы",
    "ATS сканер",
    "Job Aggregator",
    "резюме онлайн",
    "сопроводительное письмо AI",
    "канбан трекер вакансий",
    "проверка резюме",
  ],
  authors: [{ name: "LaunchPad AI PRO" }],
  openGraph: {
    title: "LaunchPad AI PRO — Job Aggregator, ATS Resume Scanner & Cover Letter Generator",
    description:
      "Узнайте, почему роботы ATS отклоняют 75% резюме. Проверьте своё резюме онлайн бесплатно и получайте в 3 раза больше интервью!",
    url: "https://launchpad-app-ashy.vercel.app",
    siteName: "LaunchPad AI PRO",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "/price-list.png",
        width: 1200,
        height: 630,
        alt: "LaunchPad AI PRO Job Aggregator & ATS Resume Scanner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LaunchPad AI PRO — Job Aggregator, ATS Resume Scanner & Cover Letter Generator",
    description:
      "Проверьте резюме через AI ATS-сканер бесплатно и перестаньте терять вакансии в черных дырах алгоритмов.",
    images: ["/price-list.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
