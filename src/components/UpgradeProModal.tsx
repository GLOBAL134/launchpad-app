'use client';

import React, { useState } from 'react';
import { TRIBUTE_LINKS, verifyAndActivateProKey } from '../lib/monetization';

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
  const [promoCode, setPromoCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleActivateCode = (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError(null);
    if (verifyAndActivateProKey(promoCode)) {
      onActivated();
      onClose();
    } else {
      setCodeError('Неверный ключ активации. Введите LP_PRO_2026 или START30_PRO.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl bg-slate-900 border border-indigo-500/40 p-4 sm:p-8 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            🚀 LaunchPad AI PRO — Полный доступ
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
            🏷️ START30 (-30%)
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Проходите ATS-фильтры с первого раза
        </h3>

        {reasonMessage ? (
          <p className="text-xs sm:text-sm text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-4">
            {reasonMessage}
          </p>
        ) : (
          <p className="text-xs sm:text-sm text-slate-400 mb-5">
            Промокод <span className="font-mono text-indigo-300 font-bold">START30</span> активирован: скидка 30% на безлимитный анализ резюме, генерацию писем и трекинг вакансий!
          </p>
        )}

        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200 mb-6">
          <li className="flex items-start gap-2.5">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Безлимитные детерминированные ATS-аудиты резюме с проверкой по цитатам</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Генерация сопроводительных писем без галлюцинаций ИИ (на русском и английском)</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Точечное усиление слабых строчек резюме по формуле результата (XYZ)</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Полный доступ к Канбан-трекеру откликов и экспорту документов</span>
          </li>
        </ul>

        <div className="space-y-3 mb-6">
          <a
            href={TRIBUTE_LINKS.WEB_CHECKOUT}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            💳 Оплатить картой в браузере (МИР / СБП / Visa / Mastercard)
          </a>

          <a
            href={TRIBUTE_LINKS.TG_APP_CHECKOUT}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer"
          >
            ✈ Оплатить через Telegram / Stars
          </a>
        </div>

        <form onSubmit={handleActivateCode} className="pt-4 border-t border-slate-800 space-y-2">
          <label className="block text-xs text-slate-400">
            Уже оформили подписку? Введите ваш PRO-ключ активации:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Например: LP_PRO_2026 или START30_PRO"
              className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs sm:text-sm text-white focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs sm:text-sm font-semibold text-white transition cursor-pointer"
            >
              Активировать
            </button>
          </div>
          {codeError && (
            <p className="text-xs text-rose-400">{codeError}</p>
          )}
        </form>
      </div>
    </div>
  );
}
