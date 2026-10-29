"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Lock,
  Briefcase,
  Sparkles,
  ArrowRight,
  Eye,
  X,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

interface AuthGateModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  canCloseWithoutAuth?: boolean;
}

export default function AuthGateModal({
  isOpen,
  onClose,
  canCloseWithoutAuth,
}: AuthGateModalProps) {
  const router = useRouter();
  const {
    login,
    loginDemo,
    authSession,
    authModalDefaultTab,
    isAuthModalOpen,
    setIsAuthModalOpen,
  } = useApp();

  const effectiveOpen = isOpen !== undefined ? isOpen : isAuthModalOpen;
  const allowClose = canCloseWithoutAuth !== undefined ? canCloseWithoutAuth : !!authSession;

  const [activeTab, setActiveTab] = useState<"register" | "login">(
    authModalDefaultTab || "register"
  );

  useEffect(() => {
    if (authModalDefaultTab) {
      setActiveTab(authModalDefaultTab);
    }
  }, [authModalDefaultTab, isAuthModalOpen]);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("Product Manager / IT-специалист");
  const [password, setPassword] = useState("");
  const [seedDemoJobs, setSeedDemoJobs] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTabChange = (tab: "register" | "login") => {
    setActiveTab(tab);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setErrorMessage("Пожалуйста, укажите корректный рабочий Email");
      return;
    }

    if (activeTab === "register") {
      const trimmedName = name.trim();
      if (!trimmedName || trimmedName.length < 2) {
        setErrorMessage("Пожалуйста, укажите ваше имя и фамилию (например, Дмитрий Смирнов)");
        return;
      }

      login({
        name: trimmedName,
        email: trimmedEmail,
        title: title.trim() || "Product Manager / IT-специалист",
        seedDemoJobs: seedDemoJobs,
        isFirstTime: true,
      });
    } else {
      // Login mode
      const trimmedName = name.trim() || trimmedEmail.split("@")[0] || "Пользователь";
      login({
        name: trimmedName,
        email: trimmedEmail,
        title: title.trim() || "Product Manager / IT-специалист",
        seedDemoJobs: seedDemoJobs,
        isFirstTime: false,
      });
    }

    if (onClose) onClose();
    setIsAuthModalOpen(false);
  };

  const handleDemoMode = () => {
    loginDemo();
    if (onClose) onClose();
    setIsAuthModalOpen(false);
  };

  const handleDismiss = () => {
    if (allowClose) {
      if (onClose) onClose();
      setIsAuthModalOpen(false);
    } else {
      if (onClose) onClose();
      setIsAuthModalOpen(false);
      router.push("/");
    }
  };

  return (
    <Dialog open={effectiveOpen} onOpenChange={(open) => !open && handleDismiss()}>
      <DialogContent
        className="sm:max-w-md p-0 overflow-hidden bg-card/95 border border-border/80 shadow-2xl backdrop-blur-2xl text-foreground"
      >
        {/* Header Ambient Glow & Brand */}
        <div className="relative p-6 pb-4 bg-gradient-to-b from-primary/15 via-primary/5 to-transparent border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-primary/30 shrink-0 border border-white/10">
                <Image
                  src="/logo.png"
                  alt="LaunchPad AI PRO"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base tracking-tight text-foreground">
                    LaunchPad
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-primary px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                    AI PRO
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Персональный командный центр соискателя
                </p>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition cursor-pointer"
              title={allowClose ? "Закрыть" : "Вернуться на главную"}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="mt-5 grid grid-cols-2 p-1 rounded-xl bg-background/80 border border-border/60">
            <button
              type="button"
              onClick={() => handleTabChange("register")}
              className={`py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "register"
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Создать кабинет</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("login")}
              className={`py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "login"
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Войти</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <span className="shrink-0 text-sm">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Name & Surname */}
          {activeTab === "register" && (
            <div>
              <Label
                htmlFor="auth-name"
                className="text-xs font-semibold flex items-center gap-1.5 mb-1.5 text-foreground"
              >
                <User className="w-3.5 h-3.5 text-primary" />
                <span>Ваше имя и фамилия *</span>
              </Label>
              <Input
                id="auth-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например: Дмитрий Смирнов"
                required
                className="text-xs h-9 bg-background/60"
              />
              <span className="text-[10px] text-muted-foreground mt-1 block">
                Будет использоваться в подписи писем и приветствии в дашборде
              </span>
            </div>
          )}

          {/* 2. Work Email */}
          <div>
            <Label
              htmlFor="auth-email"
              className="text-xs font-semibold flex items-center gap-1.5 mb-1.5 text-foreground"
            >
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span>Рабочий Email *</span>
            </Label>
            <Input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="dmitry@company.ru"
              required
              className="text-xs h-9 bg-background/60"
            />
          </div>

          {/* 3. Target Position (Register only) */}
          {activeTab === "register" && (
            <div>
              <Label
                htmlFor="auth-title"
                className="text-xs font-semibold flex items-center gap-1.5 mb-1.5 text-foreground"
              >
                <Briefcase className="w-3.5 h-3.5 text-primary" />
                <span>Целевая должность</span>
              </Label>
              <Input
                id="auth-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product Manager / IT-специалист"
                className="text-xs h-9 bg-background/60"
              />
            </div>
          )}

          {/* 4. Password */}
          <div>
            <Label
              htmlFor="auth-password"
              className="text-xs font-semibold flex items-center gap-1.5 mb-1.5 text-foreground"
            >
              <Lock className="w-3.5 h-3.5 text-primary" />
              <span>Пароль для защиты профиля</span>
            </Label>
            <Input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="text-xs h-9 bg-background/60"
            />
          </div>

          {/* Seed Demo Checkbox (Register only) */}
          {activeTab === "register" && (
            <div className="p-3 rounded-xl border border-border/70 bg-background/50 space-y-1.5">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={seedDemoJobs}
                  onChange={(e) => setSeedDemoJobs(e.target.checked)}
                  className="mt-0.5 rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-semibold text-foreground block">
                    Загрузить примеры тестовых вакансий для знакомства с интерфейсом
                  </span>
                  <span className="text-[11px] text-muted-foreground block mt-0.5">
                    {seedDemoJobs
                      ? "В Канбан будут добавлены 10 готовых карточек (Яндекс, Т-Банк, Авито, Ozon и др.)."
                      : "Вы начнёте с полностью чистого собственного Канбан-трекера (0 карточек)."}
                  </span>
                </div>
              </label>
            </div>
          )}

          {/* Primary Submit Button */}
          <Button
            type="submit"
            className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs shadow-lg shadow-primary/25 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{activeTab === "register" ? "Создать личный кабинет" : "Войти в командный центр"}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          {/* Divider */}
          <div className="relative my-3 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-card px-2 text-muted-foreground font-semibold">или</span>
            </div>
          </div>

          {/* Secondary Button: Demo Mode */}
          <Button
            type="button"
            variant="outline"
            onClick={handleDemoMode}
            className="w-full h-9 border-border/80 hover:bg-muted/60 text-xs font-semibold cursor-pointer flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>👀 Открыть демо-режим без регистрации (пример кабинета)</span>
          </Button>
        </form>

        {/* Footer Guarantee */}
        <div className="px-6 py-3 bg-muted/20 border-t border-border/40 text-[10px] text-muted-foreground text-center">
          Данные хранятся локально в вашем браузере • Безопасный изолированный контекст
        </div>
      </DialogContent>
    </Dialog>
  );
}