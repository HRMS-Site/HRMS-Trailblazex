import { ResourceManager } from "@/components/shared/ResourceManager";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate, startOfMonth, todayIso } from "@/lib/format";
import { payrollSchema } from "@/lib/validation";
import { createPayroll, deletePayroll, listPayroll, updatePayroll } from "@/services/payroll";
import type { PayrollRecord } from "@/types";

export function PayrollPage() {
  return (
    <ResourceManager<PayrollRecord, typeof payrollSchema>
      title="Payroll"
      entityName="payroll record"
      description="Payroll runs for the selected employees. Amounts are stored as reported; net pay is not recalculated in the browser after save."
      schema={payrollSchema}
      defaults={{
        employee_name: "",
        period_start: startOfMonth(),
        period_end: todayIso(),
        gross_pay: 0,
        deductions: 0,
        net_pay: 0,
        status: "draft",
      }}
      list={listPayroll}
      create={createPayroll}
      update={updatePayroll}
      remove={deletePayroll}
      searchKeys={(row) => [row.employee_name, row.status]}
      emptyTitle="No payroll records"
      emptyDescription="Add a payroll row, or confirm the backend /payroll endpoint when live API mode is on."
      fields={[
        { name: "employee_name", label: "Employee", type: "text" },
        { name: "period_start", label: "Period start", type: "date" },
        { name: "period_end", label: "Period end", type: "date" },
        { name: "gross_pay", label: "Gross pay (INR)", type: "number", step: "0.01" },
        { name: "deductions", label: "Deductions (INR)", type: "number", step: "0.01" },
        { name: "net_pay", label: "Net pay (INR)", type: "number", step: "0.01" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "draft", label: "Draft" },
            { value: "processed", label: "Processed" },
            { value: "paid", label: "Paid" },
          ],
        },
      ]}
      columns={[
        { key: "employee", header: "Employee", render: (row) => row.employee_name },
        { key: "start", header: "Start", render: (row) => formatDate(row.period_start) },
        { key: "end", header: "End", render: (row) => formatDate(row.period_end) },
        { key: "gross", header: "Gross", render: (row) => formatCurrency(row.gross_pay) },
        { key: "net", header: "Net", render: (row) => formatCurrency(row.net_pay) },
        { key: "status", header: "Status", render: (row) => <StatusBadge value={row.status} /> },
      ]}
    />
  );
}
