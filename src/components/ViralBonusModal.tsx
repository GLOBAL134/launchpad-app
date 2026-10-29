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
  CheckCircle2,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

interface ViralBonusModalProps {
  isOpen: boolean;
  onClose: () => void;
  beforeScore?: number;
  afterScore?: number;
  targetRole?: string;
}

export function ViralBonusModal({
  isOpen,
  onClose,
  beforeScore = 62,
  afterScore = 94,
  targetRole = "специалиста",
}: ViralBonusModalProps) {
  const { remainingScans, isPro, addBonusScans, showToast } = useApp();
  const [copiedReview, setCopiedReview] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const shareUrl = "https://launchpad-app-ashy.vercel.app/?ref=viral_bonus";
  const actualBefore = beforeScore > 0 ? beforeScore : 62;
  const actualAfter = afterScore >= actualBefore ? afterScore : 94;

  const reviewText = `Прогнал своё резюме через ATS-сканер LaunchPad AI — поднял скор с ${actualBefore}% до ${actualAfter}% за минуту и нашёл скрытые красные флаги работодателя: ${shareUrl}`;

  const handleClaim = () => {
    if (!claimed) {
      addBonusScans(3);
      setClaimed(true);
      showToast("🎉 Вам начислено +3 PRO-проверки резюме в подарок!");
    }
  };

  const handleCopyReview = () => {
    navigator.clipboard.writeText(reviewText);
    setCopiedReview(true);
    handleClaim();
    setTimeout(() => setCopiedReview(false), 3000);
  };

  const handleShareTelegram = () => {
    handleClaim();
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(
      `Прогнал своё резюме через ATS-сканер LaunchPad AI — поднял скор с ${actualBefore}% до ${actualAfter}% за минуту и нашёл красные флаги работодателя:`
    )}`;
    window.open(tgUrl, "_blank", "noopener,noreferrer");
  };

  const handleShareWhatsApp = () => {
    handleClaim();
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      reviewText
    )}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const handleShareVk = () => {
    handleClaim();
    const vkUrl = `https://vk.com/share.php?url=${encodeURIComponent(
      shareUrl
    )}&title=${encodeURIComponent(
      `ATS-аудит резюме: поднял скор с ${actualBefore}% до ${actualAfter}%`
    )}&comment=${encodeURIComponent(reviewText)}`;
    window.open(vkUrl, "_blank", "noopener,noreferrer");
  };

  const handleShareLinkedIn = () => {
    handleClaim();
    const inUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(inUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100vw-20px)] sm:max-w-md max-h-[92vh] overflow-y-auto p-4 sm:p-6 bg-card border-border shadow-2xl backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-md shadow-amber-500/10">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-black flex items-center gap-2">
                <span>Разблокировать +3 PRO-проверки</span>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] font-bold"
                >
                  Бесплатно
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Поделитесь сервисом с коллегами или друзьями в поиске работы
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Real Score Improvement Banner */}
          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-card to-card space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-foreground">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Ваш прогресс оптимизации</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-300">
                {actualBefore}% → {actualAfter}% ATS
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Ваше резюме проходит фильтры корпоративных ATS-роботов и оцифровано по формуле Google X-Y-Z.
            </p>
          </div>

          {/* Balance status */}
          <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs font-semibold text-foreground">Текущий баланс проверок</p>
                <p className="text-[11px] text-muted-foreground">
                  {isPro
                    ? "У вас безлимитный PRO доступ"
                    : `Осталось бесплатных проверок: ${remainingScans}`}
                </p>
              </div>
            </div>
            {claimed ? (
              <Badge className="bg-emerald-500 text-white text-xs font-bold shadow-sm">
                +3 начислено!
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-amber-500/10 text-amber-300 border-amber-500/30 text-xs font-bold"
              >
                +3 в подарок
              </Badge>
            )}
          </div>

          {/* Ready-to-share review box */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground flex items-center justify-between">
              <span className="flex items-center gap-1 text-foreground">
                <MessageSquare className="w-3.5 h-3.5 text-primary" />
                Готовый текст отзыва (скопировать в 1 клик):
              </span>
              <span className="text-[10px] text-emerald-400">Мгновенный бонус</span>
            </label>
            <div className="p-3 rounded-xl bg-background/80 border border-border/80 text-xs text-foreground/90 font-sans leading-relaxed">
              «{reviewText}»
            </div>

            <Button
              onClick={handleCopyReview}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs h-9 cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
            >
              {copiedReview ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Текст отзыва скопирован! +3 проверки начислены</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Скопировать готовый текст отзыва (+3 проверки)</span>
                </>
              )}
            </Button>
          </div>

          {/* 4 Social 1-Click Share Buttons */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-muted-foreground block">
              Или поделитесь напрямую в 1 клик:
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleShareTelegram}
                className="p-2.5 rounded-xl bg-[#24A1DE]/15 hover:bg-[#24A1DE]/25 border border-[#24A1DE]/40 text-[#24A1DE] text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Telegram</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="p-2.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </button>

              <button
                onClick={handleShareVk}
                className="p-2.5 rounded-xl bg-[#0077FF]/15 hover:bg-[#0077FF]/25 border border-[#0077FF]/40 text-[#0077FF] text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>ВКонтакте</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </button>

              <button
                onClick={handleShareLinkedIn}
                className="p-2.5 rounded-xl bg-[#0A66C2]/15 hover:bg-[#0A66C2]/25 border border-[#0A66C2]/40 text-[#0A66C2] text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </button>
            </div>
          </div>

          {claimed && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center animate-in fade-in">
              <p className="text-xs text-emerald-300 font-semibold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Бонус активирован! +3 проверки уже на вашем балансе.
              </p>
            </div>
          )}

          <div className="flex justify-end pt-1">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
