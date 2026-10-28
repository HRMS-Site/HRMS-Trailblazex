import { ResourceManager } from "@/components/shared/ResourceManager";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate, todayIso } from "@/lib/format";
import { transactionSchema } from "@/lib/validation";
import { createTransaction, deleteTransaction, listTransactions, updateTransaction } from "@/services/transactions";
import type { Transaction } from "@/types";

export function ExpensesPage() {
  return (
    <ResourceManager<Transaction, typeof transactionSchema>
      title="Expenses"
      entityName="expense"
      description="Record expense entries. Do not treat this list as the source of profit and loss totals."
      schema={transactionSchema}
      defaults={{ description: "", amount: 0, date: todayIso(), category: "", type: "expense" }}
      list={() => listTransactions("expense")}
      create={createTransaction}
      update={updateTransaction}
      remove={deleteTransaction}
      searchKeys={(row) => [row.description, row.category, row.date]}
      emptyTitle="No expense entries"
      emptyDescription="Add an expense, or confirm the backend transactions endpoint when live API mode is on."
      fields={[
        { name: "description", label: "Description", type: "text" },
        { name: "amount", label: "Amount (INR)", type: "number", step: "0.01" },
        { name: "date", label: "Date", type: "date" },
        { name: "category", label: "Category", type: "text" },
        {
          name: "type",
          label: "Type",
          type: "select",
          options: [{ value: "expense", label: "Expense" }],
        },
      ]}
      columns={[
        { key: "date", header: "Date", render: (row) => formatDate(row.date) },
        { key: "description", header: "Description", render: (row) => row.description },
        { key: "category", header: "Category", render: (row) => row.category },
        { key: "type", header: "Type", render: (row) => <StatusBadge value={row.type} /> },
        { key: "amount", header: "Amount", render: (row) => formatCurrency(row.amount) },
      ]}
    />
  );
}
