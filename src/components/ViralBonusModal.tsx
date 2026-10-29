"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Gift,
  Copy,
  Check,
  Share2,
  Sparkles,
  ExternalLink,
  Users,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

interface ViralBonusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ViralBonusModal({ isOpen, onClose }: ViralBonusModalProps) {
  const { remainingScans, isPro, addBonusScans, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const shareUrl = "https://launchpad-app-ashy.vercel.app/?ref=bonus";
  const shareMessage =
    "Привет! Нашёл крутой бесплатный ATS-сканер резюме для любых профессий LaunchPad AI PRO. Он находит скрытые ошибки в резюме и показывает, почему рекрутеры не зовут на собеседования: " +
    shareUrl;

  const handleClaim = () => {
    if (!claimed) {
      addBonusScans(3);
      setClaimed(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareMessage);
    setCopied(true);
    handleClaim();
    showToast("Ссылка скопирована! +3 проверки начислены 🎉");
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareTelegram = () => {
    handleClaim();
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(
      "Привет! Нашёл крутой бесплатный ATS-сканер резюме LaunchPad AI PRO. Проверь совпадение своего резюме с вакансией:"
    )}`;
    window.open(tgUrl, "_blank", "noopener,noreferrer");
  };

  const handleShareWhatsApp = () => {
    handleClaim();
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      shareMessage
    )}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                Бонус: +3 PRO-проверки
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]"
                >
                  Мгновенно
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Поделитесь сервисом с коллегой или другом в поиске работы
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Status banner */}
          <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs font-semibold">Ваш текущий баланс проверок</p>
                <p className="text-[11px] text-muted-foreground">
                  {isPro
                    ? "У вас безлимитный PRO доступ"
                    : `Осталось проверок: ${remainingScans}`}
                </p>
              </div>
            </div>
            {claimed ? (
              <Badge className="bg-emerald-500 text-white text-xs">
                +3 начислено!
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-amber-500/10 text-amber-300 border-amber-500/30 text-xs"
              >
                +3 в подарок
              </Badge>
            )}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Мы развиваем LaunchPad AI без корпоративных бюджетов. Если сервис помогает
            вам — отправьте ссылку коллеге или другу в поиске работы. В благодарность
            мы сразу начислим 3 дополнительные глубокие проверки резюме.
          </p>

          {/* Quick share buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              onClick={handleShareTelegram}
              className="w-full bg-[#24A1DE] hover:bg-[#208fca] text-white text-xs font-medium h-10 gap-2 cursor-pointer shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              В Telegram
              <ExternalLink className="w-3 h-3 opacity-70" />
            </Button>

            <Button
              onClick={handleShareWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-medium h-10 gap-2 cursor-pointer shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              В WhatsApp
              <ExternalLink className="w-3 h-3 opacity-70" />
            </Button>
          </div>

          {/* Copy custom link */}
          <div className="pt-1">
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-muted/40 border border-border text-xs px-3 py-2 rounded-lg font-mono text-muted-foreground select-all focus:outline-none"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-1.5 shrink-0 text-xs cursor-pointer h-9"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Скопировано
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Копировать
                  </>
                )}
              </Button>
            </div>
          </div>

          {claimed && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
              <p className="text-xs text-emerald-300 font-medium flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Бонус успешно применён! Проверки уже доступны в сканере.
              </p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
