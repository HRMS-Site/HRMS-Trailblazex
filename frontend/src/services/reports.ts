import { isMockApiEnabled } from "@/lib/env";
import { mockProfitLoss } from "@/lib/mock/services";
import { apiRequest, toQueryString } from "@/services/api";
import type { ProfitLossReport } from "@/types";

export async function getProfitLossReport(
  startDate: string,
  endDate: string,
): Promise<ProfitLossReport> {
  if (isMockApiEnabled()) {
    return mockProfitLoss({ start: startDate, end: endDate });
  }
  const query = toQueryString({ start_date: startDate, end_date: endDate });
  return apiRequest<ProfitLossReport>(`/reports/profit-loss${query}`);
}
