import { ResourceManager } from "@/components/shared/ResourceManager";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate, todayIso } from "@/lib/format";
import { leaveSchema } from "@/lib/validation";
import { createLeave, deleteLeave, listLeave, updateLeave } from "@/services/leave";
import type { LeaveRecord } from "@/types";

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
        { key: "employee", header: "Employee", render: (row) => row.employee_name },
        { key: "type", header: "Type", render: (row) => row.leave_type },
        { key: "start", header: "Start", render: (row) => formatDate(row.start_date) },
        { key: "end", header: "End", render: (row) => formatDate(row.end_date) },
        { key: "status", header: "Status", render: (row) => <StatusBadge value={row.status} /> },
        { key: "reason", header: "Reason", render: (row) => row.reason },
      ]}
    />
  );
}
