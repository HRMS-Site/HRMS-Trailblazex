import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { ResourceManager } from "@/components/shared/ResourceManager";
import { formatCurrency, formatDate, startOfMonth, todayIso } from "@/lib/format";
import { budgetSchema } from "@/lib/validation";
import { createBudget, deleteBudget, listBudgets, updateBudget } from "@/services/budgets";
import type { BudgetRecord } from "@/types";

function BudgetActionsMenu({
  row,
  onView,
  onEdit,
  onDelete,
}: {
  row: BudgetRecord;
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
      if (!trigger) return;

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
      if (menuRef.current && menuRef.current.contains(event.target as Node)) return;
      if (buttonRef.current && buttonRef.current.contains(event.target as Node)) return;
      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
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
    <div className="flex w-full justify-end">
      <button
        ref={buttonRef}
        type="button"
        aria-label={`Actions for ${row.department}`}
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
              aria-label={`Actions for ${row.department}`}
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
      detailFields={(row) => [
        { label: "Department", value: row.department },
        { label: "Budget ID", value: row.id },
        { label: "Period Start", value: formatDate(row.period_start) },
        { label: "Period End", value: formatDate(row.period_end) },
        { label: "Allocated Amount", value: formatCurrency(row.allocated_amount) },
        { label: "Spent Amount", value: formatCurrency(row.spent_amount) },
      ]}
      renderActions={(row, actions) => <BudgetActionsMenu row={row} onView={actions.onView} onEdit={actions.onEdit} onDelete={actions.onDelete} />}
    />
  );
}
