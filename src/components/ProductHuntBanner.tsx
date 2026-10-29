"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Copy, Check, ExternalLink, X, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductHuntBannerProps {
  onOpenUpgrade: () => void;
  onToast: (msg: string) => void;
}

export default function ProductHuntBanner({
  onOpenUpgrade,
  onToast,
}: ProductHuntBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = sessionStorage.getItem("lp_ph_banner_dismissed");
      if (dismissed === "true") {
        setIsVisible(false);
      }
    }
  }, []);

  if (!isVisible) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText("START30");
    setCopied(true);
    onToast("Промокод START30 скопирован в буфер обмена!");
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("lp_ph_banner_dismissed", "true");
    }
  };

  return (
    <div className="relative z-50 bg-gradient-to-r from-amber-500/20 via-primary/30 to-rose-500/20 border-b border-primary/30 px-3 sm:px-4 py-2 text-foreground text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Text */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-left min-w-0">
          <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] sm:text-[11px] border border-amber-500/30 shrink-0">
            <Flame className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Product Hunt</span>
            <span className="sm:hidden">PRO</span>
          </span>
          <span className="text-[11px] sm:text-xs text-slate-200 truncate">
            Скидка <strong>30%</strong> с кодом{" "}
            <code className="font-mono px-1 py-0.2 rounded bg-background/80 text-amber-300 font-bold border border-border">
              START30
            </code>
          </span>
        </div>

        {/* Buttons & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={handleCopyCode}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-background/80 hover:bg-background border border-border text-[11px] font-semibold text-slate-200 hover:text-white transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Скопировано!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-amber-400" />
                <span>Скопировать START30</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenUpgrade}
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-primary text-white font-bold text-[10px] sm:text-[11px] shadow hover:opacity-90 transition cursor-pointer shrink-0"
          >
            <Sparkles className="w-3 h-3 shrink-0" />
            <span className="hidden sm:inline">Активировать PRO</span>
            <span className="sm:hidden">-30% PRO</span>
          </button>

          <button
            onClick={handleDismiss}
            aria-label="Закрыть баннер"
            className="p-1 rounded-md text-muted-foreground hover:text-foreground transition cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
