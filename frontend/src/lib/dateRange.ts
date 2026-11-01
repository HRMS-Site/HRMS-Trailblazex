import { toIsoDate } from "@/lib/format";

export type DatePreset = "this_month" | "last_month" | "this_quarter" | "this_year" | "custom";

export interface DateRange {
  start: string;
  end: string;
}

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const DATE_PRESETS: { id: DatePreset; label: string }[] = [
  { id: "this_month", label: "This month" },
  { id: "last_month", label: "Last month" },
  { id: "this_quarter", label: "This quarter" },
  { id: "this_year", label: "This year" },
  { id: "custom", label: "Custom range" },
];

export function buildMonthDateRange(year: number, month: number): DateRange {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error("Month must be an integer between 1 and 12.");
  }

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  return {
    start: toIsoDate(start),
    end: toIsoDate(end),
  };
}

export function getDefaultMonthYear(now = new Date()): { year: number; month: number } {
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };
}

export function formatMonthYearLabel(year: number, month: number): string {
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

export function formatDateForDisplay(dateValue: string): string {
  const parsed = new Date(`${dateValue}T12:00:00`);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

export function getYearOptions(startYear = 2000, endYear = 2100): number[] {
  return Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index);
}

export function resolveDateRange(preset: DatePreset, custom: DateRange, now = new Date()): DateRange {
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = toIsoDate(now);

  if (preset === "this_month") {
    return { start: toIsoDate(new Date(year, month, 1)), end: today };
  }
  if (preset === "last_month") {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    return { start: toIsoDate(start), end: toIsoDate(end) };
  }
  if (preset === "this_quarter") {
    const quarterStartMonth = Math.floor(month / 3) * 3;
    return { start: toIsoDate(new Date(year, quarterStartMonth, 1)), end: today };
  }
  if (preset === "this_year") {
    return { start: toIsoDate(new Date(year, 0, 1)), end: today };
  }
  return custom;
}
