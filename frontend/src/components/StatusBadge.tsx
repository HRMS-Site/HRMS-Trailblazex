import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-800",
  inactive: "bg-slate-100 text-slate-700",
  revenue: "bg-sky-50 text-sky-800",
  expense: "bg-amber-50 text-amber-800",
  pending: "bg-amber-50 text-amber-800",
  approved: "bg-emerald-50 text-emerald-800",
  rejected: "bg-red-50 text-red-800",
  present: "bg-emerald-50 text-emerald-800",
  absent: "bg-red-50 text-red-800",
  leave: "bg-slate-100 text-slate-700",
  remote: "bg-sky-50 text-sky-800",
  draft: "bg-slate-100 text-slate-700",
  processed: "bg-sky-50 text-sky-800",
  paid: "bg-emerald-50 text-emerald-800",
};

export function StatusBadge({ value }: { value: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        STYLES[value] ?? "bg-slate-100 text-slate-700",
      )}
    >
      {value.replaceAll("_", " ")}
    </span>
  );
}
