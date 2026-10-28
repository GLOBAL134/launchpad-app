"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ScanSearch,
  PenTool,
  BellRing,
  Sparkles,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Copy,
  Mail,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { stringToColor } from "@/lib/utils";
import { useApp, FollowUpItem } from "@/context/AppContext";

export default function DashboardOverviewPage() {
  const { userProfile, applications, followUps, markFollowUpSent, showToast } = useApp();

  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUpItem | null>(null);
  const [templateText, setTemplateText] = useState("");
  const [copied, setCopied] = useState(false);

  // Dynamic calculations from applications
  const totalApps = applications.length;
  const wishlistCount = applications.filter((a) => a.stage === "wishlist").length;
  const appliedCount = applications.filter((a) => a.stage === "applied").length;
  const screeningCount = applications.filter((a) => a.stage === "screening").length;
  const interviewCount = applications.filter((a) => a.stage === "interviewing").length;
  const offerCount = applications.filter((a) => a.stage === "offer").length;
  const rejectedCount = applications.filter((a) => a.stage === "rejected").length;

  const activeCount = applications.filter((a) => a.stage !== "rejected" && a.stage !== "ghosted").length;

  const responseRate = totalApps > 0
    ? Math.round(((screeningCount + interviewCount + offerCount) / Math.max(1, totalApps - wishlistCount)) * 100) || 40
    : 0;

  const offerApp = applications.find((a) => a.stage === "offer");
  const interviewApps = applications.filter((a) => a.stage === "interviewing").map((a) => a.company);

  const pendingFollowUps = followUps.filter((f) => !f.sent);

  const openFollowUpModal = (item: FollowUpItem) => {
    setSelectedFollowUp(item);
    const customized = `${item.template}\n\nС уважением,\n${userProfile.name}\n${userProfile.phone}`;
    setTemplateText(customized);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(templateText);
    setCopied(true);
    showToast("Скопировано в буфер обмена!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = () => {
    if (!selectedFollowUp) return;
    const mailto = `mailto:${selectedFollowUp.contactEmail || ""}?subject=${encodeURIComponent(
      selectedFollowUp.subject
    )}&body=${encodeURIComponent(templateText)}`;
    window.open(mailto, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-r from-primary/10 via-card to-card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Активный поиск • Неделя 4</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              С возвращением, {userProfile.name.split(" ")[0]}! 👋
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              У вас <span className="text-foreground font-semibold">{interviewCount} назначенных интервью</span> и{" "}
              <span className="text-amber-400 font-semibold">{pendingFollowUps.length} напоминания</span> требуют отправки письма рекрутерам.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link href="/scanner">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-md shadow-primary/20 cursor-pointer">
                <ScanSearch className="w-4 h-4 mr-1.5" />
                Проверить резюме
              </Button>
            </Link>
            <Link href="/cover-letter">
              <Button size="sm" variant="outline" className="text-xs font-semibold border-border cursor-pointer">
                <PenTool className="w-4 h-4 mr-1.5 text-primary" />
                Создать письмо
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <Card className="bg-card/70 border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              В активном пайплайне
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{activeCount}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-semibold">+{activeCount} откликов</span>
              <span>в {new Set(applications.map((a) => a.company)).size} компаниях</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="bg-card/70 border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Конверсия в ответ
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{responseRate}%</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-semibold">+18% выше</span>
              <span>среднего по IT (22%)</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="bg-card/70 border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Назначено интервью
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{interviewCount}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-amber-400 font-semibold">
                {interviewApps.length > 0 ? interviewApps.slice(0, 2).join(" и ") : "Ожидают этапа"}
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Card 4 */}
        <Card className="bg-card/70 border-border/80 bg-gradient-to-br from-emerald-500/5 to-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Получено офферов
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-emerald-400">{offerCount}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              {offerApp ? (
                <>
                  <span className="text-emerald-400 font-semibold">
                    {offerApp.company} {offerApp.salary_max ? `(${offerApp.salary_max.toLocaleString("ru-RU")} ₽)` : ""}
                  </span>
                  <span>• До 5 ноября</span>
                </>
              ) : (
                <span className="text-muted-foreground">Пайплайн в работе</span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Status Breakdown Bar */}
      <Card className="bg-card/70 border-border/80">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-semibold text-foreground">Распределение откликов по воронке ({totalApps} всего)</span>
            <Link href="/tracker" className="text-primary hover:underline flex items-center gap-1">
              <span>Открыть Канбан</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-3 w-full bg-muted/60 rounded-full overflow-hidden flex">
            {totalApps > 0 ? (
              <>
                <div style={{ width: `${(wishlistCount / totalApps) * 100}%` }} className="bg-slate-400" title={`Избранное: ${wishlistCount}`} />
                <div style={{ width: `${(appliedCount / totalApps) * 100}%` }} className="bg-blue-500" title={`Отправлено: ${appliedCount}`} />
                <div style={{ width: `${(screeningCount / totalApps) * 100}%` }} className="bg-cyan-500" title={`Скрининг: ${screeningCount}`} />
                <div style={{ width: `${(interviewCount / totalApps) * 100}%` }} className="bg-amber-500" title={`Интервью: ${interviewCount}`} />
                <div style={{ width: `${(offerCount / totalApps) * 100}%` }} className="bg-emerald-500" title={`Оффер: ${offerCount}`} />
                <div style={{ width: `${(rejectedCount / totalApps) * 100}%` }} className="bg-rose-500" title={`Отказ: ${rejectedCount}`} />
              </>
            ) : (
              <div style={{ width: "100%" }} className="bg-muted" />
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400" /> Избранное ({wishlistCount})</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Отправлено ({appliedCount})</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-500" /> Скрининг ({screeningCount})</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Интервью ({interviewCount})</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Оффер ({offerCount})</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> Отказ ({rejectedCount})</div>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Urgent Follow-Up Center */}
          <Card className="bg-card/70 border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <BellRing className="w-4 h-4 text-amber-400" />
                  <span>Требует действий: Очередь Follow-Up ({pendingFollowUps.length})</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Рекрутеры получают сотни писем. Вежливое напоминание увеличивает шанс ответа на ~34%.
                </CardDescription>
              </div>
              <Link href="/follow-ups">
                <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary cursor-pointer">
                  Все напоминания
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingFollowUps.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                  🎉 Отлично! Все активные напоминания отправлены. Новые появятся по мере откликов на вакансии.
                </div>
              ) : (
                pendingFollowUps.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-border/70 bg-background/50 hover:bg-muted/30 transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${stringToColor(
                          item.company
                        )}`}
                      >
                        {item.company[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground">{item.company}</span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-blue-500/40 text-blue-400">
                            {item.urgency === "overdue" ? "Просрочено" : item.urgency === "today" ? "Сегодня" : "Скоро"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.position}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <span className="text-[11px] text-amber-400/90 font-medium mr-1">
                        Пора написать
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openFollowUpModal(item)}
                        className="text-xs h-7 border-border cursor-pointer"
                      >
                        Готовый шаблон
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => markFollowUpSent(item.id)}
                        className="text-xs h-7 bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                        title="Отметить отправленным"
                      >
                        ✓
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick ATS Resume Audit */}
          <Card className="bg-card/70 border-border/80">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ScanSearch className="w-4 h-4 text-primary" />
                  <span>Последний ATS-аудит</span>
                </CardTitle>
                <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                  82% Совпадение
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Аудит под вакансию: Senior Product Manager
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Ключевые навыки найдены:</span>
                  <span className="font-bold text-foreground">11 из 14 распознано</span>
                </div>
                <Progress value={82} className="h-2" />
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border/50 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Распознанные совпадения:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {["CI/CD", "Agile", "A/B-тестирование", "Product Strategy", "Roadmap"].map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] border border-emerald-500/20">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Link href="/scanner">
                  <Button variant="outline" size="sm" className="w-full text-xs cursor-pointer">
                    Открыть полный аудит и правки
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Follow-Up Preview Modal */}
      <Dialog open={!!selectedFollowUp} onOpenChange={(open) => !open && setSelectedFollowUp(null)}>
        <DialogContent className="sm:max-w-lg bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <span>Шаблон напоминания рекрутеру</span>
            </DialogTitle>
          </DialogHeader>

          {selectedFollowUp && (
            <div className="space-y-3 py-2 text-xs">
              <div className="flex justify-between p-2.5 rounded-lg bg-background/60 border border-border">
                <div>
                  <span className="text-muted-foreground">Компания: </span>
                  <span className="font-semibold text-foreground">{selectedFollowUp.company}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Должность: </span>
                  <span className="font-semibold text-foreground">{selectedFollowUp.position}</span>
                </div>
              </div>

              <div>
                <span className="text-muted-foreground block mb-1">Текст письма (доступен для редактирования):</span>
                <Textarea
                  value={templateText}
                  onChange={(e) => setTemplateText(e.target.value)}
                  rows={9}
                  className="text-xs font-mono resize-y bg-background/50 border-border p-3"
                />
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="text-xs cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                      Скопировано!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1" />
                      Скопировать текст
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  onClick={handleSendEmail}
                  className="text-xs bg-primary text-primary-foreground cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 mr-1" />
                  Отправить по Email
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    if (selectedFollowUp) markFollowUpSent(selectedFollowUp.id);
                    setSelectedFollowUp(null);
                  }}
                  className="text-xs cursor-pointer"
                >
                  ✓ Отметить отправленным
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
