import { isMockApiEnabled } from "@/lib/env";
import { mockCreateLeave, mockDeleteLeave, mockListLeave, mockUpdateLeave } from "@/lib/mock/services";
import { apiRequest, unwrapList } from "@/services/api";
import type { LeaveRecord, LeaveWrite } from "@/types";

const PATH = "/leave";

export async function listLeave(): Promise<LeaveRecord[]> {
  if (isMockApiEnabled()) {
    return mockListLeave();
  }
  return unwrapList<LeaveRecord>(await apiRequest<unknown>(PATH));
}

export async function createLeave(body: LeaveWrite): Promise<LeaveRecord> {
  if (isMockApiEnabled()) {
    return mockCreateLeave(body);
  }
  return apiRequest<LeaveRecord>(PATH, { method: "POST", data: body });
}

export async function updateLeave(id: number | string, body: LeaveWrite): Promise<LeaveRecord> {
  if (isMockApiEnabled()) {
    return mockUpdateLeave(id, body);
  }
  return apiRequest<LeaveRecord>(`${PATH}/${id}`, { method: "PUT", data: body });
}

export async function deleteLeave(id: number | string): Promise<void> {
  if (isMockApiEnabled()) {
    return mockDeleteLeave(id);
  }
  await apiRequest<void>(`${PATH}/${id}`, { method: "DELETE" });
}
