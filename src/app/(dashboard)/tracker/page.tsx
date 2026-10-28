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
import { useApp } from "@/context/AppContext";

export default function TrackerPage() {
  const router = useRouter();
  const {
    applications,
    moveStage,
    deleteApplication,
    resetToDemo,
    clearAllApplications,
    setIsAddJobModalOpen,
    setScannerTargetJob,
    setCoverLetterTargetJob,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);

  // Filtered applications
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

          {/* Database management dropdown (Сбросить демо / Очистить базу) */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="sm" className="text-xs border-border/80">
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
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1" />
            Быстрое добавление
          </Button>
        </div>
      </div>

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
                              <h4 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                                {app.company}
                              </h4>
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

                        {/* Metadata badges */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-[10px]">
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

                        {/* Footer info: date and follow-up alert */}
                        <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground">
                          <span>{relativeTime(app.applied_at || app.created_at)}</span>
                          {app.next_follow_up && (
                            <span className="text-amber-400 font-semibold flex items-center gap-1">
                              Пора написать
                            </span>
                          )}
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
          <DialogContent className="max-w-lg bg-card border-border text-foreground">
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
    </div>
  );
}
