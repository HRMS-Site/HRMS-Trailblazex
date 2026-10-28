import { ResourceManager } from "@/components/shared/ResourceManager";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate, todayIso } from "@/lib/format";
import { attendanceSchema } from "@/lib/validation";
import { createAttendance, deleteAttendance, listAttendance, updateAttendance } from "@/services/attendance";
import type { AttendanceRecord } from "@/types";

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
        { key: "employee", header: "Employee", render: (row) => row.employee_name },
        { key: "date", header: "Date", render: (row) => formatDate(row.date) },
        { key: "status", header: "Status", render: (row) => <StatusBadge value={row.status} /> },
        { key: "in", header: "Check in", render: (row) => row.check_in || "—" },
        { key: "out", header: "Check out", render: (row) => row.check_out || "—" },
      ]}
    />
  );
}
