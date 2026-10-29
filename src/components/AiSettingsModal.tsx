"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Check,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Key,
  Cpu,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

interface AiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AiSettingsModal({ isOpen, onClose }: AiSettingsModalProps) {
  const { showToast } = useApp();

  const [groqKey, setGroqKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setGroqKey(localStorage.getItem("lp_groq_api_key") || "");
      setGeminiKey(localStorage.getItem("lp_gemini_api_key") || "");
    }
  }, [isOpen]);

  const handleSaveKeys = async () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lp_groq_api_key", groqKey.trim());
      localStorage.setItem("lp_gemini_api_key", geminiKey.trim());
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-groq-key": groqKey.trim(),
          "x-gemini-key": geminiKey.trim(),
        },
        body: JSON.stringify({
          systemPrompt: "You are an assistant. Answer in one word.",
          userPrompt: "Ping test",
          mode: "ping",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTestResult(`✓ Успешно подключено к провайдеру: ${data.provider || "AI Engine"}`);
        showToast("✓ Настройки нейросети сохранены и проверены!");
      } else {
        setTestResult("⚠️ Запрос обработан локальным резервным ИИ-движком");
        showToast("Настройки сохранены");
      }
    } catch {
      setTestResult("⚠️ Настройки сохранены, активен автономный ИИ-движок");
      showToast("Настройки сохранены");
    } finally {
      setIsTesting(false);
    }
  };

  const handleClearKeys = () => {
    setGroqKey("");
    setGeminiKey("");
    if (typeof window !== "undefined") {
      localStorage.removeItem("lp_groq_api_key");
      localStorage.removeItem("lp_gemini_api_key");
    }
    setTestResult(null);
    showToast("Ключи очищены. Включён встроенный ИИ-движок LaunchPad.");
  };

  const hasCustomKey = Boolean(groqKey.trim() || geminiKey.trim());

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100vw-20px)] sm:max-w-lg max-h-[92vh] overflow-y-auto bg-card border-border shadow-2xl p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span>Настройки нейросети (LLM)</span>
                <Badge
                  variant="outline"
                  className={
                    hasCustomKey
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[9px] sm:text-[10px]"
                      : "bg-blue-500/10 text-blue-400 border-blue-500/30 text-[9px] sm:text-[10px]"
                  }
                >
                  {hasCustomKey ? "Пользовательский API" : "Встроенный ИИ"}
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                Подключите персональный ключ или используйте встроенный ИИ без ключей
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Engine status banner */}
          <div className="p-3.5 rounded-xl border border-border bg-background/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-foreground">
                <Cpu className="w-4 h-4 text-primary" />
                Текущий статус генерации:
              </span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Всегда активен (100% аптайм)
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              LaunchPad AI PRO работает «из коробки» на встроенном умном ИИ-движке карьеры. Если вы хотите максимальную мощность моделей 70B параметров (Llama 3.3 70B или Gemini Flash), вы можете бесплатно выпустить персональный ключ за 30 секунд.
            </p>
          </div>

          {/* Provider 1: Groq API Key (Recommended) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold flex items-center gap-1.5 text-foreground">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                Ключ Groq API (Llama 3.3 70B — Бесплатно)
              </label>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1 text-[11px]"
              >
                <span>Получить бесплатно</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <Input
              type="password"
              placeholder="gsk_..."
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
              className="text-xs font-mono bg-background/80 border-border h-9"
            />
            <p className="text-[10px] text-muted-foreground">
              ⚡ Лимит: до 14 400 запросов в сутки без привязки банковской карты.
            </p>
          </div>

          {/* Provider 2: Google Gemini API Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold flex items-center gap-1.5 text-foreground">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Ключ Google Gemini (Gemini 1.5 Flash — Бесплатно)
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1 text-[11px]"
              >
                <span>Получить бесплатно</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <Input
              type="password"
              placeholder="AIzaSy..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="text-xs font-mono bg-background/80 border-border h-9"
            />
            <p className="text-[10px] text-muted-foreground">
              ⚡ Лимит: 15 запросов в минуту бесплатно через Google AI Studio.
            </p>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-lg text-xs font-medium ${
                testResult.startsWith("✓")
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                  : "bg-amber-500/10 border border-amber-500/30 text-amber-300"
              }`}
            >
              {testResult}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            {hasCustomKey ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearKeys}
                className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
              >
                Очистить ключи
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
                Отмена
              </Button>
              <Button
                size="sm"
                onClick={handleSaveKeys}
                disabled={isTesting}
                className="text-xs bg-primary text-primary-foreground font-semibold flex items-center gap-1.5"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Проверка...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Сохранить настройки</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AiSettingsModal;
