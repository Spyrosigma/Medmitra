/**
 * Utility functions for handling dates in Indian timezone (Asia/Kolkata)
 */

const INDIAN_TIMEZONE = 'Asia/Kolkata';

/**
 * Get current date in Indian timezone
 */
export function getIndianDate(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: INDIAN_TIMEZONE }));
}

/**
 * Convert a date to Indian timezone
 */
export function toIndianDate(date: Date): Date {
  return new Date(date.toLocaleString("en-US", { timeZone: INDIAN_TIMEZONE }));
}

/**
 * Format a date for API (YYYY-MM-DD) in Indian timezone
 */
export function formatDateForApi(date: Date): string {
  const indianDate = toIndianDate(date);
  const year = indianDate.getFullYear();
  const month = String(indianDate.getMonth() + 1).padStart(2, '0');
  const day = String(indianDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse a date string (YYYY-MM-DD) and create a date object in Indian timezone
 */
export function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Format a date string for display in Indian locale
 */
export function formatDateForDisplay(dateStr: string): string {
  const date = parseDateString(dateStr);
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Check if a date is today in Indian timezone
 */
export function isToday(date: Date): boolean {
  const today = getIndianDate();
  const compareDate = toIndianDate(date);
  return formatDateForApi(today) === formatDateForApi(compareDate);
}

/**
 * Format time for display in Indian timezone
 */
export function formatTimeForDisplay(date: Date): string {
  return date.toLocaleString('en-IN', {
    timeZone: INDIAN_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
} 