"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Briefcase } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function UserProfileModal() {
  const { userProfile, updateUserProfile, isProfileModalOpen, setIsProfileModalOpen } = useApp();

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [title, setTitle] = useState(userProfile.title);

  useEffect(() => {
    setName(userProfile.name);
    setEmail(userProfile.email);
    setPhone(userProfile.phone);
    setTitle(userProfile.title);
  }, [userProfile, isProfileModalOpen]);

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
      <DialogContent className="sm:max-w-md bg-card border-border text-foreground">
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
