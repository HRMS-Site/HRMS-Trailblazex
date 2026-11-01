import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
}) {
  const amountSize = value.length > 14 ? "0.72rem" : value.length > 11 ? "0.8rem" : value.length > 8 ? "0.9rem" : "1rem";

  return (
    <article className="flex h-full min-w-0 flex-col justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="flex min-w-0 items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] leading-snug text-slate-500 sm:text-[12px]">{label}</p>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 sm:h-9 sm:w-9">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
        </div>
      </div>

      <div className="mt-3 min-w-0">
        <p
          className="whitespace-nowrap font-semibold leading-none tracking-[-0.02em] text-slate-900"
          style={{ fontSize: amountSize, minWidth: 0 }}
        >
          {value}
        </p>
        {hint ? <p className="mt-2 text-[10px] leading-snug text-slate-500 sm:text-[11px]">{hint}</p> : null}
      </div>
    </article>
  );
}
