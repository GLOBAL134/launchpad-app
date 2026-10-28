"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
  CreditCard,
  Lock,
  ArrowRight,
  Loader2,
  Tag,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPlan?: "pro_monthly" | "pro_quarterly";
  initialPromoCode?: string;
}

const DISCOUNTS: Record<string, number> = {
  START30: 0.3,
  RADAR20: 0.2,
  LAUNCH30: 0.3,
  OFFER50: 0.5,
};

export function UpgradeModal({
  open,
  onOpenChange,
  defaultPlan = "pro_quarterly",
  initialPromoCode = "",
}: UpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"pro_monthly" | "pro_quarterly">(defaultPlan);
  const [promoInput, setPromoInput] = useState(initialPromoCode);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(initialPromoCode ? initialPromoCode.toUpperCase() : null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSelectedPlan(defaultPlan);
    if (initialPromoCode) {
      setPromoInput(initialPromoCode);
      setAppliedPromo(initialPromoCode.toUpperCase());
    }
  }, [defaultPlan, initialPromoCode, open]);

  const basePrices = {
    pro_monthly: 1490,
    pro_quarterly: 3490,
  };

  const currentDiscountRate = appliedPromo && DISCOUNTS[appliedPromo] ? DISCOUNTS[appliedPromo] : 0;
  const currentBasePrice = basePrices[selectedPlan];
  const finalPrice = Math.round(currentBasePrice * (1 - currentDiscountRate));

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setAppliedPromo(null);
      setPromoError(null);
      return;
    }

    if (DISCOUNTS[code]) {
      setAppliedPromo(code);
      setPromoError(null);
    } else {
      setAppliedPromo(null);
      setPromoError("Неверный промокод (попробуйте START30)");
    }
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/payments/yookassa/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan,
          promoCode: appliedPromo,
          returnUrl: window.location.href,
        }),
      });

      const data = await res.json();

      if (data.confirmationUrl) {
        if (data.isSimulated) {
          alert(`🎉 Тестовый режим ЮKassa: оплата ${data.finalPrice} ₽ прошла успешно! Статус Pro активирован.`);
          onOpenChange(false);
          // Set local pro status in browser
          localStorage.setItem("launchpad_pro", "true");
          window.location.reload();
        } else {
          // Redirect to real YooKassa payment gateway
          window.location.href = data.confirmationUrl;
        }
      } else {
        alert(data.error || "Не удалось инициализировать оплату");
      }
    } catch (err: any) {
      alert("Ошибка соединения с платёжным шлюзом");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border p-6">
        <DialogHeader className="text-left space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30 w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LaunchPad Pro</span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-black text-foreground">
            Получите в 3x больше приглашений на интервью
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Оптимизируйте резюме под роботов ATS, автоматизируйте отклики и опережайте 95% конкурентов.
          </DialogDescription>
        </DialogHeader>

        {/* Plan Selection Cards */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* 3 Months (Best Value) */}
          <div
            onClick={() => setSelectedPlan("pro_quarterly")}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all relative ${
              selectedPlan === "pro_quarterly"
                ? "border-primary bg-primary/10 shadow-md shadow-primary/10 ring-2 ring-primary/40"
                : "border-border bg-card/60 hover:border-border/80"
            }`}
          >
            <div className="absolute -top-2.5 right-3 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full uppercase tracking-wider">
              Выгода 30%
            </div>
            <span className="text-xs font-bold block text-foreground">3 месяца (Сезон)</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-black text-foreground">
                {currentDiscountRate > 0 ? Math.round(3490 * (1 - currentDiscountRate)) : 3490} ₽
              </span>
              {currentDiscountRate > 0 && (
                <span className="text-xs line-through text-muted-foreground">3 490 ₽</span>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground block">
              ~{Math.round((currentDiscountRate > 0 ? Math.round(3490 * (1 - currentDiscountRate)) : 3490) / 3)} ₽ в месяц
            </span>
          </div>

          {/* 1 Month */}
          <div
            onClick={() => setSelectedPlan("pro_monthly")}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all relative ${
              selectedPlan === "pro_monthly"
                ? "border-primary bg-primary/10 shadow-md shadow-primary/10 ring-2 ring-primary/40"
                : "border-border bg-card/60 hover:border-border/80"
            }`}
          >
            <span className="text-xs font-bold block text-foreground">1 месяц</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-black text-foreground">
                {currentDiscountRate > 0 ? Math.round(1490 * (1 - currentDiscountRate)) : 1490} ₽
              </span>
              {currentDiscountRate > 0 && (
                <span className="text-xs line-through text-muted-foreground">1 490 ₽</span>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground block">
              Ежемесячный доступ
            </span>
          </div>
        </div>

        {/* Promo Code Input */}
        <div className="pt-1">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Промокод (например START30)"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="pl-8 text-xs h-9 uppercase font-mono tracking-wider bg-background/50"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleApplyPromo}
              className="h-9 text-xs px-3"
            >
              Применить
            </Button>
          </div>
          {appliedPromo && (
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <Check className="w-3.5 h-3.5" />
              <span>Промокод {appliedPromo} применён: скидка {Math.round(currentDiscountRate * 100)}%!</span>
            </div>
          )}
          {promoError && (
            <p className="mt-1 text-xs text-red-400">{promoError}</p>
          )}
        </div>

        {/* Feature Highlights */}
        <div className="space-y-2 py-2.5 border-y border-border/60 text-xs">
          <div className="flex items-center gap-2 text-foreground">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span><strong>Безлимитный AI ATS-сканер</strong> для любых вакансий и резюме</span>
          </div>
          <div className="flex items-center gap-2 text-foreground">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span><strong>Загрузка реальных PDF и DOCX</strong> файлов без ограничений</span>
          </div>
          <div className="flex items-center gap-2 text-foreground">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span><strong>Cover Letter Studio:</strong> персонализированные письма за 10 секунд</span>
          </div>
          <div className="flex items-center gap-2 text-foreground">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span><strong>Умный Follow-Up:</strong> напоминания и шаблоны писем рекрутерам</span>
          </div>
        </div>

        {/* Payment CTA */}
        <div className="space-y-3">
          <Button
            size="lg"
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm h-11 shadow-lg shadow-primary/25"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Переход к оплате в ЮKassa...
              </>
            ) : (
              <>
                <span>Оплатить через ЮKassa ({finalPrice} ₽)</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </>
            )}
          </Button>

          {/* Payment Methods Badges */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Официальный платёж ЮKassa (54-ФЗ)</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-semibold text-foreground/80">
              <span className="px-1.5 py-0.5 rounded bg-muted">СБП</span>
              <span className="px-1.5 py-0.5 rounded bg-muted">SberPay</span>
              <span className="px-1.5 py-0.5 rounded bg-muted">Мир</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
