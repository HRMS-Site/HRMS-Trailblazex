import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { ResourceManager } from "@/components/shared/ResourceManager";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate, startOfMonth, todayIso } from "@/lib/format";
import { payrollSchema } from "@/lib/validation";
import { createPayroll, deletePayroll, listPayroll, updatePayroll } from "@/services/payroll";
import type { PayrollRecord } from "@/types";

function PayrollActionsMenu({
  row,
  onView,
  onEdit,
  onDelete,
}: {
  row: PayrollRecord;
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
        aria-label={`Actions for ${row.employee_name}`}
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
              aria-label={`Actions for ${row.employee_name}`}
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

export function PayrollPage() {
  return (
    <ResourceManager<PayrollRecord, typeof payrollSchema>
      title="Payroll"
      entityName="payroll record"
      description="Payroll runs for the selected employees. Net pay is calculated automatically from gross pay and deductions."
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
        { name: "period_start", label: "Period Start", type: "date" },
        { name: "period_end", label: "Period End", type: "date" },
        { name: "gross_pay", label: "Gross Pay (INR)", type: "number", step: "0.01" },
        { name: "deductions", label: "Deductions (INR)", type: "number", step: "0.01" },
        { name: "net_pay", label: "Net Pay (INR)", type: "number", step: "0.01", readOnly: true },
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
        { key: "employee", header: "Name", headerClassName: "table-cell", className: "table-cell align-middle", render: (row) => row.employee_name },
        { key: "start", header: "Start", headerClassName: "hidden sm:table-cell", className: "hidden sm:table-cell align-middle", render: (row) => formatDate(row.period_start) },
        { key: "end", header: "End", headerClassName: "hidden sm:table-cell", className: "hidden sm:table-cell align-middle", render: (row) => formatDate(row.period_end) },
        { key: "gross", header: "Gross Pay (INR)", headerClassName: "hidden sm:table-cell", className: "hidden sm:table-cell align-middle", render: (row) => formatCurrency(row.gross_pay) },
        { key: "net", header: "Net Pay (INR)", headerClassName: "table-cell", className: "table-cell align-middle", render: (row) => <span className="block text-[12px] font-medium text-slate-800 sm:text-[13px]">{formatCurrency(row.net_pay)}</span> },
        { key: "status", header: "Status", headerClassName: "table-cell", className: "table-cell align-middle", render: (row) => <StatusBadge value={row.status} /> },
      ]}
      detailFields={(row) => [
        { label: "Employee Name", value: row.employee_name },
        { label: "Employee ID", value: row.id },
        { label: "Period Start", value: formatDate(row.period_start) },
        { label: "Period End", value: formatDate(row.period_end) },
        { label: "Gross Pay (INR)", value: formatCurrency(row.gross_pay) },
        { label: "Deductions (INR)", value: formatCurrency(row.deductions) },
        { label: "Net Pay (INR)", value: formatCurrency(row.net_pay) },
        { label: "Status", value: <StatusBadge value={row.status} /> },
      ]}
      renderActions={(row, actions) => <PayrollActionsMenu row={row} onView={actions.onView} onEdit={actions.onEdit} onDelete={actions.onDelete} />}
    />
  );
}
