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
  Download,
  BookOpen,
  Briefcase,
  Layers,
  Globe,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { stringToColor, relativeTime } from "@/lib/utils";
import { useApp, FollowUpItem } from "@/context/AppContext";
import {
  FOLLOW_UP_SCENARIOS,
  FollowUpScenario,
  interpolateFollowUpTemplate,
  generateIcsCalendarFile,
} from "@/lib/follow-up-templates";
import { cleanAIMarkdownArtifacts } from "@/lib/monetization";

export default function FollowUpsPage() {
  const {
    followUps,
    markFollowUpSent,
    userProfile,
    activeFollowUpsCount,
    applications,
    showToast,
  } = useApp();

  const [selectedItem, setSelectedItem] = useState<FollowUpItem | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<FollowUpScenario | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || "");
  const [templateLanguage, setTemplateLanguage] = useState<"ru" | "en">("ru");
  const [editableText, setEditableText] = useState("");
  const [copied, setCopied] = useState(false);

  // Selected application details
  const activeApp = applications.find((a) => a.id === selectedAppId) || applications[0] || {
    company: "Яндекс",
    position: "Senior Product Manager",
    applied_at: "2026-10-24T12:00:00Z",
  };

  const openQueueModal = (item: FollowUpItem) => {
    setSelectedItem(item);
    setSelectedScenario(null);
    const fullMessage = cleanAIMarkdownArtifacts(
      `${item.template}\n\nС уважением,\n${userProfile.name}\n${userProfile.phone}`
    );
    setEditableText(fullMessage);
    setCopied(false);
  };

  const openLibraryModal = (scenario: FollowUpScenario) => {
    setSelectedScenario(scenario);
    setSelectedItem(null);

    const rawTemplate = templateLanguage === "en" ? scenario.templateEn : scenario.templateRu;
    const interpolated = interpolateFollowUpTemplate(rawTemplate, {
      company: activeApp.company,
      position: activeApp.position,
      topSkill: "A/B-тестирование, CI/CD и системный дизайн",
      keyMetric: "+24% к конверсии в оплату и сокращение time-to-value с 7 дней до 4 часов",
      candidateName: userProfile.name,
      phone: userProfile.phone,
      email: userProfile.email,
    });

    setEditableText(interpolated);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanAIMarkdownArtifacts(editableText));
    setCopied(true);
    showToast("✓ Текст письма скопирован в буфер обмена!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadIcs = () => {
    const icsContent = generateIcsCalendarFile({
      company: activeApp.company,
      position: activeApp.position,
      applied_at: activeApp.applied_at,
    });

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FollowUp_${activeApp.company.replace(/\s+/g, "_")}.ics`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("✓ Файл напоминания в календарь (.ics на +6 дней) скачан!");
  };

  const handleSendEmail = () => {
    const subject = selectedItem
      ? selectedItem.subject
      : selectedScenario
      ? templateLanguage === "en"
        ? selectedScenario.subjectEn.replace("{Position}", activeApp.position).replace("{Company}", activeApp.company)
        : selectedScenario.subjectRu.replace("{Должность}", activeApp.position).replace("{Компания}", activeApp.company)
      : `Follow-Up: ${activeApp.position} в ${activeApp.company}`;

    const mailto = `mailto:${selectedItem?.contactEmail || ""}?subject=${encodeURIComponent(
      subject
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
            <span>Центр напоминаний (Follow-Up Center & Calendar)</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Рекрутеры получают сотни откликов в день. Вежливые напоминания на 5-7 день повышают конверсию в интервью на ~34%.
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
              <div className="text-xs text-muted-foreground font-medium">Календарь</div>
              <div className="text-base font-bold text-foreground">Синхронизация .ICS</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 1: Active Follow-Up Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span>Очередь активных напоминаний</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {followUps.length}
            </span>
          </h2>
        </div>

        {followUps.length === 0 ? (
          <Card className="bg-card/50 border-border border-dashed p-8 text-center space-y-2">
            <BellRing className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
            <div className="font-semibold text-sm">Очередь напоминаний пуста</div>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Когда вы отправляете отклики через Канбан-трекер, они автоматически попадают в очередь на 5-7 день.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {followUps.map((item) => (
              <Card
                key={item.id}
                className={`bg-card/70 border-border transition-all flex flex-col justify-between ${
                  item.sent ? "opacity-60 bg-muted/20" : "hover:border-primary/40"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                        style={{ backgroundColor: stringToColor(item.company) }}
                      >
                        {item.company.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold truncate max-w-[150px]">
                          {item.company}
                        </CardTitle>
                        <CardDescription className="text-xs truncate max-w-[150px]">
                          {item.position}
                        </CardDescription>
                      </div>
                    </div>

                    {item.sent ? (
                      <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                        Отправлено
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          item.urgency === "overdue"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                            : item.urgency === "today"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        {item.daysElapsed} дн. назад
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  <div className="p-2.5 rounded-lg bg-background/50 border border-border/60 text-xs font-mono text-muted-foreground line-clamp-2">
                    {item.subject}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openQueueModal(item)}
                      className="text-xs flex-1 cursor-pointer"
                    >
                      ✉ Открыть шаблон
                    </Button>

                    {!item.sent && (
                      <Button
                        size="sm"
                        onClick={() => markFollowUpSent(item.id)}
                        className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer px-2.5"
                        title="Отметить отправленным"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: 6 Scenarios Follow-Up Library */}
      <div className="space-y-4 pt-6 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>Библиотека 6 проверенных сценариев Follow-Up (RU / EN)</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              С автоподстановкой вакансии, ключевых подтверждённых навыков и оцифрованных метрик
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Vacancy Selector */}
            {applications.length > 0 && (
              <Select value={selectedAppId} onValueChange={(val) => val && setSelectedAppId(val)}>
                <SelectTrigger className="h-8 text-xs bg-card border-border w-[220px]">
                  <SelectValue placeholder="Выберите вакансию..." />
                </SelectTrigger>
                <SelectContent>
                  {applications.map((app) => (
                    <SelectItem key={app.id} value={app.id} className="text-xs">
                      {app.company} ({app.position})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Language Toggle */}
            <div className="flex p-0.5 rounded-lg bg-card border border-border text-xs">
              <button
                onClick={() => setTemplateLanguage("ru")}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  templateLanguage === "ru"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                RU
              </button>
              <button
                onClick={() => setTemplateLanguage("en")}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  templateLanguage === "en"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* 6 Scenarios Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FOLLOW_UP_SCENARIOS.map((sc) => (
            <Card
              key={sc.id}
              className="bg-card/70 border-border hover:border-primary/50 transition flex flex-col justify-between"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="outline" className="text-[10px] text-primary border-primary/30 bg-primary/10">
                    {templateLanguage === "en" ? sc.badgeEn : sc.badgeRu}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openLibraryModal(sc)}
                    className="h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Открыть
                  </Button>
                </div>
                <CardTitle className="text-xs font-bold mt-2">
                  {templateLanguage === "en" ? sc.titleEn : sc.titleRu}
                </CardTitle>
                <CardDescription className="text-[11px] font-mono truncate text-muted-foreground/80 pt-1">
                  {templateLanguage === "en"
                    ? sc.subjectEn.replace("{Position}", activeApp.position).replace("{Company}", activeApp.company)
                    : sc.subjectRu.replace("{Должность}", activeApp.position).replace("{Компания}", activeApp.company)}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="p-2.5 rounded-lg bg-background/50 border border-border/60 text-xs font-mono text-muted-foreground line-clamp-3 mb-3">
                  {templateLanguage === "en" ? sc.templateEn : sc.templateRu}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => openLibraryModal(sc)}
                    className="text-xs bg-primary text-primary-foreground hover:bg-primary/90 flex-1 cursor-pointer h-7 font-semibold"
                  >
                    <span>Использовать</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDownloadIcs}
                    title="Скачать напоминание в календарь (.ics на +6 дней)"
                    className="h-7 text-xs border-border cursor-pointer px-2"
                  >
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal for Queue or Scenario Template */}
      <Dialog
        open={!!selectedItem || !!selectedScenario}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedItem(null);
            setSelectedScenario(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-xl bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <span>
                {selectedItem
                  ? `Follow-Up: ${selectedItem.company} (${selectedItem.position})`
                  : selectedScenario
                  ? templateLanguage === "en" ? selectedScenario.titleEn : selectedScenario.titleRu
                  : "Шаблон Follow-Up"}
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Все переменные автоматически подставлены из карточки вакансии («{activeApp.company}»).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <div className="p-2 rounded-lg bg-background/60 border border-border/70 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <span className="text-muted-foreground">Тема:</span>
                <span className="font-semibold text-foreground truncate">
                  {selectedItem
                    ? selectedItem.subject
                    : selectedScenario
                    ? templateLanguage === "en"
                      ? selectedScenario.subjectEn.replace("{Position}", activeApp.position).replace("{Company}", activeApp.company)
                      : selectedScenario.subjectRu.replace("{Должность}", activeApp.position).replace("{Компания}", activeApp.company)
                    : "Follow-Up"}
                </span>
              </div>
            </div>

            <Textarea
              value={editableText}
              onChange={(e) => setEditableText(cleanAIMarkdownArtifacts(e.target.value))}
              rows={11}
              className="text-xs font-mono bg-background/60 border-border resize-none leading-relaxed"
            />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadIcs}
              className="text-xs border-border flex items-center gap-1.5 cursor-pointer w-full sm:w-auto"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Добавить в календарь (.ics)</span>
            </Button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="text-xs border-border flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Скопировано" : "Копировать"}</span>
              </Button>

              <Button
                size="sm"
                onClick={handleSendEmail}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold shadow-md shadow-primary/25 flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Отправить письмо</span>
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}