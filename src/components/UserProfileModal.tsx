"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Briefcase, Download, Upload, ShieldCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function UserProfileModal() {
  const {
    userProfile,
    updateUserProfile,
    isProfileModalOpen,
    setIsProfileModalOpen,
    exportBackupData,
    importBackupData,
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
      name: name.trim() || "Алексей Морозов",
      email: email.trim() || "alex@launchpad.ru",
      phone: phone.trim() || "+7 (999) 123-45-67",
      title: title.trim() || "Product Manager",
    });
    setIsProfileModalOpen(false);
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
