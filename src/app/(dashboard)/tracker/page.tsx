"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  MapPin,
  Calendar,
  ExternalLink,
  ChevronRight,
  MoveRight,
  Trash2,
  Edit3,
  ScanSearch,
  PenTool,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  Target,
  Copy,
  Check,
  FileText,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { STAGE_COLUMNS, JobApplication, ApplicationStage } from "@/types";
import { stringToColor, relativeTime } from "@/lib/utils";
import { generateIcsCalendarFile, generateGoogleCalendarUrl } from "@/lib/follow-up-templates";
import { useApp } from "@/context/AppContext";
import { AiInterviewPrepModal } from "@/components/AiInterviewPrepModal";
import { SalaryNegotiatorModal } from "@/components/SalaryNegotiatorModal";

export default function TrackerPage() {
  const router = useRouter();
  const {
    userProfile,
    applications,
    moveStage,
    deleteApplication,
    resetToDemo,
    clearAllApplications,
    setIsAddJobModalOpen,
    setScannerTargetJob,
    setCoverLetterTargetJob,
    showToast,
    authSession,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [interviewPrepOpen, setInterviewPrepOpen] = useState(false);
  const [interviewPrepJob, setInterviewPrepJob] = useState<JobApplication | null>(null);
  const [salaryNegotiatorOpen, setSalaryNegotiatorOpen] = useState(false);
  const [salaryNegotiatorJob, setSalaryNegotiatorJob] = useState<JobApplication | null>(null);

  const handleOpenInterviewPrep = (app: JobApplication) => {
    setInterviewPrepJob(app);
    setInterviewPrepOpen(true);
  };

  const handleShiftStage = (e: React.MouseEvent, app: JobApplication, direction: "prev" | "next") => {
    e.stopPropagation();
    const stageIds: ApplicationStage[] = ["wishlist", "applied", "screening", "interviewing", "offer"];
    const currentIndex = stageIds.indexOf(app.stage as ApplicationStage);
    if (currentIndex === -1) return;

    if (direction === "prev" && currentIndex > 0) {
      moveStage(app.id, stageIds[currentIndex - 1]);
    } else if (direction === "next" && currentIndex < stageIds.length - 1) {
      moveStage(app.id, stageIds[currentIndex + 1]);
    }
  };

  // Filtered applications
  const hasDemoApps = applications.some((a) => a.user_id === "demo");
  const filteredApps = applications.filter((app) => {
    const query = searchQuery.toLowerCase();
    return (
      app.company.toLowerCase().includes(query) ||
      app.position.toLowerCase().includes(query) ||
      (app.location && app.location.toLowerCase().includes(query))
    );
  });

  const handleInspectInScanner = (app: JobApplication) => {
    setScannerTargetJob({
      company: app.company,
      position: app.position,
      description: app.job_description || `Требования к роли ${app.position} в компании ${app.company}. Необходим релевантный опыт, знание современных инструментов и участие в запуске ключевых фич.`,
    });
    router.push("/scanner");
  };

  const handleGenerateCoverLetter = (app: JobApplication) => {
    setCoverLetterTargetJob({
      company: app.company,
      position: app.position,
    });
    router.push("/cover-letter");
  };

  const handleDownloadIcs = (app: JobApplication) => {
    const icsContent = generateIcsCalendarFile({
      company: app.company,
      position: app.position,
      applied_at: app.applied_at || app.created_at,
    });
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FollowUp_${app.company.replace(/\s+/g, "_")}.ics`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`✓ Напоминание в календарь (.ics на +6 дней) для «${app.company}» скачано!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/60 p-4 rounded-xl border border-border">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по компании, должности или городу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-xs py-1 px-3 bg-muted/40">
            Всего в пайплайне: <span className="font-bold ml-1 text-foreground">{applications.length}</span>
          </Badge>

          {/* Quick Clear Demo Button */}
          {applications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllApplications}
              className="text-xs border-border/80 text-muted-foreground hover:text-rose-400 hover:border-rose-500/30 cursor-pointer"
              title="Очистить демо-вакансии и начать с чистого листа"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1 text-rose-400" />
              Очистить демо / С чистого листа
            </Button>
          )}

          {/* Database management dropdown (Сбросить демо / Очистить базу) */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="sm" className="text-xs border-border/80 cursor-pointer">
                  <RotateCcw className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                  База данных
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="text-xs">
              <DropdownMenuItem onClick={resetToDemo} className="cursor-pointer">
                ↺ Восстановить демо-вакансии (10 шт.)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={clearAllApplications} className="text-rose-400 focus:text-rose-400 cursor-pointer">
                🗑 Очистить базу для личных откликов
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            size="sm"
            onClick={() => setIsAddJobModalOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold cursor-pointer shadow-sm shadow-primary/20"
          >
            <Plus className="w-4 h-4 mr-1" />
            Быстрое добавление
          </Button>
        </div>
      </div>

      {/* Demo Mode Notice Banner */}
      {hasDemoApps && (
        <div className="p-3 sm:px-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-left">
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase border border-amber-500/30 shrink-0">
              Демо-режим
            </span>
            <span className="text-[11px] sm:text-xs text-slate-200">
              Сейчас показаны демонстрационные примеры для наглядности работы пайплайна.
            </span>
          </div>
          <Button
            size="sm"
            onClick={clearAllApplications}
            className="w-full sm:w-auto h-7 text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 cursor-pointer font-semibold shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1 text-amber-400" />
            🗑 Очистить примеры и начать с чистого листа
          </Button>
        </div>
      )}

      {/* Kanban Board Container (horizontally scrollable) */}
      <div className="overflow-x-auto pb-6">
        <div className="flex gap-4 min-w-[1280px]">
          {STAGE_COLUMNS.map((column) => {
            const columnApps = filteredApps.filter((a) => a.stage === column.id);

            return (
              <div
                key={column.id}
                className="flex-1 min-w-[250px] max-w-[280px] bg-card/40 rounded-2xl border border-border/80 flex flex-col max-h-[calc(100vh-250px)]"
              >
                {/* Column Header */}
                <div className="p-3.5 border-b border-border/70 flex items-center justify-between bg-card/60 rounded-t-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{column.icon}</span>
                    <h3 className="font-bold text-xs text-foreground tracking-tight">
                      {column.title}
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {columnApps.length}
                  </span>
                </div>

                {/* Column Cards Drop Area */}
                <div className="p-2.5 flex-1 overflow-y-auto space-y-2.5">
                  {columnApps.length === 0 ? (
                    <div className="h-28 border border-dashed border-border/50 rounded-xl flex items-center justify-center text-[11px] text-muted-foreground/60 text-center px-4">
                      Переместите карточку сюда
                    </div>
                  ) : (
                    columnApps.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => setSelectedJob(app)}
                        className="group relative p-3 rounded-xl border border-border/70 bg-card hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
                      >
                        {/* Card Top: Company Avatar, Name, and Menu */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${stringToColor(
                                app.company
                              )}`}
                            >
                              {app.company[0]}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                                  {app.company}
                                </h4>
                                {app.user_id === "demo" && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
                                    ПРИМЕР
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-muted-foreground line-clamp-1">
                                {app.position}
                              </p>
                            </div>
                          </div>

                          {/* Quick Actions Dropdown */}
                          <div onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                render={
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground hover:text-foreground opacity-60 group-hover:opacity-100"
                                  >
                                    <MoreVertical className="w-3.5 h-3.5" />
                                  </Button>
                                }
                              />
                              <DropdownMenuContent align="end" className="text-xs">
                                <DropdownMenuItem onClick={() => handleInspectInScanner(app)} className="cursor-pointer">
                                  <ScanSearch className="w-3.5 h-3.5 mr-2 text-primary" />
                                  Проверить в ATS-сканере
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleGenerateCoverLetter(app)} className="cursor-pointer">
                                  <PenTool className="w-3.5 h-3.5 mr-2 text-indigo-400" />
                                  Создать сопроводительное письмо
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDownloadIcs(app)} className="cursor-pointer">
                                  <Calendar className="w-3.5 h-3.5 mr-2 text-amber-400" />
                                  Напоминание в календарь (.ics)
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => moveStage(app.id, "wishlist")} className="cursor-pointer">
                                  📌 В Избранное
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => moveStage(app.id, "applied")} className="cursor-pointer">
                                  📨 В Отправлено
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => moveStage(app.id, "screening")} className="cursor-pointer">
                                  🔍 В Скрининг
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => moveStage(app.id, "interviewing")} className="cursor-pointer">
                                  📞 В Интервью
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => moveStage(app.id, "offer")} className="cursor-pointer text-emerald-400">
                                  🎉 Получен оффер
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => moveStage(app.id, "rejected")} className="cursor-pointer">
                                  ❌ Отказ
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => deleteApplication(app.id)}
                                  className="text-rose-400 focus:text-rose-400 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                                  Удалить карточку
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Metadata badges: Salary, Location, ATS score */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-[10px]">
                          {app.resume_version && (app.resume_version.includes("%") || app.resume_version.includes("ATS")) && (
                            <span className="font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/25 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              {app.resume_version}
                            </span>
                          )}
                          {app.salary_min && (
                            <span className="font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {app.salary_min.toLocaleString("ru-RU")} — {app.salary_max!.toLocaleString("ru-RU")} ₽
                            </span>
                          )}
                          {app.location && (
                            <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5" />
                              {app.location.split("/")[0].trim()}
                            </span>
                          )}
                        </div>

                        {/* Footer info: date, follow-up alert, and quick stage arrows */}
                        <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground">
                          <span>{relativeTime(app.applied_at || app.created_at)}</span>

                          <div className="flex items-center gap-2">
                            {app.next_follow_up && (
                              <span className="text-amber-400 font-semibold flex items-center gap-1">
                                Пора написать
                              </span>
                            )}

                            {/* Quick Stage shifting arrows */}
                            <div
                              className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={(e) => handleShiftStage(e, app, "prev")}
                                className="p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                                title="Сдвинуть этап влево"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleShiftStage(e, app, "next")}
                                className="p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                                title="Сдвинуть этап вправо"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Modal for viewing and changing an application */}
      {selectedJob && (
        <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
          <DialogContent className="w-[calc(100vw-20px)] sm:max-w-lg max-h-[92vh] overflow-y-auto p-4 sm:p-6 bg-card border-border text-foreground">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${stringToColor(
                    selectedJob.company
                  )}`}
                >
                  {selectedJob.company[0]}
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold">{selectedJob.company}</DialogTitle>
                  <p className="text-sm text-muted-foreground">{selectedJob.position}</p>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-3 text-xs">
              {/* Quick Actions row */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    handleInspectInScanner(selectedJob);
                    setSelectedJob(null);
                  }}
                  className="text-xs justify-center cursor-pointer"
                >
                  <ScanSearch className="w-3.5 h-3.5 mr-1.5 text-primary" />
                  ATS-аудит резюме
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    handleGenerateCoverLetter(selectedJob);
                    setSelectedJob(null);
                  }}
                  className="text-xs justify-center cursor-pointer"
                >
                  <PenTool className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                  Написать письмо
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    handleOpenInterviewPrep(selectedJob);
                  }}
                  className="text-xs justify-center cursor-pointer col-span-2 border-purple-500/40 text-purple-300 hover:bg-purple-500/10 font-semibold h-auto py-2 whitespace-normal text-center"
                >
                  <Target className="w-3.5 h-3.5 mr-1.5 text-purple-400 shrink-0" />
                  <span>🎯 Подготовиться к собеседованию с ИИ под эту компанию</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSalaryNegotiatorJob(selectedJob);
                    setSalaryNegotiatorOpen(true);
                  }}
                  className="text-xs justify-center cursor-pointer col-span-2 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 font-semibold h-auto py-2 whitespace-normal text-center"
                >
                  <DollarSign className="w-3.5 h-3.5 mr-1.5 text-emerald-400 shrink-0" />
                  <span>💰 Торг по зарплате (+15–25% к офферу с ИИ)</span>
                </Button>

                <div className="grid grid-cols-2 gap-2 col-span-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const gCalUrl = generateGoogleCalendarUrl({
                        company: selectedJob.company,
                        position: selectedJob.position,
                        applied_at: selectedJob.applied_at,
                      });
                      window.open(gCalUrl, "_blank", "noopener,noreferrer");
                      showToast("✓ Напоминание открыто в Google Календаре (+5 дней)!");
                    }}
                    className="text-xs justify-center cursor-pointer border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary"
                  >
                    <Calendar className="w-3.5 h-3.5 mr-1 text-primary" />
                    Google Календарь
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      handleDownloadIcs(selectedJob);
                    }}
                    className="text-xs justify-center cursor-pointer border-border/80 text-amber-300 hover:bg-amber-500/10"
                  >
                    <Calendar className="w-3.5 h-3.5 mr-1 text-amber-400" />
                    Скачать .ICS
                  </Button>
                </div>
              </div>

              {/* Quick Move Stage Selector */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  Переместить на этап:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {STAGE_COLUMNS.map((col) => (
                    <Button
                      key={col.id}
                      size="sm"
                      variant={selectedJob.stage === col.id ? "default" : "outline"}
                      className={`text-[11px] h-8 cursor-pointer ${selectedJob.stage === col.id ? "bg-primary text-primary-foreground font-bold" : ""}`}
                      onClick={() => {
                        moveStage(selectedJob.id, col.id);
                        setSelectedJob({ ...selectedJob, stage: col.id });
                      }}
                    >
                      {col.icon} {col.title}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Attached Cover Letter if present */}
              {selectedJob.cover_letter && (
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1">
                      <PenTool className="w-3 h-3" /> Прикрепленное Cover Letter
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedJob.cover_letter!);
                        showToast("Сопроводительное письмо скопировано!");
                      }}
                      className="h-6 text-[10px] text-indigo-300 hover:bg-indigo-500/20 cursor-pointer"
                    >
                      <Copy className="w-3 h-3 mr-1" /> Скопировать
                    </Button>
                  </div>
                  <div className="text-[11px] text-foreground leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {selectedJob.cover_letter}
                  </div>
                </div>
              )}

              {/* Attached Resume Version if present */}
              {selectedJob.resume_version && selectedJob.resume_version.length > 50 && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                      <FileText className="w-3 h-3" /> Адаптированное резюме под вакансию
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedJob.resume_version!);
                        showToast("Резюме скопировано!");
                      }}
                      className="h-6 text-[10px] text-emerald-300 hover:bg-emerald-500/20 cursor-pointer"
                    >
                      <Copy className="w-3 h-3 mr-1" /> Скопировать
                    </Button>
                  </div>
                  <div className="text-[11px] text-foreground font-mono leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {selectedJob.resume_version}
                  </div>
                </div>
              )}

              {/* Compensation & Location */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded-xl border border-border/60">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Уровень дохода</span>
                  <span className="font-semibold text-emerald-400 text-sm">
                    {selectedJob.salary_min
                      ? `${selectedJob.salary_min.toLocaleString("ru-RU")} — ${selectedJob.salary_max!.toLocaleString("ru-RU")} ₽`
                      : "Не указан"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Локация</span>
                  <span className="text-foreground text-sm">{selectedJob.location || "Удаленно"}</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold mb-1">
                  Заметки и история отклика
                </span>
                <div className="p-3 bg-background/50 rounded-xl border border-border text-xs leading-relaxed text-foreground">
                  {selectedJob.notes || selectedJob.job_description || "Заметок пока нет."}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/60">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  deleteApplication(selectedJob.id);
                  setSelectedJob(null);
                }}
                className="text-xs cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Удалить
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedJob(null)}
                className="text-xs cursor-pointer"
              >
                Закрыть
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Module 5: AI Interview Prep from Kanban Card */}
      {interviewPrepJob && (
        <AiInterviewPrepModal
          open={interviewPrepOpen}
          onOpenChange={setInterviewPrepOpen}
          company={interviewPrepJob.company}
          position={interviewPrepJob.position}
          resumeText={interviewPrepJob.resume_version || userProfile.title}
          jobDesc={
            interviewPrepJob.job_description ||
            `Вакансия: ${interviewPrepJob.position} в компании ${interviewPrepJob.company}. Релевантный опыт, компетенции, выполнение KPI.`
          }
        />
      )}

      {/* Module: AI Salary Negotiator from Kanban Card */}
      {salaryNegotiatorJob && (
        <SalaryNegotiatorModal
          open={salaryNegotiatorOpen}
          onOpenChange={setSalaryNegotiatorOpen}
          positionName={salaryNegotiatorJob.position}
          companyName={salaryNegotiatorJob.company}
          resumeText={salaryNegotiatorJob.resume_version || userProfile.title}
          defaultOfferedSalary={
            salaryNegotiatorJob.salary_max
              ? `${salaryNegotiatorJob.salary_max.toLocaleString("ru-RU")} ₽`
              : "180 000 ₽"
          }
          onToast={showToast}
        />
      )}
    </div>
  );
}
