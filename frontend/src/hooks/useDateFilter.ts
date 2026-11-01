import { useMemo, useState } from "react";
import { buildMonthDateRange, getDefaultMonthYear, type DateRange } from "@/lib/dateRange";

export function useDateFilter() {
  const defaultSelection = getDefaultMonthYear();
  const [selectedYear, setSelectedYear] = useState<number>(defaultSelection.year);
  const [selectedMonth, setSelectedMonth] = useState<number>(defaultSelection.month);

  const range = useMemo<DateRange>(() => buildMonthDateRange(selectedYear, selectedMonth), [selectedYear, selectedMonth]);

  return {
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    range,
  };
}
