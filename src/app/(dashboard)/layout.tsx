"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UpgradeModal } from "@/components/UpgradeModal";

const navItems = [
  { href: "/dashboard", label: "Обзор дашборда", icon: LayoutDashboard },
  { href: "/tracker", label: "Канбан-трекер", icon: Kanban, badge: "10" },
  { href: "/scanner", label: "ATS-сканер резюме", icon: ScanSearch, highlight: true },
  { href: "/cover-letter", label: "Генератор писем", icon: PenTool },
  { href: "/follow-ups", label: "Напоминания", icon: BellRing, badge: "3", badgeColor: "bg-amber-500/20 text-amber-400" },
  { href: "/analytics", label: "Аналитика воронки", icon: BarChart3 },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [addJobOpen, setAddJobOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  // Quick state for new job modal
  const [newCompany, setNewCompany] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newSalary, setNewSalary] = useState("");
  const [newStage, setNewStage] = useState("wishlist");

  const getPageTitle = () => {
    if (pathname.includes("/tracker")) return "Канбан-трекер вакансий";
    if (pathname.includes("/scanner")) return "AI ATS-сканер резюме";
    if (pathname.includes("/cover-letter")) return "Генератор сопроводительных писем";
    if (pathname.includes("/follow-ups")) return "Центр напоминаний (Follow-Up)";
    if (pathname.includes("/analytics")) return "Аналитика конверсий и воронки";
    return "Командный центр поиска работы";
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Отклик в ${newCompany} (${newRole}) успешно добавлен в пайплайн!`);
    setAddJobOpen(false);
    setNewCompany("");
    setNewRole("");
    setNewSalary("");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
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
          <div className="p-3 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/15 to-card space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-foreground">
              <span className="flex items-center gap-1.5 text-primary">
                <Sparkles className="w-3.5 h-3.5" /> Тариф Pro
              </span>
              <span className="text-[10px] text-muted-foreground">ЮKassa</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-tight">
              Безлимитный AI ATS-сканер и генерация сопроводительных писем.
            </p>
            <Button
              size="sm"
              onClick={() => setUpgradeOpen(true)}
              className="w-full h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            >
              Перейти на Pro
            </Button>
          </div>
        </div>

        {/* User footer */}
        <div className="p-3 border-t border-border/70 bg-card/40">
          <div className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-border/50">
            <div className="flex items-center gap-2.5">
              <Avatar className="w-8 h-8 rounded-full border border-primary/30">
                <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">
                  АМ
                </AvatarFallback>
              </Avatar>
              <div className="text-left overflow-hidden">
                <div className="text-xs font-semibold truncate text-foreground">Алексей Морозов</div>
                <div className="text-[10px] text-muted-foreground truncate">alex@launchpad.ru</div>
              </div>
            </div>
            <Link href="/" title="Выйти">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </Link>
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
              <SheetContent side="left" className="p-0 w-64 bg-card">
                <SheetHeader className="p-4 border-b border-border">
                  <SheetTitle className="flex items-center gap-2 text-left">
                    <span className="text-xl">🎯</span>
                    <span>LaunchPad</span>
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
              </SheetContent>
            </Sheet>

            <div>
              <h1 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUpgradeOpen(true)}
              className="text-xs font-semibold border-amber-500/40 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Pro (ЮKassa)
            </Button>

            <Link href="/scanner">
              <Button variant="outline" size="sm" className="hidden sm:flex text-xs font-medium border-border/80">
                <ScanSearch className="w-3.5 h-3.5 mr-1.5 text-primary" />
                Быстрый аудит
              </Button>
            </Link>

            {/* Quick Add Job Dialog */}
            <Dialog open={addJobOpen} onOpenChange={setAddJobOpen}>
              <DialogTrigger
                render={
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-sm shadow-primary/20">
                    <Plus className="w-4 h-4 mr-1" />
                    Добавить отклик
                  </Button>
                }
              />
              <DialogContent className="sm:max-w-md bg-card border-border">
                <form onSubmit={handleCreateJob}>
                  <DialogHeader>
                    <DialogTitle className="text-base font-bold flex items-center gap-2">
                      <span>💼</span> Новый отклик на вакансию
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-3 py-4 text-xs">
                    <div>
                      <Label htmlFor="company" className="text-xs">Компания *</Label>
                      <Input
                        id="company"
                        placeholder="Например: Яндекс, Т-Банк, Ozon, Сбер"
                        value={newCompany}
                        onChange={(e) => setNewCompany(e.target.value)}
                        required
                        className="mt-1 text-xs"
                      />
                    </div>

                    <div>
                      <Label htmlFor="role" className="text-xs">Должность / Роль *</Label>
                      <Input
                        id="role"
                        placeholder="Например: Senior Frontend Developer"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        required
                        className="mt-1 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="salary" className="text-xs">Желаемый доход</Label>
                        <Input
                          id="salary"
                          placeholder="250 000 — 350 000 ₽"
                          value={newSalary}
                          onChange={(e) => setNewSalary(e.target.value)}
                          className="mt-1 text-xs"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stage" className="text-xs">Начальный этап</Label>
                        <Select value={newStage} onValueChange={(val) => val && setNewStage(val)}>
                          <SelectTrigger className="mt-1 text-xs">
                            <SelectValue placeholder="Выберите этап" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="wishlist">📌 Избранное</SelectItem>
                            <SelectItem value="applied">📨 Отправлено</SelectItem>
                            <SelectItem value="screening">🔍 Скрининг</SelectItem>
                            <SelectItem value="interviewing">📞 Интервью</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes" className="text-xs">Заметки или контакты рекрутера</Label>
                      <Textarea
                        id="notes"
                        placeholder="Отклик через Хабр Карьеру, рекрутер Анна в Telegram..."
                        rows={2}
                        className="mt-1 text-xs"
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" size="sm" onClick={() => setAddJobOpen(false)} className="text-xs">
                      Отмена
                    </Button>
                    <Button type="submit" size="sm" className="bg-primary text-primary-foreground text-xs font-semibold">
                      Сохранить в пайплайн
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Promo Announcement Banner */}
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
                onClick={() => setUpgradeOpen(true)}
                className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shrink-0"
              >
                Активировать со скидкой
              </Button>
            </div>

            {children}
          </div>
        </main>
      </div>

      {/* Upgrade to Pro Modal (YooKassa) */}
      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </div>
  );
}
