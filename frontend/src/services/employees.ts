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

export async function listEmployees(): Promise<Employee[]> {
  if (isMockApiEnabled()) {
    return mockListEmployees();
  }
  return unwrapList<Employee>(await apiRequest<unknown>(PATH));
}

export async function createEmployee(body: EmployeeWrite): Promise<Employee> {
  if (isMockApiEnabled()) {
    return mockCreateEmployee(body);
  }
  return apiRequest<Employee>(PATH, { method: "POST", data: body });
}

export async function updateEmployee(id: number | string, body: EmployeeWrite): Promise<Employee> {
  if (isMockApiEnabled()) {
    return mockUpdateEmployee(id, body);
  }
  return apiRequest<Employee>(`${PATH}/${id}`, { method: "PUT", data: body });
}

export async function deleteEmployee(id: number | string): Promise<void> {
  if (isMockApiEnabled()) {
    return mockDeleteEmployee(id);
  }
  await apiRequest<void>(`${PATH}/${id}`, { method: "DELETE" });
}
