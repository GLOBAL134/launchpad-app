"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Kanban,
  ScanSearch,
  PenTool,
  BellRing,
  BarChart3,
  Plus,
  Menu,
  Sparkles,
  ExternalLink,
  ChevronRight,
  LogOut,
  User,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import UpgradeProModal from "@/components/UpgradeProModal";
import AuthGateModal from "@/components/AuthGateModal";
import { useApp } from "@/context/AppContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const {
    authSession,
    isAuthLoaded,
    logout,
    openAuthModal,
    clearAllApplications,
    userProfile,
    setIsProfileModalOpen,
    applications,
    activeFollowUpsCount,
    isPro,
    remainingScans,
    isUpgradeModalOpen,
    setIsUpgradeModalOpen,
    setIsAddJobModalOpen,
    setTriggerQuickAudit,
    toastMessage,
    activateWithKey,
  } = useApp();

  const navItems = [
    { href: "/dashboard", label: "Обзор дашборда", icon: LayoutDashboard },
    { href: "/tracker", label: "Канбан-трекер", icon: Kanban, badge: String(applications.length) },
    { href: "/scanner", label: "ATS-сканер резюме", icon: ScanSearch, highlight: true },
    { href: "/cover-letter", label: "Генератор писем", icon: PenTool },
    {
      href: "/follow-ups",
      label: "Напоминания",
      icon: BellRing,
      badge: String(activeFollowUpsCount),
      badgeColor: activeFollowUpsCount > 0 ? "bg-amber-500/20 text-amber-400" : "bg-muted text-muted-foreground",
    },
    { href: "/analytics", label: "Аналитика воронки", icon: BarChart3 },
  ];

  const getPageTitle = () => {
    if (pathname.includes("/tracker")) return "Канбан-трекер вакансий";
    if (pathname.includes("/scanner")) return "AI ATS-сканер резюме";
    if (pathname.includes("/cover-letter")) return "Генератор сопроводительных писем";
    if (pathname.includes("/follow-ups")) return "Центр напоминаний (Follow-Up)";
    if (pathname.includes("/analytics")) return "Аналитика конверсий и воронки";
    return "Командный центр поиска работы";
  };

  const handleQuickAudit = () => {
    setTriggerQuickAudit(true);
    router.push("/scanner?quick_audit=true");
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    logout();
    router.push("/");
  };

  const initials =
    userProfile.name
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "LP";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Auth Gate for new unauthenticated visitors */}
      {isAuthLoaded && !authSession && (
        <AuthGateModal isOpen={true} canCloseWithoutAuth={false} />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[9999] px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-semibold shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          {toastMessage}
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/60 backdrop-blur-md">
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-border/70">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-base shadow-md shadow-primary/20">
              🎯
            </div>
            <span className="font-bold text-base tracking-tight text-foreground">LaunchPad</span>
          </Link>
          <Badge variant="outline" className="text-[10px] font-semibold text-primary border-primary/30 bg-primary/10">
            PRO AI
          </Badge>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70">
            Рабочая область
          </div>

          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/20 text-white"
                        : item.badgeColor || "bg-muted text-muted-foreground"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {item.highlight && !isActive && (
                  <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                )}
              </Link>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70">
            Переходы
          </div>
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4" />
              <span>Главная страница</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </Link>
        </nav>

        {/* Pro Banner Card */}
        <div className="px-3 pb-2">
          {isPro ? (
            <div className="p-3 rounded-xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/15 to-card space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" /> ✨ PRO Активен
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Безлимитный AI ATS-сканер, генерация писем и полный доступ к сервису.
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/15 to-card space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span className="flex items-center gap-1.5 text-indigo-400">
                  <Sparkles className="w-3.5 h-3.5" /> Тариф Pro
                </span>
                <span className="text-[10px] text-indigo-300/80 font-mono">Бесплатно: {remainingScans}/2</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Безлимитный AI ATS-сканер и генерация сопроводительных писем.
              </p>
              <Button
                size="sm"
                onClick={() => setIsUpgradeModalOpen(true)}
                className="w-full h-7 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer"
              >
                💎 Перейти на Pro
              </Button>
            </div>
          )}
        </div>

        {/* User footer (Интерактивный профиль соискателя + Кнопка выхода Logout) */}
        <div className="p-3 border-t border-border/70 bg-card/40">
          <div className="w-full flex items-center justify-between p-2 rounded-lg bg-background/50 hover:bg-muted/70 border border-border/50 transition">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2.5 overflow-hidden text-left flex-1 cursor-pointer"
              title="Нажмите, чтобы редактировать профиль"
            >
              <Avatar className="w-8 h-8 rounded-full border border-primary/30 shrink-0">
                <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold truncate text-foreground flex items-center gap-1.5">
                  <span>{userProfile.name}</span>
                  {authSession?.isDemo && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                      ДЕМО
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground truncate">{userProfile.email}</div>
              </div>
            </button>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              title="Выйти из аккаунта (Logout)"
              className="text-muted-foreground hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition cursor-pointer shrink-0 ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-card/40 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                }
              />
              <SheetContent side="left" className="p-0 w-64 bg-card flex flex-col justify-between">
                <div>
                  <SheetHeader className="p-4 border-b border-border">
                    <SheetTitle className="flex items-center gap-2 text-left">
                      <span className="text-xl">🎯</span>
                      <span>LaunchPad</span>
                      {authSession?.isDemo && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                          DEMO
                        </span>
                      )}
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="p-3 space-y-1">
                    {navItems.map((item) => {
                      const isActive = pathname === item.href;
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                            isActive
                              ? "bg-primary text-primary-foreground font-semibold"
                              : "text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                {/* Mobile User Profile & Logout */}
                <div className="p-3 border-t border-border">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-border/50">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Avatar className="w-7 h-7 rounded-full border border-primary/30 shrink-0">
                        <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="overflow-hidden">
                        <div className="text-xs font-semibold truncate text-foreground">{userProfile.name}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{userProfile.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      title="Выйти"
                      className="text-muted-foreground hover:text-rose-400 p-1.5"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div>
              <h1 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isPro ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                ✨ PRO Активен
              </div>
            ) : (
              <button
                onClick={() => setIsUpgradeModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 hover:text-white hover:bg-indigo-500/20 text-xs font-semibold shadow-sm transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                💎 Upgrade to PRO (Бесплатно: {remainingScans}/2)
              </button>
            )}

            {/* Быстрый аудит (переводит на /scanner и запускает свежий расчет) */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleQuickAudit}
              className="hidden sm:flex text-xs font-medium border-border/80 cursor-pointer"
            >
              <ScanSearch className="w-3.5 h-3.5 mr-1.5 text-primary" />
              Быстрый аудит
            </Button>

            {/* Quick Add Job Button */}
            <Button
              size="sm"
              onClick={() => setIsAddJobModalOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-sm shadow-primary/20 cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1" />
              Добавить отклик
            </Button>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Demo Mode Notice Banner */}
            {authSession?.isDemo && (
              <div className="p-3 px-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-sm text-amber-200 animate-in fade-in">
                <div className="flex items-center gap-2.5 text-center sm:text-left">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                  <span>
                    Вы просматриваете <strong>демонстрационный кабинет</strong> с примерами вакансий (Яндекс, Т-Банк, Авито).
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => clearAllApplications()}
                    className="h-7 text-xs border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:text-white cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Очистить демо / С чистого листа
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => openAuthModal("register")}
                    className="h-7 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold cursor-pointer shadow-sm shadow-primary/25"
                  >
                    ✨ Создать свой личный кабинет
                  </Button>
                </div>
              </div>
            )}

            {/* Promo Announcement Banner */}
            {!isPro && (
              <div className="p-3 px-4 rounded-xl bg-gradient-to-r from-primary/15 via-primary/10 to-card border border-primary/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-sm">
                <div className="flex items-center gap-2.5 text-center sm:text-left">
                  <span className="px-2 py-0.5 rounded bg-primary text-primary-foreground font-black text-[10px] tracking-wide uppercase shrink-0">
                    Акция
                  </span>
                  <span className="text-foreground">
                    Получите <strong>скидку 30%</strong> на полный доступ к ATS-сканеру и генератору писем по промокоду <code className="bg-background/80 px-1.5 py-0.5 rounded font-mono font-bold text-primary border border-primary/20">START30</code>
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="h-7 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shrink-0 cursor-pointer"
                >
                  Активировать со скидкой
                </Button>
              </div>
            )}

            {children}
          </div>
        </main>
      </div>

      {/* Upgrade to Pro Modal (Tribute) */}
      <UpgradeProModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onActivated={() => {
          activateWithKey("LP_PRO_2026");
        }}
      />
    </div>
  );
}