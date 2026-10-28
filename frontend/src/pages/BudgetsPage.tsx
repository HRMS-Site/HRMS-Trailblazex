import { ResourceManager } from "@/components/shared/ResourceManager";
import { formatCurrency, formatDate, startOfMonth, todayIso } from "@/lib/format";
import { budgetSchema } from "@/lib/validation";
import { createBudget, deleteBudget, listBudgets, updateBudget } from "@/services/budgets";
import type { BudgetRecord } from "@/types";

export function BudgetsPage() {
  return (
    <ResourceManager<BudgetRecord, typeof budgetSchema>
      title="Budgets"
      entityName="budget"
      description="Department budget allocations. Utilization on the dashboard uses the report payload, not a browser-side spent/allocated calculation from this table."
      schema={budgetSchema}
      defaults={{
        department: "",
        period_start: startOfMonth(),
        period_end: todayIso(),
        allocated_amount: 0,
        spent_amount: 0,
      }}
      list={listBudgets}
      create={createBudget}
      update={updateBudget}
      remove={deleteBudget}
      searchKeys={(row) => [row.department]}
      emptyTitle="No budgets"
      emptyDescription="Add a budget, or confirm the backend /budgets endpoint when live API mode is on."
      fields={[
        { name: "department", label: "Department", type: "text" },
        { name: "period_start", label: "Period start", type: "date" },
        { name: "period_end", label: "Period end", type: "date" },
        { name: "allocated_amount", label: "Allocated (INR)", type: "number", step: "0.01" },
        { name: "spent_amount", label: "Spent (INR)", type: "number", step: "0.01" },
      ]}
      columns={[
        { key: "department", header: "Department", render: (row) => row.department },
        { key: "start", header: "Start", render: (row) => formatDate(row.period_start) },
        { key: "end", header: "End", render: (row) => formatDate(row.period_end) },
        { key: "allocated", header: "Allocated", render: (row) => formatCurrency(row.allocated_amount) },
        { key: "spent", header: "Spent", render: (row) => formatCurrency(row.spent_amount) },
      ]}
    />
  );
}
