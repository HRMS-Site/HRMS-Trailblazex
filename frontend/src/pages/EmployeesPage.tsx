import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { ResourceManager } from "@/components/shared/ResourceManager";
import { StatusBadge } from "@/components/StatusBadge";
import { createEmployee, deleteEmployee, listEmployees, updateEmployee } from "@/services/employees";
import { employeeSchema } from "@/lib/validation";
import type { Employee } from "@/types";

function EmployeeActionsMenu({
  row,
  onView,
  onEdit,
  onDelete,
}: {
  row: Employee;
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
      const menuWidth = 176;
      const menuHeight = 148;
      const gap = 8;
      const padding = 8;

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

  const menu = open
    ? createPortal(
        <div
          ref={menuRef}
          className="fixed z-[100] w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
          style={{ top: menuStyle.top, left: menuStyle.left }}
          role="menu"
          aria-label={`Actions for ${row.name}`}
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
            View Details
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
    : null;

  return (
    <div className="flex w-full justify-end pr-0.5 lg:pr-1.5">
      <button
        ref={buttonRef}
        type="button"
        aria-label={`Actions for ${row.name}`}
        aria-expanded={open}
        className="flex h-[34px] w-[34px] items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
        onClick={() => setOpen((value) => !value)}
      >
        <MoreHorizontal className="h-3.5 w-3.5" aria-hidden />
      </button>
      {menu}
    </div>
  );
}

export function EmployeesPage() {
  return (
    <ResourceManager<Employee, typeof employeeSchema>
      title="Employees"
      entityName="employee"
      description="Maintain the employee directory. Client checks are for usability; the backend is the authority."
      schema={employeeSchema}
      defaults={{
        name: "",
        email: "",
        department: "",
        job_title: "",
        salary: 0,
        joining_date: "",
        status: "active",
      }}
      list={listEmployees}
      create={createEmployee}
      update={updateEmployee}
      remove={deleteEmployee}
      searchKeys={(row) => [row.name, row.email, row.department, row.job_title, row.status]}
      emptyTitle="No employees"
      emptyDescription="Add an employee, or confirm the backend /employees endpoint when live API mode is on."
      fields={[
        { name: "name", label: "Name", type: "text" },
        { name: "email", label: "Email", type: "email" },
        { name: "department", label: "Department", type: "text" },
        { name: "job_title", label: "Job title", type: "text" },
        { name: "salary", label: "Salary", type: "number", step: "0.01" },
        { name: "joining_date", label: "Joining date", type: "date" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ],
        },
      ]}
      columns={[
        {
          key: "name",
          header: <span className="block pl-1.5">Name</span>,
          headerClassName: "w-[26%]",
          className: "w-[26%] min-w-0 pl-1.5 align-middle",
          render: (row) => {
            const initials = String(row.name ?? "?")
              .trim()
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase() ?? "")
              .join("") || "?";

            return (
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700 lg:flex">
                  {initials}
                </div>
                <div className="flex min-w-0 flex-col justify-center gap-0.5">
                  <span
                    className="min-w-0 text-[13px] font-semibold leading-5 text-slate-800 break-words lg:text-[16px]"
                    style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                  >
                    {row.name}
                  </span>
                  <span
                    className="hidden min-w-0 text-[11px] leading-4 text-slate-500 lg:block lg:text-[12px]"
                    style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                  >
                    {row.email || "—"}
                  </span>
                </div>
              </div>
            );
          },
        },
        {
          key: "department",
          header: <span className="block pl-1.5">Department</span>,
          headerClassName: "w-[26%]",
          className: "w-[26%] min-w-0 pl-1.5 align-middle",
          render: (row) => <span className="block text-[13px] leading-5 text-slate-700">{row.department || "—"}</span>,
        },
        {
          key: "status",
          header: <span className="block pl-1.5">Status</span>,
          headerClassName: "w-[26%]",
          className: "w-[26%] min-w-0 pl-1.5 align-middle",
          render: (row) => (
            <div className="flex items-center justify-start pl-1.5">
              <StatusBadge value={row.status} />
            </div>
          ),
        },
      ]}
      renderActions={(row, actions) => (
        <EmployeeActionsMenu row={row} onView={actions.onView} onEdit={actions.onEdit} onDelete={actions.onDelete} />
      )}
      detailFields={(row) => [
        { label: "Full Name", value: row.name },
        { label: "Email", value: row.email || "—" },
        { label: "Job Title", value: row.job_title || "—" },
        { label: "Department", value: row.department || "—" },
        { label: "Status", value: <StatusBadge value={row.status} /> },
      ]}
    />
  );
}
