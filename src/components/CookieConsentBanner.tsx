"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "lp_cookie_consent_v1";

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const consented = localStorage.getItem(STORAGE_KEY);
      if (!consented) {
        // Small delay so it smoothly slides in
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleAccept = () => {
    setIsVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-3 sm:bottom-5 left-3 sm:left-6 right-3 sm:right-6 max-w-2xl mx-auto z-[9990] animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="p-3.5 sm:p-4 rounded-2xl bg-card/95 border border-primary/30 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-foreground">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xs leading-relaxed text-muted-foreground">
            <span className="text-foreground font-semibold">152-ФЗ РФ и локальное хранилище:</span>{" "}
            Мы используем локальное хранилище браузера (localStorage и cookies) для сохранения вашего резюме только на вашем устройстве. Данные не передаются на внешние серверы.{" "}
            <Link href="/privacy" className="text-primary underline hover:text-primary/80">
              Подробнее о защите данных
            </Link>
          </div>
        </div>

        <Button
          size="sm"
          onClick={handleAccept}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs h-8 px-4 cursor-pointer shrink-0 w-full sm:w-auto shadow-sm shadow-primary/20"
        >
          <Check className="w-3.5 h-3.5 mr-1" />
          Понятно
        </Button>
      </div>
    </div>
  );
}
