import { afterEach, describe, expect, it, vi } from "vitest";
import { listTransactions } from "@/services/transactions";

vi.mock("@/services/api", () => ({
  apiRequest: vi.fn(async () => [
    { id: 1, description: "Client retainer", amount: 1000, date: "2026-10-03", category: "Services", type: "revenue" },
    { id: 2, description: "Office rent", amount: 500, date: "2026-10-05", category: "Facilities", type: "expense" },
    { id: 3, description: "Software license", amount: 300, date: "2026-09-12", category: "IT", type: "expense" },
  ]),
  unwrapList: vi.fn((payload) => payload),
  toQueryString: vi.fn((params) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) {
        search.set(key, String(value));
      }
    }
    const query = search.toString();
    return query ? `?${query}` : "";
  }),
}));

describe("transactions service", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns only the requested transaction type even when the API returns mixed results", async () => {
    const revenueRows = await listTransactions("revenue");
    const expenseRows = await listTransactions("expense");

    expect(revenueRows.every((row) => row.type === "revenue")).toBe(true);
    expect(expenseRows.every((row) => row.type === "expense")).toBe(true);
    expect(revenueRows.some((row) => row.type === "expense")).toBe(false);
    expect(expenseRows.some((row) => row.type === "revenue")).toBe(false);
  });
});
