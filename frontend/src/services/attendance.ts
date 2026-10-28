import { isMockApiEnabled } from "@/lib/env";
import {
  mockCreateAttendance,
  mockDeleteAttendance,
  mockListAttendance,
  mockUpdateAttendance,
} from "@/lib/mock/services";
import { apiRequest, unwrapList } from "@/services/api";
import type { AttendanceRecord, AttendanceWrite } from "@/types";

const PATH = "/attendance";

export async function listAttendance(): Promise<AttendanceRecord[]> {
  if (isMockApiEnabled()) {
    return mockListAttendance();
  }
  return unwrapList<AttendanceRecord>(await apiRequest<unknown>(PATH));
}

export async function createAttendance(body: AttendanceWrite): Promise<AttendanceRecord> {
  if (isMockApiEnabled()) {
    return mockCreateAttendance(body);
  }
  return apiRequest<AttendanceRecord>(PATH, { method: "POST", data: body });
}

export async function updateAttendance(id: number | string, body: AttendanceWrite): Promise<AttendanceRecord> {
  if (isMockApiEnabled()) {
    return mockUpdateAttendance(id, body);
  }
  return apiRequest<AttendanceRecord>(`${PATH}/${id}`, { method: "PUT", data: body });
}

export async function deleteAttendance(id: number | string): Promise<void> {
  if (isMockApiEnabled()) {
    return mockDeleteAttendance(id);
  }
  await apiRequest<void>(`${PATH}/${id}`, { method: "DELETE" });
}
