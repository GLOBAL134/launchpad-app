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
import { stringToColor, relativeTime } from "@/lib/utils";
import { useApp, FollowUpItem } from "@/context/AppContext";

export default function FollowUpsPage() {
  const { followUps, markFollowUpSent, userProfile, activeFollowUpsCount, showToast } = useApp();

  const [selectedItem, setSelectedItem] = useState<FollowUpItem | null>(null);
  const [editableText, setEditableText] = useState("");
  const [copied, setCopied] = useState(false);

  const openTemplateModal = (item: FollowUpItem) => {
    setSelectedItem(item);
    const fullMessage = `${item.template}\n\nС уважением,\n${userProfile.name}\n${userProfile.phone}`;
    setEditableText(fullMessage);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editableText);
    setCopied(true);
    showToast("Скопировано в буфер обмена!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = () => {
    if (!selectedItem) return;
    const mailto = `mailto:${selectedItem.contactEmail || ""}?subject=${encodeURIComponent(
      selectedItem.subject
    )}&body=${encodeURIComponent(editableText)}`;
    window.open(mailto, "_blank");
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
            {activeFollowUpsCount} {activeFollowUpsCount === 1 ? "напоминание ждёт" : "напоминания ждут"} отправки
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
              <div className="text-xs text-muted-foreground font-medium">Рост конверсии</div>
              <div className="text-base font-bold text-emerald-400">+34% к шансу на интервью</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/70 border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              🎯
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">Тональность</div>
              <div className="text-base font-bold text-foreground">Профессиональная & ёмкая</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Follow-Up List */}
      <div className="space-y-4">
        {followUps.map((item) => {
          const isSent = item.sent;

          return (
            <Card
              key={item.id}
              className={`bg-card/70 border-border transition-all ${
                isSent ? "opacity-60 bg-muted/20" : "hover:border-primary/40 shadow-sm"
              }`}
            >
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Info */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base shrink-0 ${stringToColor(
                        item.company
                      )}`}
                    >
                      {item.company[0]}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-base text-foreground">{item.company}</h3>
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
                        {item.position} • Контакт: {item.contactName} ({item.contactEmail})
                      </p>
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
                          onClick={() => openTemplateModal(item)}
                          className="text-xs border-border cursor-pointer"
                        >
                          <Mail className="w-3.5 h-3.5 mr-1.5 text-primary" />
                          Открыть шаблон
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => markFollowUpSent(item.id)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-sm shadow-primary/20 cursor-pointer"
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
          <DialogContent className="max-w-lg bg-card border-border text-foreground">
            <DialogHeader>
              <div className="flex items-center gap-2 text-primary font-semibold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>Готовое письмо для отправки рекрутеру</span>
              </div>
              <DialogTitle className="text-lg font-bold">
                Follow-Up в компанию {selectedItem.company}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Позиция: {selectedItem.position}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px] font-semibold mb-1">Тема сообщения</span>
                <div className="p-2.5 rounded-lg bg-background border border-border font-mono text-xs text-foreground">
                  {selectedItem.subject} — {userProfile.name}
                </div>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px] font-semibold mb-1">Текст сообщения</span>
                <Textarea
                  rows={9}
                  value={editableText}
                  onChange={(e) => setEditableText(e.target.value)}
                  className="font-mono text-xs leading-relaxed bg-background border-border"
                />
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="text-xs cursor-pointer"
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
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSendEmail}
                  className="text-xs cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 mr-1" />
                  Отправить по Email
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    markFollowUpSent(selectedItem.id);
                    setSelectedItem(null);
                  }}
                  className="bg-primary text-primary-foreground text-xs font-semibold cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Отметить отправленным
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
