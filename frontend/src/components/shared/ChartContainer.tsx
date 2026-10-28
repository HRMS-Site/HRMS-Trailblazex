import type { ReactNode } from "react";
import { EmptyState } from "@/components/EmptyState";

export function ChartContainer({
  title,
  children,
  empty,
}: {
  title: string;
  children: ReactNode;
  empty?: boolean;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2>
      {empty ? (
        <EmptyState title="No chart data" description="The report endpoint did not include trend points for this range." />
      ) : (
        <div className="h-72 w-full">{children}</div>
      )}
    </section>
  );
}
