import { useMemo, useState } from "react";
import { resolveDateRange, type DatePreset, type DateRange } from "@/lib/dateRange";
import { startOfMonth, todayIso } from "@/lib/format";

export function useDateFilter() {
  const [preset, setPreset] = useState<DatePreset>("this_month");
  const [custom, setCustom] = useState<DateRange>({ start: startOfMonth(), end: todayIso() });
  const range = useMemo(() => resolveDateRange(preset, custom), [preset, custom]);
  return { preset, setPreset, custom, setCustom, range };
}
