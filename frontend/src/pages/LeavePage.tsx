import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { ResourceManager } from "@/components/shared/ResourceManager";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate, todayIso } from "@/lib/format";
import { leaveSchema } from "@/lib/validation";
import { createLeave, deleteLeave, listLeave, updateLeave } from "@/services/leave";
import type { LeaveRecord } from "@/types";

function LeaveActionsMenu({
  row,
  onView,
  onEdit,
  onDelete,
}: {
  row: LeaveRecord;
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

export function LeavePage() {
  return (
    <ResourceManager<LeaveRecord, typeof leaveSchema>
      title="Leave"
      entityName="leave request"
      description="Leave requests and approvals. Status changes here are submitted to the API; they are not a security control."
      schema={leaveSchema}
      defaults={{
        employee_name: "",
        leave_type: "Annual",
        start_date: todayIso(),
        end_date: todayIso(),
        status: "pending",
        reason: "",
      }}
      list={listLeave}
      create={createLeave}
      update={updateLeave}
      remove={deleteLeave}
      searchKeys={(row) => [row.employee_name, row.leave_type, row.status, row.reason]}
      emptyTitle="No leave requests"
      emptyDescription="Add a leave request, or confirm the backend /leave endpoint when live API mode is on."
      fields={[
        { name: "employee_name", label: "Employee", type: "text" },
        { name: "leave_type", label: "Leave type", type: "text" },
        { name: "start_date", label: "Start date", type: "date" },
        { name: "end_date", label: "End date", type: "date" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
          ],
        },
        { name: "reason", label: "Reason", type: "text" },
      ]}
      columns={[
        { key: "employee", header: "Name", className: "table-cell align-middle", render: (row) => row.employee_name },
        { key: "type", header: "Type", headerClassName: "hidden sm:table-cell", className: "hidden sm:table-cell align-middle", render: (row) => row.leave_type },
        { key: "reason", header: "Reason", className: "table-cell align-middle", render: (row) => row.reason },
        { key: "status", header: "Status", className: "table-cell align-middle", render: (row) => <StatusBadge value={row.status} /> },
        { key: "start", header: "Start", headerClassName: "hidden sm:table-cell", className: "hidden sm:table-cell align-middle", render: (row) => formatDate(row.start_date) },
        { key: "end", header: "End", headerClassName: "hidden sm:table-cell", className: "hidden sm:table-cell align-middle", render: (row) => formatDate(row.end_date) },
      ]}
      detailFields={(row) => {
        const dayCount = (() => {
          const start = new Date(row.start_date);
          const end = new Date(row.end_date);
          if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            return "—";
          }
          const diffDays = Math.round((end.getTime() - start.getTime()) / 86400000);
          return String(Math.max(1, diffDays + 1));
        })();

        return [
          { label: "Employee Name", value: row.employee_name },
          { label: "Employee ID", value: row.id },
          { label: "Leave Type", value: row.leave_type },
          { label: "Reason", value: row.reason },
          { label: "Start Date", value: formatDate(row.start_date) },
          { label: "End Date", value: formatDate(row.end_date) },
          { label: "Number of Days", value: dayCount },
          { label: "Leave Status", value: <StatusBadge value={row.status} /> },
          { label: "Applied Date", value: formatDate(row.start_date) },
        ];
      }}
      renderActions={(row, actions) => <LeaveActionsMenu row={row} onView={actions.onView} onEdit={actions.onEdit} onDelete={actions.onDelete} />}
    />
  );
}
