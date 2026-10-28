import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Stable reference anchor to prevent Next.js 16 prerender error on dynamic current time
const REFERENCE_TIME = new Date("2026-10-28T00:00:00Z").getTime();

/**
 * Format a date string relative to now (in Russian)
 */
export function relativeTime(dateStr: string): string {
  if (!dateStr) return "Недавно";
  const date = new Date(dateStr);
  const diffMs = REFERENCE_TIME - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `через ${Math.abs(diffDays)} дн.`;
  if (diffDays === 0) return "Сегодня";
  if (diffDays === 1) return "Вчера";
  if (diffDays < 7) return `${diffDays} дн. назад`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} нед. назад`;
  return `${Math.floor(diffDays / 30)} мес. назад`;
}

/**
 * Format a date for display (in Russian)
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.toLocaleDateString("ru-RU", { month: "short", day: "numeric", year: "numeric" })}`;
}

/**
 * Truncate text to a max length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Generate a deterministic color from a string (for company avatars)
 */
export function stringToColor(str: string): string {
  const colors = [
    "bg-blue-600 text-white",
    "bg-indigo-600 text-white",
    "bg-violet-600 text-white",
    "bg-purple-600 text-white",
    "bg-rose-600 text-white",
    "bg-amber-600 text-white",
    "bg-emerald-600 text-white",
    "bg-teal-600 text-white",
    "bg-cyan-600 text-white",
    "bg-sky-600 text-white",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
