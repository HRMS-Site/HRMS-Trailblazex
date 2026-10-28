import { isMockApiEnabled } from "@/lib/env";
import { mockCreateBudget, mockDeleteBudget, mockListBudgets, mockUpdateBudget } from "@/lib/mock/services";
import { apiRequest, unwrapList } from "@/services/api";
import type { BudgetRecord, BudgetWrite } from "@/types";

const PATH = "/budgets";

export async function listBudgets(): Promise<BudgetRecord[]> {
  if (isMockApiEnabled()) {
    return mockListBudgets();
  }
  return unwrapList<BudgetRecord>(await apiRequest<unknown>(PATH));
}

export async function createBudget(body: BudgetWrite): Promise<BudgetRecord> {
  if (isMockApiEnabled()) {
    return mockCreateBudget(body);
  }
  return apiRequest<BudgetRecord>(PATH, { method: "POST", data: body });
}

export async function updateBudget(id: number | string, body: BudgetWrite): Promise<BudgetRecord> {
  if (isMockApiEnabled()) {
    return mockUpdateBudget(id, body);
  }
  return apiRequest<BudgetRecord>(`${PATH}/${id}`, { method: "PUT", data: body });
}

export async function deleteBudget(id: number | string): Promise<void> {
  if (isMockApiEnabled()) {
    return mockDeleteBudget(id);
  }
  await apiRequest<void>(`${PATH}/${id}`, { method: "DELETE" });
}
