'use client';

import React, { useState } from 'react';
import {
  Check,
  Sparkles,
  ShieldCheck,
  Zap,
  Flame,
  FileDown,
  Target,
  DollarSign,
  Clock,
  ArrowRight,
  Gift,
  Loader2,
} from 'lucide-react';
import {
  MONETIZATION_PLANS,
  TRIBUTE_LINKS,
  verifyAndActivateProKey,
  checkDiscountPromoCode,
  PlanOption,
} from '../lib/monetization';
import { Button } from '@/components/ui/button';

interface UpgradeProModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivated: () => void;
  reasonMessage?: string;
}

export default function UpgradeProModal({
  isOpen,
  onClose,
  onActivated,
  reasonMessage,
}: UpgradeProModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<'turbo_24h' | 'offer_pro_30d'>('offer_pro_30d');
  const [promoCode, setPromoCode] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      return p.get('promo') || p.get('promocode') || p.get('code') || '';
    }
    return '';
  });
  const [codeError, setCodeError] = useState<string | null>(null);
  const [codeSuccess, setCodeSuccess] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  if (!isOpen) return null;

  const handleActivateCode = (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError(null);
    setCodeSuccess(null);

    const trimmed = promoCode.trim().toUpperCase();

    // 1. Проверяем скидочные промокоды из наших рекламных видео в Reels/TikTok (START30)
    const discountCheck = checkDiscountPromoCode(trimmed);
    if (discountCheck.valid && discountCheck.checkoutUrl) {
      setCodeSuccess(
        discountCheck.message ||
          '🎉 Промокод START30 успешно применен! Скидка 30% активирована: 490 ₽ вместо 690 ₽. Перенаправляем к оплате...'
      );
      setTimeout(() => {
        window.open(discountCheck.checkoutUrl, '_blank', 'noopener,noreferrer');
      }, 1200);
      return;
    }

    // 2. Проверяем ключи активации PRO после оплаты (TRIBUTE_VIP_990 / ADMIN777)
    if (verifyAndActivateProKey(trimmed)) {
      if (trimmed === 'ADMIN777') {
        setCodeSuccess('🎉 Секретный код владельца принят! Безлимитный PRO активирован!');
      } else {
        setCodeSuccess('🎉 Ключ активации успешно применён! PRO активирован!');
      }
      setTimeout(() => {
        onActivated();
        onClose();
      }, 1000);
    } else {
      setCodeError('Неверный промокод или ключ активации. Введите промокод START30 или ключ после оплаты.');
    }
  };

  const handleCheckout = async (plan: PlanOption) => {
    setIsProcessingPayment(true);
    try {
      // 1. Try YooKassa API checkout
      const res = await fetch('/api/payments/yookassa/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          returnUrl: typeof window !== 'undefined' ? `${window.location.origin}/scanner?payment=success&plan=${plan.id}` : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.confirmationUrl) {
          window.location.href = data.confirmationUrl;
          return;
        }
      }

      // 2. Direct payment link fallback (Tribute / YooMoney)
      const directUrl = `${TRIBUTE_LINKS.WEB_CHECKOUT}?plan=${plan.id}&amount=${plan.priceRub}`;
      window.open(directUrl, '_blank');
    } catch {
      window.open(TRIBUTE_LINKS.WEB_CHECKOUT, '_blank');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[94vh] overflow-y-auto rounded-3xl bg-slate-950 border border-indigo-500/40 p-5 sm:p-7 shadow-2xl text-slate-100 space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer z-10"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>LaunchPad AI PRO</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
              Разовый платёж без автосписаний
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
            Инвестиция в оффер: выберите ваш тариф
          </h3>

          {reasonMessage ? (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{reasonMessage}</span>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-slate-400">
              ATS-роботы отсекают 80% резюме. Получите адаптированное резюме 90%+, шпаргалку к интервью и скрипт торга по зарплате.
            </p>
          )}
        </div>

        {/* 2 Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MONETIZATION_PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const isFeatured = plan.recommended;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`relative rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all cursor-pointer border ${
                  isSelected
                    ? isFeatured
                      ? 'bg-gradient-to-b from-indigo-950/80 to-slate-900 border-indigo-500 ring-2 ring-indigo-500/30 shadow-xl shadow-indigo-500/10'
                      : 'bg-slate-900 border-primary ring-2 ring-primary/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Featured Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold text-[10px] shadow-md uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    <span>{plan.badge}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="text-sm sm:text-base font-bold text-white flex items-center justify-between">
                      <span>{plan.name}</span>
                      <span className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px]">
                        {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-400" />}
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="pt-1 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                      {plan.priceRub} ₽
                    </span>
                    {plan.oldPriceRub && (
                      <span className="text-xs text-slate-500 line-through font-mono">
                        {plan.oldPriceRub} ₽
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-sans">
                      / {plan.periodLabel}
                    </span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Select / Pay Button */}
                <div className="pt-4 mt-2">
                  {plan.id === 'offer_pro_30d' ? (
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(TRIBUTE_LINKS.WEB_CHECKOUT, '_blank', 'noopener,noreferrer');
                        }}
                        className="w-full font-bold text-xs h-9 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white shadow-md shadow-emerald-500/20 cursor-pointer"
                      >
                        💳 Оплатить картой (490 ₽)
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(TRIBUTE_LINKS.TG_APP_CHECKOUT, '_blank', 'noopener,noreferrer');
                        }}
                        className="w-full text-center text-xs font-semibold text-indigo-300 hover:text-white transition py-1 cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span>✈️ Оплатить через Telegram / Stars</span>
                      </button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCheckout(plan);
                      }}
                      disabled={isProcessingPayment}
                      className="w-full font-bold text-xs h-9 cursor-pointer transition shadow-md bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                    >
                      {isProcessingPayment && selectedPlanId === plan.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          Переход к оплате...
                        </>
                      ) : (
                        <>
                          <span>Выбрать Турбо-Старт (290 ₽)</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tribute Direct Checkout Buttons for PRO */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/30 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Тариф PRO (на 30 дней): 490 ₽
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold">
              Мгновенная выдача доступа
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={() => window.open(TRIBUTE_LINKS.WEB_CHECKOUT, '_blank', 'noopener,noreferrer')}
              className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              <span>💳 Оплатить картой в браузере (МИР / СБП / Visa / Mastercard)</span>
            </button>
            <button
              type="button"
              onClick={() => window.open(TRIBUTE_LINKS.TG_APP_CHECKOUT, '_blank', 'noopener,noreferrer')}
              className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-indigo-500/40 hover:border-indigo-400 text-indigo-200 hover:text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 text-center"
            >
              <span>✈️ Оплатить через Telegram / Stars</span>
            </button>
          </div>
        </div>

        {/* Promo code & Owner Secret Key activation */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <form onSubmit={handleActivateCode} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] text-slate-300 font-semibold flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-indigo-400" />
                <span>Промокод на скидку или ключ активации PRO</span>
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Промокод (START30) или ключ активации..."
                className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white uppercase placeholder:normal-case placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none font-mono"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 h-9 cursor-pointer shrink-0"
              >
                Применить
              </Button>
            </div>

            {codeError && (
              <p className="text-[11px] text-rose-400 animate-in fade-in">{codeError}</p>
            )}
            {codeSuccess && (
              <p className="text-[11px] text-emerald-400 font-semibold animate-in fade-in">{codeSuccess}</p>
            )}
          </form>
        </div>

        {/* Guarantees Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Безопасная оплата через ЮKassa / СБП / Карты РФ</span>
          </div>
          <div className="text-slate-500">
            Никаких скрытых списаний • Разовый платёж
          </div>
        </div>
      </div>
    </div>
  );
}
