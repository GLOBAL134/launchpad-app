"use client";

import { useState } from "react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DEMO_APPLICATIONS } from "@/lib/demo-data";
import { STAGE_COLUMNS, JobApplication, ApplicationStage } from "@/types";
import { stringToColor, relativeTime } from "@/lib/utils";

export default function TrackerPage() {
  const [applications, setApplications] = useState<JobApplication[]>(DEMO_APPLICATIONS);
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

  // Move card to next or previous stage
  const moveStage = (appId: string, newStage: ApplicationStage) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? { ...app, stage: newStage, updated_at: new Date().toISOString() }
          : app
      )
    );
    if (selectedJob && selectedJob.id === appId) {
      setSelectedJob((prev) => (prev ? { ...prev, stage: newStage } : null));
    }
  };

  const deleteApp = (appId: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== appId));
    setSelectedJob(null);
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

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs py-1 px-3 bg-muted/40">
            Всего в пайплайне: <span className="font-bold ml-1 text-foreground">{applications.length}</span>
          </Badge>
          <Button
            size="sm"
            onClick={() => {
              const company = prompt("Введите название компании (например: Ozon):");
              const position = prompt("Введите должность (например: Senior Go Developer):");
              if (company && position) {
                const newApp: JobApplication = {
                  id: String(Date.now()),
                  user_id: "demo",
                  company,
                  position,
                  url: null,
                  stage: "wishlist",
                  salary_min: 250000,
                  salary_max: 350000,
                  location: "Москва / Удаленно",
                  remote: true,
                  notes: "Новый отклик добавлен вручную",
                  job_description: null,
                  resume_version: "Версия 1",
                  cover_letter: null,
                  contact_name: null,
                  contact_email: null,
                  applied_at: new Date().toISOString(),
                  followed_up_at: null,
                  next_follow_up: null,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                };
                setApplications([newApp, ...applications]);
              }
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold"
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
                className="w-80 shrink-0 bg-card/40 rounded-2xl border border-border/80 flex flex-col max-h-[calc(100vh-220px)]"
              >
                {/* Column Header */}
                <div className="p-3.5 border-b border-border/70 flex items-center justify-between bg-card/60 rounded-t-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{column.icon}</span>
                    <span className="font-bold text-sm text-foreground">{column.title}</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                  >
                    {columnApps.length}
                  </Badge>
                </div>

                {/* Column Cards Scrollable Area */}
                <div className="p-2.5 overflow-y-auto space-y-2.5 flex-1">
                  {columnApps.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-xs border border-dashed border-border/60 rounded-xl">
                      В этой колонке нет вакансий
                    </div>
                  ) : (
                    columnApps.map((app) => (
                      <div
                        key={app.id}
                        className="group bg-card rounded-xl p-3 border border-border/80 shadow-sm hover:border-primary/50 transition-all hover:shadow-md cursor-pointer relative"
                        onClick={() => setSelectedJob(app)}
                      >
                        {/* Company & Role */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5">
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
                                <DropdownMenuItem onClick={() => moveStage(app.id, "screening")}>
                                  Перевести в Скрининг
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => moveStage(app.id, "interviewing")}>
                                  Перевести в Интервью
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => moveStage(app.id, "offer")}>
                                  Получен оффер 🎉
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => moveStage(app.id, "rejected")}>
                                  Отметить отказ
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => deleteApp(app.id)}
                                  className="text-red-400 focus:text-red-400"
                                >
                                  Удалить
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
          <DialogContent className="max-w-lg bg-card border-border">
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
              {/* Quick Move Stage Selector */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  Переместить на этап:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {STAGE_COLUMNS.slice(0, 4).map((col) => (
                    <Button
                      key={col.id}
                      size="sm"
                      variant={selectedJob.stage === col.id ? "default" : "outline"}
                      className={`text-[11px] h-8 ${selectedJob.stage === col.id ? "bg-primary text-primary-foreground font-bold" : ""}`}
                      onClick={() => moveStage(selectedJob.id, col.id)}
                    >
                      {col.icon} {col.title}
                    </Button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                  {STAGE_COLUMNS.slice(4).map((col) => (
                    <Button
                      key={col.id}
                      size="sm"
                      variant={selectedJob.stage === col.id ? "default" : "outline"}
                      className={`text-[11px] h-8 ${selectedJob.stage === col.id ? "bg-primary text-primary-foreground font-bold" : ""}`}
                      onClick={() => moveStage(selectedJob.id, col.id)}
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

              {/* Recruiter / Contact details */}
              {selectedJob.contact_name && (
                <div className="p-3 bg-muted/30 rounded-xl border border-border/60">
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Рекрутер / Контакт</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-semibold text-foreground">{selectedJob.contact_name}</span>
                    <span className="text-muted-foreground">{selectedJob.contact_email || "Telegram"}</span>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold mb-1">
                  Заметки и история собеседований
                </span>
                <div className="p-3 bg-background/50 rounded-xl border border-border text-xs leading-relaxed text-foreground">
                  {selectedJob.notes || "Заметок пока нет."}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/60">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteApp(selectedJob.id)}
                className="text-xs"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Удалить
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedJob(null)}
                className="text-xs"
              >
                Сохранить
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
