import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { ResourceManager } from "@/components/shared/ResourceManager";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate, todayIso } from "@/lib/format";
import { attendanceSchema } from "@/lib/validation";
import { createAttendance, deleteAttendance, listAttendance, updateAttendance } from "@/services/attendance";
import type { AttendanceRecord } from "@/types";

function AttendanceActionsMenu({
  row,
  onView,
  onEdit,
  onDelete,
}: {
  row: AttendanceRecord;
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

function parseTimeMinutes(value: string | null | undefined): number {
  if (!value) {
    return 0;
  }

  const [hours, minutes] = value.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return 0;
  }

  return hours * 60 + minutes;
}

function workingHoursLabel(checkIn: string, checkOut: string): string {
  const start = parseTimeMinutes(checkIn);
  const end = parseTimeMinutes(checkOut);
  if (!start || !end) {
    return "—";
  }

  const diffMinutes = Math.max(0, end - start);
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  return `${hours}h ${minutes}m`;
}

export function AttendancePage() {
  return (
    <ResourceManager<AttendanceRecord, typeof attendanceSchema>
      title="Attendance"
      entityName="attendance record"
      description="Daily attendance entries. Time values use 24-hour HH:MM."
      schema={attendanceSchema}
      defaults={{
        employee_name: "",
        date: todayIso(),
        status: "present",
        check_in: "09:00",
        check_out: "18:00",
      }}
      list={listAttendance}
      create={createAttendance}
      update={updateAttendance}
      remove={deleteAttendance}
      searchKeys={(row) => [row.employee_name, row.status, row.date]}
      emptyTitle="No attendance records"
      emptyDescription="Add an attendance row, or confirm the backend /attendance endpoint when live API mode is on."
      fields={[
        { name: "employee_name", label: "Employee", type: "text" },
        { name: "date", label: "Date", type: "date" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "present", label: "Present" },
            { value: "absent", label: "Absent" },
            { value: "leave", label: "Leave" },
            { value: "remote", label: "Remote" },
          ],
        },
        { name: "check_in", label: "Check in", type: "time" },
        { name: "check_out", label: "Check out", type: "time" },
      ]}
      columns={[
        { key: "employee", header: "Employee", className: "table-cell align-middle", render: (row) => row.employee_name },
        { key: "date", header: "Date", className: "table-cell align-middle", render: (row) => formatDate(row.date) },
        { key: "status", header: "Status", className: "table-cell align-middle", render: (row) => <StatusBadge value={row.status} /> },
        { key: "in", header: "Check in", headerClassName: "hidden sm:table-cell", className: "hidden sm:table-cell align-middle", render: (row) => row.check_in || "—" },
        { key: "out", header: "Check out", headerClassName: "hidden sm:table-cell", className: "hidden sm:table-cell align-middle", render: (row) => row.check_out || "—" },
      ]}
      detailFields={(row) => [
        { label: "Employee Name", value: row.employee_name },
        { label: "Employee ID", value: row.id },
        { label: "Date", value: formatDate(row.date) },
        { label: "Check-in Time", value: row.check_in || "—" },
        { label: "Check-out Time", value: row.check_out || "—" },
        { label: "Attendance Status", value: <StatusBadge value={row.status} /> },
        { label: "Working Hours", value: workingHoursLabel(row.check_in, row.check_out) },
      ]}
      renderActions={(row, actions) => <AttendanceActionsMenu row={row} onView={actions.onView} onEdit={actions.onEdit} onDelete={actions.onDelete} />}
    />
  );
}
