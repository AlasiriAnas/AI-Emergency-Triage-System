import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert any Arabic numerals (٠-٩) to English numerals (0-9)
 * @param value - String or number to convert
 * @returns String with English numerals
 */
export function toEnglishNumber(value: string | number): string {
  if (typeof value === 'number') value = value.toString();
  return value.replace(/[\u0660-\u0669]/g, (c) =>
    (c.charCodeAt(0) - 0x0660).toString()
  );
}

/**
 * Format number with English locale
 * @param value - Number to format
 * @returns Formatted string with English numerals
 */
export function formatNumber(value: number): string {
  return toEnglishNumber(value.toLocaleString('en-US'));
}
