import { toIsoDate } from "@/lib/format";

export type DatePreset = "this_month" | "last_month" | "this_quarter" | "this_year" | "custom";

export interface DateRange {
  start: string;
  end: string;
}

export const DATE_PRESETS: { id: DatePreset; label: string }[] = [
  { id: "this_month", label: "This month" },
  { id: "last_month", label: "Last month" },
  { id: "this_quarter", label: "This quarter" },
  { id: "this_year", label: "This year" },
  { id: "custom", label: "Custom range" },
];

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
