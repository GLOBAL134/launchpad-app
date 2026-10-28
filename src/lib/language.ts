/**
 * Automatic language detection helper
 * Detects whether the user is writing/browsing in Russian or English
 */
export function detectLanguage(text?: string): 'ru' | 'en' {
  if (text && text.trim().length > 5) {
    const cyrillicCount = (text.match(/[а-яА-ЯёЁ]/g) || []).length;
    const latinCount = (text.match(/[a-zA-Z]/g) || []).length;
    if (cyrillicCount > latinCount) return 'ru';
    if (latinCount > cyrillicCount) return 'en';
  }

  if (typeof window !== 'undefined' && window.navigator) {
    const browserLang = (window.navigator.language || '').toLowerCase();
    if (
      browserLang.startsWith('ru') ||
      browserLang.startsWith('be') ||
      browserLang.startsWith('uk') ||
      browserLang.startsWith('kk')
    ) {
      return 'ru';
    }
    return 'en';
  }

  return 'ru';
}
