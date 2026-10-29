"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Briefcase,
  Star,
  DollarSign,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SEO_RESUME_EXAMPLES, ResumeCategory } from "@/data/seo-resume-examples";
import { useApp } from "@/context/AppContext";

export default function ExamplesCatalogPage() {
  const { lang, setLang } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ResumeCategory>("all");

  const categories: { id: ResumeCategory; labelRu: string; labelEn: string; icon: string }[] = [
    { id: "all", labelRu: "Все сферы", labelEn: "All Fields", icon: "✨" },
    { id: "sales", labelRu: "Продажи и Коммерция", labelEn: "Sales & Commercial", icon: "📈" },
    { id: "marketing", labelRu: "Маркетинг и PR", labelEn: "Marketing & PR", icon: "🎯" },
    { id: "finance_legal", labelRu: "Финансы, Бухгалтерия и Юристы", labelEn: "Finance, Accounting & Legal", icon: "💼" },
    { id: "management_hr_logistics", labelRu: "Управление, HR и Логистика", labelEn: "Management, HR & Logistics", icon: "🚛" },
    { id: "it", labelRu: "IT и Разработка", labelEn: "IT & Software Engineering", icon: "💻" },
  ];

  const filtered = SEO_RESUME_EXAMPLES.filter((ex) => {
    const matchesCategory = selectedCategory === "all" || ex.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const title = lang === "ru" ? ex.roleRu.toLowerCase() : ex.roleEn.toLowerCase();
    const skills = ex.targetSkills.join(" ").toLowerCase();
    const matchesSearch = !q || title.includes(q) || skills.includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-primary/25 shrink-0 border border-white/10 group-hover:border-primary/40 transition">
                <Image
                  src="/logo.png"
                  alt="LaunchPad AI PRO"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <span className="font-bold text-lg tracking-tight">LaunchPad</span>
            </Link>
            <span className="text-xs text-muted-foreground hidden sm:inline-block">/</span>
            <span className="text-xs font-semibold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
              {lang === "ru" ? "Библиотека резюме 94% ATS" : "94% ATS Resume Library"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === "ru" ? "en" : "ru")}
              className="px-2.5 py-1 text-xs font-medium rounded-lg border border-border bg-card hover:bg-muted transition text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {lang === "ru" ? "🇷🇺 RU" : "🇬🇧 EN"}
            </button>

            <Link href="/scanner">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-md cursor-pointer">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                {lang === "ru" ? "Сканировать своё резюме" : "Scan My Resume"}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 border-b border-border/60 relative overflow-hidden bg-card/20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] bg-primary/15 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>
              {lang === "ru"
                ? "Проверено на Workday, Taleo, Greenhouse, E-Staff и Поток"
                : "Tested across Workday, Taleo, Greenhouse, and Enterprise ATS"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {lang === "ru" ? (
              <>
                Библиотека эталонных резюме с рейтингом{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
                  94%+ в ATS
                </span>
              </>
            ) : (
              <>
                Benchmark IT Resume Library with{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
                  94%+ ATS Match
                </span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {lang === "ru"
              ? "Детальные кейсы «До и После» для всех ключевых профессий: Бухгалтерия, Продажи, Маркетинг, Юристы, Логистика, HR и IT. Узнайте, как формула 55/15/15/15 и X-Y-Z поднимают рейтинг до 95%+."
              : "In-depth Before & After case studies across all major industries: Accounting, Sales, Marketing, Legal, Logistics, HR, and IT. See how the 55/15/15/15 formula and XYZ lifts ATS match to 95%+."}
          </p>

          {/* Search Box */}
          <div className="max-w-md mx-auto relative pt-2">
            <Search className="w-4 h-4 absolute left-3.5 top-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "ru" ? "Поиск по должности или навыку (Бухгалтер, 1С, B2B, AmoCRM, SEO)..." : "Search by role or skill (Accountant, 1C, Sales, CRM, SEO)..."}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-inner"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/25"
                      : "bg-card/70 border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{lang === "ru" ? cat.labelRu : cat.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filtered.map((item) => {
            const role = lang === "ru" ? item.roleRu : item.roleEn;
            const salary = lang === "ru" ? item.salaryRangeRu : item.salaryRangeEn;
            const metaDesc = lang === "ru" ? item.metaDescriptionRu : item.metaDescriptionEn;

            return (
              <Card
                key={item.slug}
                className="bg-card/70 border border-border/80 hover:border-primary/50 transition-all duration-300 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 flex flex-col justify-between"
              >
                <CardContent className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Top tags */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge variant="outline" className="text-xs bg-muted/60 border-border text-foreground">
                        {item.level}
                      </Badge>
                      <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                        {item.demandBadge}
                      </span>
                    </div>

                    {/* Role Title */}
                    <Link href={`/examples/${item.slug}`}>
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight hover:text-primary transition-colors cursor-pointer">
                        {role}
                      </h2>
                    </Link>

                    {/* Salary & Metrics */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono bg-muted/30 px-3 py-1.5 rounded-lg border border-border/50">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{salary}</span>
                    </div>

                    {/* Before vs After Score Pill */}
                    <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-background/50 border border-border/60">
                      <div className="space-y-1">
                        <div className="text-[11px] text-rose-400 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{lang === "ru" ? "До аудита:" : "Before audit:"}</span>
                        </div>
                        <div className="text-xl font-black text-rose-400 font-mono">
                          {item.beforeScore}%
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {lang === "ru" ? "75% отсев роботами ATS" : "75% ATS drop rate"}
                        </div>
                      </div>

                      <div className="space-y-1 border-l border-border/60 pl-3">
                        <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{lang === "ru" ? "После стандарта:" : "After Harvard ATS:"}</span>
                        </div>
                        <div className="text-xl font-black text-emerald-400 font-mono">
                          {item.afterScore}%
                        </div>
                        <div className="text-[10px] text-emerald-400/80 font-medium">
                          {lang === "ru" ? "Топ-3% в пуле кандидатов" : "Top 3% candidate pool"}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {metaDesc}
                    </p>

                    {/* Top verified skills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.targetSkills.slice(0, 6).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded text-[11px] font-mono bg-primary/10 text-primary border border-primary/20"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-4">
                    <Link
                      href={`/examples/${item.slug}`}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{lang === "ru" ? "Смотреть полный разбор" : "View Full Case Study"}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    <Button
                      size="sm"
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          localStorage.setItem("launchpad_scanner_resume", item.afterResumeTextRu);
                          localStorage.setItem("launchpad_scanner_job", item.sampleJobSnippetRu);
                          window.location.href = "/scanner";
                        }
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1" />
                      {lang === "ru" ? "В сканер" : "Use in ATS"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      {/* Footer CTA */}
      <section className="border-t border-border/60 py-16 bg-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10">
            {lang === "ru" ? "Формула 55/15/15/15" : "55/15/15/15 Standard"}
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {lang === "ru"
              ? "Хотите такой же рейтинг 94%+ для своего резюме?"
              : "Ready to achieve a 94%+ match for your personal resume?"}
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            {lang === "ru"
              ? "Загрузите свой текст или PDF в сканер прямо сейчас и получите автоматический построчный разбор с формулой XYZ."
              : "Upload your resume into our scanner now to receive real-time XYZ bullet recommendations and verified skill quotes."}
          </p>
          <Link href="/scanner">
            <Button size="lg" className="bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/25 cursor-pointer">
              <Sparkles className="w-4 h-4 mr-2" />
              {lang === "ru" ? "Запустить бесплатный ATS-аудит" : "Start Free ATS Audit"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-8 bg-background text-xs text-muted-foreground text-center">
        <p>© 2026 LaunchPad AI PRO. Все права защищены. Эталонные стандарты резюме для международных и РФ компаний.</p>
      </footer>
    </div>
  );
}
