import { Banknote, Percent, Scale, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { AlertMessage } from "@/components/AlertMessage";
import { DataTable } from "@/components/DataTable";
import { LoadingState } from "@/components/LoadingState";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { DateRangeSelector } from "@/components/shared/DateRangeSelector";
import { useDateFilter } from "@/hooks/useDateFilter";
import { formatCurrency } from "@/lib/format";
import { getProfitLossReport } from "@/services/reports";
import type { ProfitLossReport } from "@/types";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function formatPercent(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  const numeric = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(numeric)) {
    return "—";
  }
  return `${numeric.toFixed(2)}%`;
}

export function ProfitLossPage() {
  const { preset, setPreset, custom, setCustom, range } = useDateFilter();
  const [report, setReport] = useState<ProfitLossReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (range.start > range.end) {
        setError("Start date must be on or before the end date.");
        setReport(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const next = await getProfitLossReport(range.start, range.end);
        if (!cancelled) {
          setReport(next);
        }
      } catch (reason) {
        if (!cancelled) {
          setReport(null);
          setError(errorMessage(reason));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [range.start, range.end]);

  return (
    <div>
      <PageHeader
        title="Profit & Loss"
        description="Totals are displayed exactly as returned by the backend report. Changing the date range resends start_date and end_date."
      />

      <div className="mb-6">
        <DateRangeSelector
          preset={preset}
          custom={custom}
          onPresetChange={setPreset}
          onCustomChange={setCustom}
        />
      </div>

      {error ? (
        <div className="mb-4">
          <AlertMessage>{error}</AlertMessage>
        </div>
      ) : null}

      {loading ? <LoadingState label="Fetching profit and loss report…" /> : null}

      {!loading && report ? (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Revenue" value={formatCurrency(report.total_revenue)} icon={Banknote} />
            <StatCard label="Expenses" value={formatCurrency(report.total_expenses)} icon={Wallet} />
            <StatCard
              label="Net profit / loss"
              value={formatCurrency(report.net_profit_loss ?? report.net_profit)}
              icon={Scale}
            />
            <StatCard label="Profit margin" value={formatPercent(report.profit_margin)} icon={Percent} />
          </div>
          <DataTable
            columns={[
              { key: "department", header: "Department", render: (row) => row.department },
              { key: "revenue", header: "Revenue", render: (row) => formatCurrency(row.revenue) },
              { key: "expenses", header: "Expenses", render: (row) => formatCurrency(row.expenses) },
              { key: "net", header: "Net", render: (row) => formatCurrency(row.net_profit) },
            ]}
            rows={report.department_summaries ?? []}
            emptyTitle="No department rows"
            emptyDescription="The report did not include department summaries."
            rowKey={(row) => row.department}
          />
        </>
      ) : null}
    </div>
  );
}
