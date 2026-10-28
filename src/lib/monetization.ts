export const TRIBUTE_LINKS = {
  WEB_CHECKOUT: 'https://web.tribute.tg/s/1aEM',
  TG_APP_CHECKOUT: 'https://t.me/tribute/app?startapp=s1aEM',
};

export const VALID_PRO_KEYS = [
  'LP_PRO_2026',
  'START30_PRO',
  'LAUNCHPAD_VIP',
  'PRO2026',
];

export const FREE_SCAN_LIMIT = 2;

const STORAGE_PRO_FLAG = 'launchpad_pro_active_v1';
const STORAGE_SCAN_COUNT = 'launchpad_free_scans_used_v1';

export function isUserPro(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_PRO_FLAG) === 'true';
}

export function getFreeScansUsed(): number {
  if (typeof window === 'undefined') return 0;
  return Number(localStorage.getItem(STORAGE_SCAN_COUNT) || '0');
}

export function getRemainingFreeScans(): number {
  if (isUserPro()) return Infinity;
  return Math.max(0, FREE_SCAN_LIMIT - getFreeScansUsed());
}

export function incrementScanUsage(): void {
  if (typeof window === 'undefined' || isUserPro()) return;
  const current = getFreeScansUsed();
  localStorage.setItem(STORAGE_SCAN_COUNT, String(current + 1));
}

export function verifyAndActivateProKey(inputKey: string): boolean {
  const normalized = inputKey.trim().toUpperCase();
  if (VALID_PRO_KEYS.includes(normalized)) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_PRO_FLAG, 'true');
    }
    return true;
  }
  return false;
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
    .trim();
}
