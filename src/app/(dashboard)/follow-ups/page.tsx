"use client";

import { useState } from "react";
import {
  BellRing,
  Clock,
  Send,
  Copy,
  Check,
  AlertCircle,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Mail,
  UserCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DEMO_APPLICATIONS } from "@/lib/demo-data";
import { JobApplication } from "@/types";
import { stringToColor, relativeTime } from "@/lib/utils";

interface FollowUpItem {
  app: JobApplication;
  urgency: "overdue" | "today" | "upcoming";
  daysElapsed: number;
  subject: string;
  template: string;
}

export default function FollowUpsPage() {
  const [selectedItem, setSelectedItem] = useState<FollowUpItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [sentMap, setSentMap] = useState<Record<string, boolean>>({});

  // Generate follow up items from demo applications
  const followUpItems: FollowUpItem[] = [
    {
      app: DEMO_APPLICATIONS[1], // Т-Банк
      urgency: "today",
      daysElapsed: 7,
      subject: "Уточнение статуса рассмотрения резюме: Lead Frontend Engineer — Алексей Морозов",
      template: `Здравствуйте, ${DEMO_APPLICATIONS[1].contact_name || "команда подбора Т-Банка"}!

Надеюсь, ваша неделя проходит продуктивно.

Я отправлял отклик на позицию Lead Frontend Engineer ровно 7 дней назад и хотел подтвердить свою высокую заинтересованность в работе над платформой Т-Банка. Обладая опытом оптимизации производительности микрофронтендов и построения дизайн-систем, я уверен, что смогу принести пользу команде.

Подскажите, удалось ли ознакомиться с резюме, и требуются ли какие-либо дополнительные материалы с моей стороны?

С уважением,
Алексей Морозов
+7 (999) 123-45-67`,
    },
    {
      app: DEMO_APPLICATIONS[9], // Selectel
      urgency: "upcoming",
      daysElapsed: 3,
      subject: "Отклик на вакансию: Infrastructure Platform Engineer — Алексей Морозов",
      template: `Здравствуйте!

Недавно подавал отклик на роль Infrastructure Platform Engineer в Selectel. Очень импонирует технологический стек и подход вашей команды к масштабированию инфраструктуры.

Буду рад получить обратную связь, когда резюме будет рассмотрено нанимающим менеджером.

Хорошего дня,
Алексей Морозов`,
    },
    {
      app: DEMO_APPLICATIONS[5], // VK
      urgency: "overdue",
      daysElapsed: 12,
      subject: "Статус отклика: Data Scientist (Рекомендации) — Алексей Морозов",
      template: `Здравствуйте, команда подбора VK!

Пишу вежливо уточнить статус рассмотрения моего отклика на вакансию Data Scientist в команду рекомендаций, направленного две недели назад.

Вакансия по-прежнему для меня в приоритете, так как мои наработки в графовых сетях напрямую перекликаются с задачами вашей умной ленты.

Буду очень признателен за краткий апдейт по процессу отбора.

С уважением,
Алексей Морозов`,
    },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const markAsSent = (appId: string) => {
    setSentMap((prev) => ({ ...prev, [appId]: true }));
    setSelectedItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <BellRing className="w-6 h-6 text-amber-400" />
            <span>Центр напоминаний (Follow-Up)</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Рекрутеры получают сотни откликов в день. Вежливые и своевременные напоминания повышают конверсию в интервью на ~34%.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-400 border-amber-500/30 font-semibold py-1">
            {followUpItems.filter((i) => !sentMap[i.app.id]).length} Напоминания ждут отправки
          </Badge>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card/70 border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              ⚡
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">Оптимальное окно</div>
              <div className="text-base font-bold text-foreground">5 — 7 дней после подачи</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/70 border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              📈
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">Прирост конверсии</div>
              <div className="text-base font-bold text-emerald-400">+34% к ответам HR</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/70 border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              ⏱️
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">Средний срок ответа</div>
              <div className="text-base font-bold text-foreground">11.4 дней в IT</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Follow-Up Action Queue */}
      <div className="space-y-4">
        {followUpItems.map((item) => {
          const isSent = sentMap[item.app.id];

          return (
            <Card
              key={item.app.id}
              className={`border transition-all ${
                isSent
                  ? "opacity-60 bg-card/40 border-border/50"
                  : item.urgency === "overdue"
                  ? "bg-card/80 border-red-500/40 hover:border-red-500/60"
                  : item.urgency === "today"
                  ? "bg-card/80 border-amber-500/40 hover:border-amber-500/60"
                  : "bg-card/80 border-border/80 hover:border-primary/50"
              }`}
            >
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Company & Meta */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base shrink-0 ${stringToColor(
                        item.app.company
                      )}`}
                    >
                      {item.app.company[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-base text-foreground">{item.app.company}</h3>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isSent
                              ? "bg-emerald-500/20 text-emerald-400"
                              : item.urgency === "overdue"
                              ? "bg-red-500/20 text-red-400"
                              : item.urgency === "today"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isSent
                            ? "✓ Отправлено"
                            : item.urgency === "overdue"
                            ? "⚠️ Просрочено (12+ дней)"
                            : item.urgency === "today"
                            ? "📅 Написать сегодня (7 дней)"
                            : "📋 Запланировано (через 3 дня)"}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                        {item.app.position} • Отклик {relativeTime(item.app.applied_at || item.app.created_at)}
                      </p>

                      {item.app.contact_name && (
                        <p className="text-[11px] text-primary mt-1 flex items-center gap-1">
                          <UserCheck className="w-3 h-3" />
                          <span>Рекрутер: {item.app.contact_name}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2.5 self-end lg:self-center">
                    {isSent ? (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                        <Check className="w-4 h-4" /> Напоминание отправлено
                      </span>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedItem(item)}
                          className="text-xs border-border"
                        >
                          <Mail className="w-3.5 h-3.5 mr-1.5 text-primary" />
                          Открыть шаблон
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => markAsSent(item.app.id)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-sm shadow-primary/20"
                        >
                          <Send className="w-3.5 h-3.5 mr-1.5" />
                          Отметить отправленным
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Inline Message Preview Snippet */}
                {!isSent && (
                  <div className="mt-4 pt-3 border-t border-border/50 text-xs text-muted-foreground bg-background/40 p-3 rounded-lg font-mono">
                    <span className="text-[10px] uppercase font-bold text-foreground/80 block mb-1">
                      Тема: {item.subject}
                    </span>
                    <p className="line-clamp-2 italic">"{item.template}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modal with Full Email Draft */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-lg bg-card border-border">
            <DialogHeader>
              <div className="flex items-center gap-2 text-primary font-semibold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>Готовое письмо для отправки рекрутеру</span>
              </div>
              <DialogTitle className="text-lg font-bold">
                Follow-Up в компанию {selectedItem.app.company}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Позиция: {selectedItem.app.position}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px] font-semibold mb-1">Тема сообщения</span>
                <div className="p-2.5 rounded-lg bg-background border border-border font-mono text-xs text-foreground">
                  {selectedItem.subject}
                </div>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px] font-semibold mb-1">Текст сообщения</span>
                <Textarea
                  rows={9}
                  defaultValue={selectedItem.template}
                  className="font-mono text-xs leading-relaxed bg-background border-border"
                />
              </div>
            </div>

            <DialogFooter className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(selectedItem.template)}
                className="text-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                    Скопировано в буфер
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    Копировать текст
                  </>
                )}
              </Button>
              <Button
                size="sm"
                onClick={() => markAsSent(selectedItem.app.id)}
                className="bg-primary text-primary-foreground text-xs font-semibold"
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                Отметить отправленным
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
