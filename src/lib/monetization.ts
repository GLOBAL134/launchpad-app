export const TRIBUTE_LINKS = {
  WEB_CHECKOUT: 'https://web.tribute.tg/p/ICg',
  TG_APP_CHECKOUT: 'https://t.me/tribute/app?startapp=pICg',
  // Direct payment link (ЮMoney / Банковская карта РФ / СБП)
  YOOMONEY_CHECKOUT: 'https://yoomoney.ru/to/4100118580210283',
};

export const VALID_PRO_KEYS = [
  'TRIBUTE_VIP_990', // Персональный ключ покупателя после оплаты в Tribute
  'TRIBUTE_PRO_990',
  'ADMIN777',        // Закрытый ключ владельца
];

// Рекламные промокоды со скидкой из Reels/TikTok (не активируют бесплатный PRO, а ведут на скидочную оплату)
export const DISCOUNT_PROMO_CODES: Record<
  string,
  {
    code: string;
    discountPercent: number;
    message: string;
    checkoutUrl: string;
  }
> = {
  START30: {
    code: 'START30',
    discountPercent: 30,
    message:
      '🎉 Промокод START30 успешно применен! Скидка 30% активирована: 490 ₽ вместо 690 ₽. Перенаправляем к оплате...',
    checkoutUrl: 'https://web.tribute.tg/p/ICg',
  },
};

export const FREE_SCAN_LIMIT = 2;
export const FREE_AI_REWRITE_LIMIT = 1;

export interface PlanOption {
  id: 'turbo_24h' | 'offer_pro_30d';
  name: string;
  tagline: string;
  badge?: string;
  priceRub: number;
  oldPriceRub: number;
  periodLabel: string;
  features: string[];
  recommended?: boolean;
}

export const MONETIZATION_PLANS: PlanOption[] = [
  {
    id: 'turbo_24h',
    name: 'Турбо-Старт (24 часа)',
    tagline: 'Разовый платеж без подписок и автосписаний',
    priceRub: 290,
    oldPriceRub: 490,
    periodLabel: 'доступ на 24 часа',
    features: [
      'Скачивание резюме в Word (.docx) без ограничений',
      'Печать и сохранение в гарвардский PDF',
      '15 AI-адаптаций опыта под целевые вакансии',
      'Генератор сопроводительных писем',
      'Сертификат прохождения ATS-аудита',
    ],
  },
  {
    id: 'offer_pro_30d',
    name: 'Оффер под ключ (30 дней PRO)',
    tagline: 'Хит продаж — полный арсенал для быстрого выхода на оффер',
    badge: '🔥 Хит продаж',
    priceRub: 490,
    oldPriceRub: 990,
    periodLabel: '30 дней полного безлимита',
    recommended: true,
    features: [
      'Полный БЕЗЛИМИТ на все функции сканера и ИИ',
      '🎯 ИИ-шпаргалка к собеседованию (3 каверзных вопроса + STAR-ответы)',
      '💰 Скрипт торга по зарплате (+20–25% к офферу для HR)',
      '🚩 Вирусный «Рентген вакансии» с расшифровкой боли босса',
      'Скачивание Word (.docx) и PDF в 1 клик',
      'Канбан-трекер откликов + Центр Follow-Up напоминаний',
    ],
  },
];

const STORAGE_PRO_FLAG = 'launchpad_pro_active_v1';
const STORAGE_SCAN_COUNT = 'launchpad_free_scans_used_v1';
const STORAGE_BONUS_SCANS = 'launchpad_bonus_scans_v1';
const STORAGE_REWRITE_COUNT = 'launchpad_free_rewrites_used_v1';

export function isUserPro(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_PRO_FLAG) === 'true';
}

export function getFreeScansUsed(): number {
  if (typeof window === 'undefined') return 0;
  return Number(localStorage.getItem(STORAGE_SCAN_COUNT) || '0');
}

export function getBonusScans(): number {
  if (typeof window === 'undefined') return 0;
  return Number(localStorage.getItem(STORAGE_BONUS_SCANS) || '0');
}

