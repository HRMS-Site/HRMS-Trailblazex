import { isMockApiEnabled } from "@/lib/env";
import {
  mockCreateEmployee,
  mockDeleteEmployee,
  mockListEmployees,
  mockUpdateEmployee,
} from "@/lib/mock/services";
import { apiRequest, unwrapList } from "@/services/api";
import type { Employee, EmployeeWrite } from "@/types";

const PATH = "/employees";

function normalizeEmployee(record: Record<string, unknown>): Employee {
  const fullName = typeof record.full_name === "string" ? record.full_name : String(record.name ?? "");
  const status = typeof record.status === "string" && (record.status === "active" || record.status === "inactive")
    ? record.status
    : "active";
  const id = typeof record.id === "number" || typeof record.id === "string" ? record.id : 0;

  return {
    id,
    name: fullName,
    email: String(record.email ?? ""),
    department: String(record.department ?? ""),
    job_title: String(record.job_title ?? ""),
    status,
    salary: typeof record.salary === "number" || typeof record.salary === "string" ? record.salary : undefined,
    joining_date: typeof record.joining_date === "string" ? record.joining_date : undefined,
  };
}

function toBackendEmployee(body: EmployeeWrite) {
  return {
    full_name: body.name,
    email: body.email,
    department: body.department,
    job_title: body.job_title,
    salary: Number(body.salary).toFixed(2),
    joining_date: body.joining_date,
    status: body.status,
  };
}

export async function listEmployees(): Promise<Employee[]> {
  if (isMockApiEnabled()) {
    return mockListEmployees();
  }
  const payload = await apiRequest<unknown>(PATH);
  const rows = unwrapList<Record<string, unknown>>(payload);
  return rows.map(normalizeEmployee);
}

export async function createEmployee(body: EmployeeWrite): Promise<Employee> {
  if (isMockApiEnabled()) {
    return mockCreateEmployee(body);
  }
  const created = await apiRequest<Record<string, unknown>>(PATH, {
    method: "POST",
    data: toBackendEmployee(body),
  });
  return normalizeEmployee(created);
}

export async function updateEmployee(id: number | string, body: EmployeeWrite): Promise<Employee> {
  if (isMockApiEnabled()) {
    return mockUpdateEmployee(id, body);
  }
  const updated = await apiRequest<Record<string, unknown>>(`${PATH}/${id}`, {
    method: "PUT",
    data: toBackendEmployee(body),
  });
  return normalizeEmployee(updated);
}

export async function deleteEmployee(id: number | string): Promise<void> {
  if (isMockApiEnabled()) {
    return mockDeleteEmployee(id);
  }
  await apiRequest<void>(`${PATH}/${id}`, { method: "DELETE" });
}
