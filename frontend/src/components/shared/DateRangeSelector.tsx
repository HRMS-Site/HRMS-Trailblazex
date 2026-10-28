import { DATE_PRESETS, type DatePreset, type DateRange } from "@/lib/dateRange";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function DateRangeSelector({
  preset,
  custom,
  onPresetChange,
  onCustomChange,
}: {
  preset: DatePreset;
  custom: DateRange;
  onPresetChange: (preset: DatePreset) => void;
  onCustomChange: (range: DateRange) => void;
}) {
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
