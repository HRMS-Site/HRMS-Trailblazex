import { isMockApiEnabled } from "@/lib/env";
import { mockCreatePayroll, mockDeletePayroll, mockListPayroll, mockUpdatePayroll } from "@/lib/mock/services";
import { apiRequest, unwrapList } from "@/services/api";
import type { PayrollRecord, PayrollWrite } from "@/types";

const PATH = "/payroll";

export async function listPayroll(): Promise<PayrollRecord[]> {
  if (isMockApiEnabled()) {
    return mockListPayroll();
  }
  return unwrapList<PayrollRecord>(await apiRequest<unknown>(PATH));
}

export async function createPayroll(body: PayrollWrite): Promise<PayrollRecord> {
  if (isMockApiEnabled()) {
    return mockCreatePayroll(body);
  }
  return apiRequest<PayrollRecord>(PATH, { method: "POST", data: body });
}

export async function updatePayroll(id: number | string, body: PayrollWrite): Promise<PayrollRecord> {
  if (isMockApiEnabled()) {
    return mockUpdatePayroll(id, body);
  }
  return apiRequest<PayrollRecord>(`${PATH}/${id}`, { method: "PUT", data: body });
}

export async function deletePayroll(id: number | string): Promise<void> {
  if (isMockApiEnabled()) {
    return mockDeletePayroll(id);
  }
  await apiRequest<void>(`${PATH}/${id}`, { method: "DELETE" });
}
