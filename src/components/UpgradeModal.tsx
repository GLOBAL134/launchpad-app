"use client";

import { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
  CreditCard,
  Lock,
  ArrowRight,
  Loader2,
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

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPlan?: "pro_monthly" | "pro_quarterly";
}

export function UpgradeModal({
  open,
  onOpenChange,
  defaultPlan = "pro_quarterly",
}: UpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"pro_monthly" | "pro_quarterly">(defaultPlan);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/payments/yookassa/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan,
          returnUrl: window.location.href,
        }),
      });

      const data = await res.json();

      if (data.confirmationUrl) {
        if (data.isSimulated) {
          alert("🎉 Тестовый режим ЮKassa: оплата прошла успешно! Статус Pro активирован.");
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
            <div className="text-xl font-black mt-1 text-foreground">
              3 490 ₽
            </div>
            <span className="text-[11px] text-muted-foreground block">
              ~1 163 ₽ в месяц
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
            <div className="text-xl font-black mt-1 text-foreground">
              1 490 ₽
            </div>
            <span className="text-[11px] text-muted-foreground block">
              1 490 ₽ в месяц
            </span>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-2.5 py-3 border-y border-border/60 text-xs">
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
          <div className="flex items-center gap-2 text-foreground">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span><strong>Воронка конверсии:</strong> поиск узких мест в откликах</span>
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
                <span>Оплатить через ЮKassa ({selectedPlan === "pro_quarterly" ? "3 490 ₽" : "1 490 ₽"})</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </>
            )}
          </Button>

          {/* Payment Methods Badges */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Безопасная оплата через ЮKassa</span>
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
