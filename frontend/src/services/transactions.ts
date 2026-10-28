import { isMockApiEnabled } from "@/lib/env";
import {
  mockCreateTransaction,
  mockDeleteTransaction,
  mockListTransactions,
  mockUpdateTransaction,
} from "@/lib/mock/services";
import { apiRequest, toQueryString, unwrapList } from "@/services/api";
import type { Transaction, TransactionWrite } from "@/types";

const PATH = "/transactions";

export async function listTransactions(type?: Transaction["type"]): Promise<Transaction[]> {
  if (isMockApiEnabled()) {
    return mockListTransactions(type);
  }
  const query = toQueryString({ type });
  return unwrapList<Transaction>(await apiRequest<unknown>(`${PATH}${query}`));
}

export async function createTransaction(body: TransactionWrite): Promise<Transaction> {
  if (isMockApiEnabled()) {
    return mockCreateTransaction(body);
  }
  return apiRequest<Transaction>(PATH, { method: "POST", data: body });
}

export async function updateTransaction(id: number | string, body: TransactionWrite): Promise<Transaction> {
  if (isMockApiEnabled()) {
    return mockUpdateTransaction(id, body);
  }
  return apiRequest<Transaction>(`${PATH}/${id}`, { method: "PUT", data: body });
}

export async function deleteTransaction(id: number | string): Promise<void> {
  if (isMockApiEnabled()) {
    return mockDeleteTransaction(id);
  }
  await apiRequest<void>(`${PATH}/${id}`, { method: "DELETE" });
}
