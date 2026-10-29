"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Briefcase, Download, Upload, ShieldCheck, Trash2, Scale } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function UserProfileModal() {
  const {
    userProfile,
    updateUserProfile,
    isProfileModalOpen,
    setIsProfileModalOpen,
    exportBackupData,
    importBackupData,
    showToast,
  } = useApp();

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [title, setTitle] = useState(userProfile.title);
  const backupFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(userProfile.name);
    setEmail(userProfile.email);
    setPhone(userProfile.phone);
    setTitle(userProfile.title);
  }, [userProfile, isProfileModalOpen]);

  const handleBackupFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importBackupData(content);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim() || "Алексей Медведев",
      email: email.trim() || "alexey.medvedev@company.ru",
      phone: phone.trim() || "+7 (999) 123-45-67",
      title: title.trim() || "Специалист / Руководитель",
    });
    setIsProfileModalOpen(false);
  };

  const handleWipeAllData = () => {
    const confirmed = window.confirm(
      "ВНИМАНИЕ: Вы действительно хотите удалить ВСЕ данные?\n\nЭто действие безвозвратно удалит ваше резюме, профиль, карточки Канбана и историю откликов из локального хранилища браузера на этом устройстве в соответствии со ст. 21 152-ФЗ РФ."
    );
    if (!confirmed) return;

    if (typeof window !== "undefined") {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (err) {
        console.error("Wipe error:", err);
      }
      setIsProfileModalOpen(false);
      showToast("✓ Все персональные данные, резюме и отклики удалены с устройства");
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  };

  return (
    <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
      <DialogContent className="w-[calc(100vw-20px)] sm:max-w-md max-h-[92vh] overflow-y-auto p-4 sm:p-6 bg-card border-border text-foreground">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <span>Профиль соискателя</span>
            </DialogTitle>
          </DialogHeader>

          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Укажите ваши реальные данные. Они автоматически подставятся в приветствие, подпись сопроводительных писем и шаблоны фоллоу-апов.
          </p>

          <div className="space-y-3.5 text-xs">
            <div>
              <Label htmlFor="prof-name" className="text-xs flex items-center gap-1.5 mb-1 text-foreground">
                <User className="w-3.5 h-3.5 text-primary" />
                <span>Имя и фамилия *</span>
              </Label>
              <Input
                id="prof-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например: Иван Иванов"
                required
                className="text-xs"
              />
            </div>

            <div>
              <Label htmlFor="prof-title" className="text-xs flex items-center gap-1.5 mb-1 text-foreground">
                <Briefcase className="w-3.5 h-3.5 text-primary" />
                <span>Целевая должность / Специализация</span>
              </Label>
              <Input
                id="prof-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: Senior Frontend Developer"
                className="text-xs"
              />
            </div>

            <div>
              <Label htmlFor="prof-email" className="text-xs flex items-center gap-1.5 mb-1 text-foreground">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span>Электронная почта *</span>
              </Label>
              <Input
                id="prof-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ivan@example.com"
                required
                className="text-xs"
              />
            </div>

            <div>
              <Label htmlFor="prof-phone" className="text-xs flex items-center gap-1.5 mb-1 text-foreground">
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span>Телефон / Мессенджер</span>
              </Label>
              <Input
                id="prof-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (999) 000-00-00"
                className="text-xs"
              />
            </div>

            {/* Backup & Restore Data (Module 6) */}
            <div className="pt-4 border-t border-border/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Резервное копирование и сохранность данных
                </span>
                <span className="text-[10px] text-muted-foreground">JSON v2026</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Все ваши резюме, вакансии и карточки хранятся локально в браузере. Выгрузите резервный файл для переноса на другое устройство:
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={exportBackupData}
                  className="text-xs h-8 cursor-pointer flex items-center justify-center gap-1 border-border/80 hover:bg-primary/10"
                >
                  <Download className="w-3.5 h-3.5 text-primary" />
                  <span>Экспорт (Backup)</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => backupFileInputRef.current?.click()}
                  className="text-xs h-8 cursor-pointer flex items-center justify-center gap-1 border-border/80 hover:bg-emerald-500/10"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Импорт JSON</span>
                </Button>

                <input
                  type="file"
                  ref={backupFileInputRef}
                  onChange={handleBackupFileChange}
                  accept=".json,application/json"
                  className="hidden"
                />
              </div>
            </div>

            {/* Legal Notice & Full Data Wipe (152-ФЗ РФ) */}
            <div className="pt-4 border-t border-border/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-primary" />
                  <span>Защита данных (152-ФЗ РФ)</span>
                </span>
                <div className="flex items-center gap-2 text-[10px]">
                  <Link href="/privacy" target="_blank" className="text-primary underline hover:text-primary/80">
                    Политика
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link href="/terms" target="_blank" className="text-primary underline hover:text-primary/80">
                    Оферта
                  </Link>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground leading-tight">
                Архитектура Local-First: все данные хранятся только в вашем браузере. Вы можете в 1 клик удалить все записи (право на забвение по ст. 21 152-ФЗ):
              </p>

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleWipeAllData}
                className="w-full text-xs h-8 cursor-pointer bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>🗑 Удалить все мои данные с устройства</span>
              </Button>
            </div>
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsProfileModalOpen(false)}
              className="text-xs"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-primary text-primary-foreground text-xs font-semibold"
            >
              Сохранить профиль
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
