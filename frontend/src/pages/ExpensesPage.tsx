import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { ResourceManager } from "@/components/shared/ResourceManager";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate, todayIso } from "@/lib/format";
import { transactionSchema } from "@/lib/validation";
import { createTransaction, deleteTransaction, listTransactions, updateTransaction } from "@/services/transactions";
import type { Transaction } from "@/types";

function TransactionActionsMenu({
  row,
  onView,
  onEdit,
  onDelete,
}: {
  row: Transaction;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function updatePosition() {
      const trigger = buttonRef.current;
      if (!trigger) {
        return;
      }

      const rect = trigger.getBoundingClientRect();
      const menuWidth = 170;
      const menuHeight = 148;
      const gap = 8;
      const padding = 12;

      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const placeAbove = spaceBelow < menuHeight && spaceAbove > menuHeight;

      const nextTop = placeAbove ? rect.top - menuHeight - gap : rect.bottom + gap;
      const desiredLeft = rect.right - menuWidth;
      const nextLeft = Math.min(Math.max(padding, desiredLeft), window.innerWidth - menuWidth - padding);

      setMenuStyle({ top: Math.max(padding, nextTop), left: nextLeft });
    }

    function handlePointerDown(event: MouseEvent) {
      if (menuRef.current && menuRef.current.contains(event.target as Node)) {
        return;
      }
      if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
        return;
      }
      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    updatePosition();
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("scroll", updatePosition, true);
    document.addEventListener("resize", updatePosition);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("resize", updatePosition);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="flex w-full justify-end sm:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-label={`Actions for ${row.description}`}
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
        onClick={() => setOpen((value) => !value)}
      >
        <MoreHorizontal className="h-4 w-4" aria-hidden />
      </button>
      {open
        ? createPortal(
            <div
              ref={menuRef}
              className="fixed z-[100] w-[170px] overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
              style={{ top: menuStyle.top, left: menuStyle.left }}
              role="menu"
              aria-label={`Actions for ${row.description}`}
            >
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                onClick={() => {
                  setOpen(false);
                  onView();
                }}
              >
                <Eye className="h-4 w-4" aria-hidden />
                Detail
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                onClick={() => {
                  setOpen(false);
                  onEdit();
                }}
              >
                <Pencil className="h-4 w-4" aria-hidden />
                Edit
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-red-700 hover:bg-red-50"
                onClick={() => {
                  setOpen(false);
                  onDelete();
                }}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                Delete
              </button>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

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
        { key: "date", header: "Date", headerClassName: "hidden lg:table-cell", className: "hidden lg:table-cell", render: (row) => formatDate(row.date) },
        { key: "description", header: "Description", headerClassName: "hidden lg:table-cell", className: "hidden lg:table-cell", render: (row) => row.description },
        { key: "type", header: "Type", headerClassName: "table-cell lg:table-cell", className: "table-cell align-middle lg:table-cell", render: (row) => <StatusBadge value={row.type} /> },
        { key: "category", header: "Category", headerClassName: "table-cell lg:table-cell", className: "table-cell align-middle lg:table-cell", render: (row) => <span className="block text-[12px] leading-5 text-slate-700 sm:text-[13px]">{row.category}</span> },
        { key: "amount", header: "Amount", headerClassName: "table-cell lg:table-cell", className: "table-cell text-right align-middle lg:table-cell", render: (row) => <span className="block text-[12px] font-medium text-slate-800 sm:text-[13px]">{formatCurrency(row.amount)}</span> },
      ]}
      detailFields={(row) => [
        { label: "Date", value: formatDate(row.date) },
        { label: "Description", value: row.description },
        { label: "Category", value: row.category },
        { label: "Type", value: <StatusBadge value={row.type} /> },
        { label: "Amount", value: formatCurrency(row.amount) },
      ]}
      renderActions={(row, actions) => (
        <>
          <TransactionActionsMenu row={row} onView={actions.onView} onEdit={actions.onEdit} onDelete={actions.onDelete} />
          <div className="hidden items-center justify-end gap-3 sm:flex">
            <button type="button" className="text-sm font-medium text-sky-700 hover:underline" onClick={actions.onEdit}>
              Edit
            </button>
            <button type="button" className="text-sm font-medium text-red-700 hover:underline" onClick={actions.onDelete}>
              Delete
            </button>
          </div>
        </>
      )}
    />
  );
}
