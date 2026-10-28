import { isMockApiEnabled } from "@/lib/env";
import {
  mockCreateDepartment,
  mockDeleteDepartment,
  mockListDepartments,
  mockUpdateDepartment,
} from "@/lib/mock/services";
import { apiRequest, unwrapList } from "@/services/api";
import type { Department, DepartmentWrite } from "@/types";

const PATH = "/departments";

export async function listDepartments(): Promise<Department[]> {
  if (isMockApiEnabled()) {
    return mockListDepartments();
  }
  return unwrapList<Department>(await apiRequest<unknown>(PATH));
}

export async function createDepartment(body: DepartmentWrite): Promise<Department> {
  if (isMockApiEnabled()) {
    return mockCreateDepartment(body);
  }
  return apiRequest<Department>(PATH, { method: "POST", data: body });
}

export async function updateDepartment(id: number | string, body: DepartmentWrite): Promise<Department> {
  if (isMockApiEnabled()) {
    return mockUpdateDepartment(id, body);
  }
  return apiRequest<Department>(`${PATH}/${id}`, { method: "PUT", data: body });
}

export async function deleteDepartment(id: number | string): Promise<void> {
  if (isMockApiEnabled()) {
    return mockDeleteDepartment(id);
  }
  await apiRequest<void>(`${PATH}/${id}`, { method: "DELETE" });
}
