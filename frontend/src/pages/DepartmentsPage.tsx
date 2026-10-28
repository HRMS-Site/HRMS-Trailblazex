import { ResourceManager } from "@/components/shared/ResourceManager";
import { createDepartment, deleteDepartment, listDepartments, updateDepartment } from "@/services/departments";
import { departmentSchema } from "@/lib/validation";
import type { Department } from "@/types";

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
        { key: "name", header: "Name", render: (row) => row.name },
        { key: "code", header: "Code", render: (row) => row.code },
        { key: "manager", header: "Manager", render: (row) => row.manager_name },
      ]}
    />
  );
}
