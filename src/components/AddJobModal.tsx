"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApplicationStage } from "@/types";
import { useApp } from "@/context/AppContext";

export default function AddJobModal() {
  const { isAddJobModalOpen, setIsAddJobModalOpen, addApplication } = useApp();

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("Москва / Удаленно");
  const [stage, setStage] = useState<ApplicationStage>("wishlist");
  const [jobDescription, setJobDescription] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !position.trim()) return;

    addApplication({
      company: company.trim(),
      position: position.trim(),
      salary: salary.trim(),
      location: location.trim(),
      stage,
      job_description: jobDescription.trim(),
      notes: notes.trim(),
    });

    setIsAddJobModalOpen(false);
    setCompany("");
    setPosition("");
    setSalary("");
    setLocation("Москва / Удаленно");
    setStage("wishlist");
    setJobDescription("");
    setNotes("");
  };

  return (
    <Dialog open={isAddJobModalOpen} onOpenChange={setIsAddJobModalOpen}>
      <DialogContent className="sm:max-w-lg bg-card border-border text-foreground">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <span>💼</span> Новый отклик на вакансию
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3.5 py-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="add-comp" className="text-xs">Компания *</Label>
                <Input
                  id="add-comp"
                  placeholder="Яндекс, Т-Банк, Ozon, Сбер"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label htmlFor="add-pos" className="text-xs">Должность / Роль *</Label>
                <Input
                  id="add-pos"
                  placeholder="Senior Frontend Developer"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                  className="mt-1 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="add-sal" className="text-xs">Ожидаемый доход</Label>
                <Input
                  id="add-sal"
                  placeholder="250 000 — 350 000 ₽"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label htmlFor="add-loc" className="text-xs">Локация / Формат</Label>
                <Input
                  id="add-loc"
                  placeholder="Москва / Удаленно"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label htmlFor="add-stg" className="text-xs">Статус колонки</Label>
                <Select value={stage} onValueChange={(val) => val && setStage(val as ApplicationStage)}>
                  <SelectTrigger id="add-stg" className="mt-1 text-xs">
                    <SelectValue placeholder="Выберите этап" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wishlist">📌 Избранное</SelectItem>
                    <SelectItem value="applied">📨 Отправлено</SelectItem>
                    <SelectItem value="screening">🔍 Скрининг</SelectItem>
                    <SelectItem value="interviewing">📞 Интервью</SelectItem>
                    <SelectItem value="offer">🎉 Оффер</SelectItem>
                    <SelectItem value="rejected">❌ Отказ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="add-desc" className="text-xs">Описание требований вакансии</Label>
              <Textarea
                id="add-desc"
                placeholder="Стек, обязанности, требования к опыту (для быстрой сверки в ATS-сканере)..."
                rows={3}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="mt-1 text-xs"
              />
            </div>

            <div>
              <Label htmlFor="add-notes" className="text-xs">Заметки / Контакт рекрутера</Label>
              <Input
                id="add-notes"
                placeholder="Отклик через Хабр, контакт @recruiter в Telegram..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddJobModalOpen(false)}
              className="text-xs"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-primary text-primary-foreground text-xs font-semibold"
            >
              Сохранить в пайплайн
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
