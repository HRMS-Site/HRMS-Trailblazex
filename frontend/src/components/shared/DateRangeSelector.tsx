import { DATE_PRESETS, MONTH_NAMES, type DatePreset, type DateRange, buildMonthDateRange, formatDateForDisplay, formatMonthYearLabel, getYearOptions } from "@/lib/dateRange";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type LegacyProps = {
  preset: DatePreset;
  custom: DateRange;
  onPresetChange: (preset: DatePreset) => void;
  onCustomChange: (range: DateRange) => void;
};

type MonthYearProps = {
  year: number;
  month: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
};

export function DateRangeSelector(props: Partial<LegacyProps> & Partial<MonthYearProps>) {
  const monthYearProps = props.year !== undefined && props.month !== undefined && props.onYearChange && props.onMonthChange;

  if (monthYearProps) {
    const year = props.year as number;
    const month = props.month as number;
    const range = buildMonthDateRange(year, month);

    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <Label htmlFor="select-year">Select year</Label>
            <Select
              id="select-year"
              value={String(year)}
              onChange={(event) => props.onYearChange?.(Number(event.target.value))}
            >
              {getYearOptions(2000, 2100).map((optionYear) => (
                <option key={optionYear} value={String(optionYear)}>
                  {optionYear}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex-1">
            <Label htmlFor="select-month">Select month</Label>
            <Select
              id="select-month"
              value={String(month)}
              onChange={(event) => props.onMonthChange?.(Number(event.target.value))}
            >
              {MONTH_NAMES.map((label, index) => (
                <option key={label} value={String(index + 1)}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="mt-5 space-y-2 rounded-lg border border-sky-100 bg-sky-50 p-3 text-sm text-slate-700">
          <div className="font-semibold text-slate-900">Selected Period: {formatMonthYearLabel(year, month)}</div>
          <div>Start Date: {formatDateForDisplay(range.start)}</div>
          <div>End Date: {formatDateForDisplay(range.end)}</div>
        </div>
      </div>
    );
  }

  const preset = props.preset as DatePreset;
  const custom = props.custom as DateRange;
  const onPresetChange = props.onPresetChange as (preset: DatePreset) => void;
  const onCustomChange = props.onCustomChange as (range: DateRange) => void;

  if (!preset || !custom || !onPresetChange || !onCustomChange) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-end">
      <div className="lg:w-56">
        <Label htmlFor="date-preset">Period</Label>
        <Select
          id="date-preset"
          value={preset}
          onChange={(event) => onPresetChange(event.target.value as DatePreset)}
        >
          {DATE_PRESETS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex-1">
        <Label htmlFor="date-start">Start date</Label>
        <Input
          id="date-start"
          type="date"
          value={custom.start}
          disabled={preset !== "custom"}
          onChange={(event) => onCustomChange({ ...custom, start: event.target.value })}
        />
      </div>
      <div className="flex-1">
        <Label htmlFor="date-end">End date</Label>
        <Input
          id="date-end"
          type="date"
          value={custom.end}
          disabled={preset !== "custom"}
          onChange={(event) => onCustomChange({ ...custom, end: event.target.value })}
        />
      </div>
    </div>
  );
}
