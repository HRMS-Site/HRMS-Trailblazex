import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { ResourceManager } from "@/components/shared/ResourceManager";
import { createDepartment, deleteDepartment, listDepartments, updateDepartment } from "@/services/departments";
import { departmentSchema } from "@/lib/validation";
import type { Department } from "@/types";

function DepartmentActionsMenu({
  row,
  onView,
  onEdit,
  onDelete,
}: {
  row: Department;
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
    <div className="flex w-full justify-end">
      <button
        ref={buttonRef}
        type="button"
        aria-label={`Actions for ${row.name}`}
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

export function DepartmentsPage() {
  return (
    <ResourceManager<Department, typeof departmentSchema>
      title="Departments"
      entityName="department"
      description="Organisational units used across people and finance screens."
      schema={departmentSchema}
      defaults={{ name: "", code: "", manager_name: "" }}
      list={listDepartments}
      create={createDepartment}
      update={updateDepartment}
      remove={deleteDepartment}
      searchKeys={(row) => [row.name, row.code, row.manager_name]}
      emptyTitle="No departments"
      emptyDescription="Add a department, or confirm the backend /departments endpoint when live API mode is on."
      fields={[
        { name: "name", label: "Name", type: "text" },
        { name: "code", label: "Code", type: "text" },
        { name: "manager_name", label: "Manager", type: "text" },
      ]}
      columns={[
        { key: "name", header: "Name", className: "table-cell align-middle", render: (row) => row.name },
        { key: "code", header: "Code", headerClassName: "hidden sm:table-cell", className: "hidden sm:table-cell align-middle", render: (row) => row.code },
        { key: "manager", header: "Manager", className: "table-cell align-middle", render: (row) => row.manager_name },
      ]}
      detailFields={(row) => [
        { label: "Department Name", value: row.name },
        { label: "Department Code", value: row.code },
        { label: "Department Head", value: row.manager_name },
      ]}
      renderActions={(row, actions) => <DepartmentActionsMenu row={row} onView={actions.onView} onEdit={actions.onEdit} onDelete={actions.onDelete} />}
    />
  );
}
