import { useEffect, useMemo, useState } from "react";
import { Banknote, Percent, Scale, Users, Wallet, WalletCards } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertMessage } from "@/components/AlertMessage";
import { DataTable } from "@/components/DataTable";
import { PageHeader } from "@/components/PageHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { StatCard } from "@/components/StatCard";
import { ChartContainer } from "@/components/shared/ChartContainer";
import { DateRangeSelector } from "@/components/shared/DateRangeSelector";
import { useDateFilter } from "@/hooks/useDateFilter";
import { formatCurrency, formatInteger } from "@/lib/format";
import { listEmployees } from "@/services/employees";
import { getProfitLossReport } from "@/services/reports";
import type { DepartmentSummary, ProfitLossReport } from "@/types";

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

export function DashboardPage() {
  const { preset, setPreset, custom, setCustom, range } = useDateFilter();
  const [employeeCount, setEmployeeCount] = useState<number | null>(null);
  const [report, setReport] = useState<ProfitLossReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const nextErrors: string[] = [];

      const [employeesResult, reportResult] = await Promise.allSettled([
        listEmployees(),
        getProfitLossReport(range.start, range.end),
      ]);

      if (cancelled) {
        return;
      }

      if (employeesResult.status === "fulfilled") {
        setEmployeeCount(employeesResult.value.length);
      } else {
        setEmployeeCount(null);
        nextErrors.push(`Employees: ${errorMessage(employeesResult.reason)}`);
      }

      if (reportResult.status === "fulfilled") {
        setReport(reportResult.value);
      } else {
        setReport(null);
        nextErrors.push(`Profit & loss: ${errorMessage(reportResult.reason)}`);
      }

      setErrors(nextErrors);
      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [range.start, range.end]);

  const trendRows = useMemo(
    () =>
      (report?.trends ?? []).map((point) => ({
        period: point.period,
        revenue: Number(point.revenue),
        expenses: Number(point.expenses),
      })),
    [report],
  );

  const summaries: DepartmentSummary[] = useMemo(() => report?.department_summaries ?? [], [report]);

  return (
    <div>
      <ScrollReveal delay={40}>
        <PageHeader
          title="Dashboard"
          description="Financial cards use totals from the profit-and-loss report for the selected dates. They are not summed from revenue or expense lists in the browser."
        />
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <div className="mb-6">
          <DateRangeSelector
            preset={preset}
            custom={custom}
            onPresetChange={setPreset}
            onCustomChange={setCustom}
          />
        </div>
      </ScrollReveal>

      {errors.map((message) => (
        <ScrollReveal key={message} delay={60}>
          <div className="mb-4">
            <AlertMessage>{message}</AlertMessage>
          </div>
        </ScrollReveal>
      ))}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          <StatCard key="employees" label="Total employees" value={formatInteger(employeeCount)} icon={Users} />,
          <StatCard
            key="revenue"
            label="Revenue"
            value={formatCurrency(report?.total_revenue)}
            icon={Banknote}
            hint={`${range.start} to ${range.end}`}
          />,
          <StatCard
            key="expenses"
            label="Expenses"
            value={formatCurrency(report?.total_expenses)}
            icon={Wallet}
            hint={`${range.start} to ${range.end}`}
          />,
          <StatCard
            key="net"
            label="Net profit / loss"
            value={formatCurrency(report?.net_profit)}
            icon={Scale}
            hint="From the report endpoint"
          />,
          <StatCard
            key="margin"
            label="Profit margin"
            value={formatPercent(report?.profit_margin)}
            icon={Percent}
            hint={report?.profit_margin === undefined || report.profit_margin === null ? "Not provided by the report" : "From the report endpoint"}
          />,
          <StatCard
            key="budget"
            label="Budget utilization"
            value={formatPercent(report?.budget_utilization)}
            icon={WalletCards}
            hint={report?.budget_utilization === undefined || report.budget_utilization === null ? "Not provided by the report" : "From the report endpoint"}
          />,
        ].map((card, index) => (
          <ScrollReveal key={`stat-${index}`} delay={index * 60}>
            {card}
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={90} lazy>
        <div className="mb-6">
          <ChartContainer title="Revenue and expense trend" empty={!loading && trendRows.length === 0}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendRows}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#0284c7" name="Revenue" />
                <Line type="monotone" dataKey="expenses" stroke="#b45309" name="Expenses" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100} lazy>
        <>
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Department summaries</h2>
          <DataTable
            columns={[
              { key: "department", header: "Department", render: (row) => row.department },
              { key: "revenue", header: "Revenue", render: (row) => formatCurrency(row.revenue) },
              { key: "expenses", header: "Expenses", render: (row) => formatCurrency(row.expenses) },
              { key: "net", header: "Net", render: (row) => formatCurrency(row.net_profit) },
            ]}
            rows={summaries}
            loading={loading}
            emptyTitle="No department summary"
            emptyDescription="The report did not include department_summaries for this range."
            rowKey={(row) => row.department}
          />
        </>
      </ScrollReveal>
    </div>
  );
}
