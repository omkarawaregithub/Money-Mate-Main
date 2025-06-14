// src/lib/dateUtils.ts

export function calculateNextResetDate(resetDayOfMonth: number): Date {
  const now = new Date();
  let resetYear = now.getFullYear();
  let resetMonth = now.getMonth(); // 0-indexed

  // Clamp resetDayOfMonth to be at least 1 and at most 31
  const clampedResetDay = Math.max(1, Math.min(31, resetDayOfMonth));

  // Determine the actual day for the reset, considering month length
  // For example, if resetDayOfMonth is 31 and current month is February
  let dayForReset = clampedResetDay;
  
  // Check if reset day has passed for the current month or if it's an invalid day for current month
  const daysInCurrentMonth = new Date(resetYear, resetMonth + 1, 0).getDate();
  if (now.getDate() > clampedResetDay || clampedResetDay > daysInCurrentMonth) {
    resetMonth += 1;
    if (resetMonth > 11) {
      resetMonth = 0;
      resetYear += 1;
    }
  }
  
  const daysInResetMonth = new Date(resetYear, resetMonth + 1, 0).getDate();
  dayForReset = Math.min(clampedResetDay, daysInResetMonth);

  return new Date(resetYear, resetMonth, dayForReset, 0, 0, 0, 0);
}

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMilliseconds: number;
}

export function calculateTimeRemaining(targetDate: Date | null): TimeRemaining | null {
  if (!targetDate) return null;

  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMilliseconds: 0 };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return { days, hours, minutes, seconds, totalMilliseconds: difference };
}
