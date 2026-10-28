import { ResourceManager } from "@/components/shared/ResourceManager";
import { StatusBadge } from "@/components/StatusBadge";
import { createEmployee, deleteEmployee, listEmployees, updateEmployee } from "@/services/employees";
import { employeeSchema } from "@/lib/validation";
import type { Employee } from "@/types";

export function EmployeesPage() {
  return (
    <ResourceManager<Employee, typeof employeeSchema>
      title="Employees"
      entityName="employee"
      description="Maintain the employee directory. Client checks are for usability; the backend is the authority."
      schema={employeeSchema}
      defaults={{ name: "", email: "", department: "", job_title: "", status: "active" }}
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
        { key: "name", header: "Name", render: (row) => row.name },
        { key: "email", header: "Email", render: (row) => row.email },
        { key: "department", header: "Department", render: (row) => row.department },
        { key: "title", header: "Job title", render: (row) => row.job_title },
        { key: "status", header: "Status", render: (row) => <StatusBadge value={row.status} /> },
      ]}
    />
  );
}