export function addBonusScans(count: number): void {
  if (typeof window === 'undefined') return;
  const current = getBonusScans();
  localStorage.setItem(STORAGE_BONUS_SCANS, String(current + count));
}

export function getRemainingFreeScans(): number {
  if (isUserPro()) return Infinity;
  const bonus = getBonusScans();
  return Math.max(0, (FREE_SCAN_LIMIT + bonus) - getFreeScansUsed());
}

export function incrementScanUsage(): void {
  if (typeof window === 'undefined' || isUserPro()) return;
  const current = getFreeScansUsed();
  localStorage.setItem(STORAGE_SCAN_COUNT, String(current + 1));
}

// AI Resume Rewrite usage limits (Free users get exactly 1 free trial improvement)
export function getFreeRewritesUsed(): number {
  if (typeof window === 'undefined') return 0;
  return Number(localStorage.getItem(STORAGE_REWRITE_COUNT) || '0');
}

export function incrementRewriteUsage(): void {
  if (typeof window === 'undefined' || isUserPro()) return;
  const current = getFreeRewritesUsed();
  localStorage.setItem(STORAGE_REWRITE_COUNT, String(current + 1));
}

export function canPerformAiRewrite(): boolean {
  if (isUserPro()) return true;
  return getFreeRewritesUsed() < FREE_AI_REWRITE_LIMIT;
}

export function verifyAndActivateProKey(inputKey: string): boolean {
  const normalized = inputKey.trim().toUpperCase();
  if (VALID_PRO_KEYS.includes(normalized)) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_PRO_FLAG, 'true');
      if (normalized === 'ADMIN777') {
        localStorage.setItem('launchpad_owner_admin', 'true');
      }
    }
    return true;
  }
  return false;
}

export function checkDiscountPromoCode(inputCode: string): {
  valid: boolean;
  message?: string;
  checkoutUrl?: string;
  code?: string;
} {
  const normalized = inputCode.trim().toUpperCase();
  const found = DISCOUNT_PROMO_CODES[normalized];
  if (found) {
    return {
      valid: true,
      message: found.message,
      checkoutUrl: found.checkoutUrl,
      code: found.code,
    };
  }
  return { valid: false };
}

// Удаление всех «нейрозвёздочек» (**текст**, ###, `код`) из ответов ИИ и сопроводительных писем
export function cleanAIMarkdownArtifacts(text: string): string {
  if (!text) return '';
  return text
    // 1. Убираем двойные и одинарные звёздочки жирного/курсивного выделения (**текст** -> текст)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    // 2. Убираем нижние подчёркивания (__текст__ -> текст)
    .replace(/__([^_]+)__/g, '$1')
    // 3. Убираем Markdown-заголовки (### Заголовок -> Заголовок)
    .replace(/^#{1,6}\s+/gm, '')
    // 4. Заменяем списки со звёздочками в начале строки на аккуратное тире
    .replace(/^\s*\*\s+/gm, '— ')
    // 5. Убираем обратные кавычки (`код` -> код) в сопроводительных письмах
    .replace(/`([^`]+)`/g, '$1')
    // 6. Убираем шаблонные заглушки вроде [Ваше Имя] или [Компания], если они остались
    .replace(/\[Ваше имя\]|\[Your Name\]/gi, '')
    // 7. Убираем артефакты промптов («В РЕЗЮМЕ ДЛЯ ВСТРАИВАНИЯ:»)
    .replace(/[«"“]?\s*(?:В\s+РЕЗЮМЕ\s+ДЛЯ\s+ВСТРАИВАНИЯ|ДЛЯ\s+ВСТРАИВАНИЯ|В\s+РЕЗЮМЕ|ЦЕЛЕВЫЕ\s+НАВЫКИ|НЕДОСТАЮЩИЕ\s+НАВЫКИ)[:\s]*\s*[»"”]?/gi, 'профильные инструменты')
    .replace(/[«"“]\s*профильные инструменты\s*[»"”]/gi, 'профильные инструменты')
    .replace(/[«"“]\s*[»"”]/g, '')
    .trim();
}
