import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "@/auth/AuthContext";
import { DashboardPage } from "@/pages/DashboardPage";

vi.mock("@/services/employees", () => ({
  listEmployees: vi.fn(),
}));

vi.mock("@/services/reports", () => ({
  getProfitLossReport: vi.fn(),
}));

import { listEmployees } from "@/services/employees";
import { getProfitLossReport } from "@/services/reports";

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.mocked(listEmployees).mockResolvedValue([
      {
        id: 1,
        name: "Sample Person",
        email: "sample@example.com",
        department: "Finance",
        job_title: "Analyst",
        status: "active",
      },
    ]);
    vi.mocked(getProfitLossReport).mockResolvedValue({
      start_date: "2026-10-01",
      end_date: "2026-10-27",
      total_revenue: 1000,
      total_expenses: 400,
      net_profit_loss: 600,
      profit_margin: 60,
      budget_utilization: 20,
      trends: [{ period: "2026-10", revenue: 1000, expenses: 400 }],
      department_summaries: [
        { department: "Finance", revenue: 1000, expenses: 400, net_profit: 600 },
      ],
    });
  });

  it("renders report totals from the report endpoint", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <DashboardPage />
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Total employees")).toBeInTheDocument();
    });
    expect(getProfitLossReport).toHaveBeenCalled();
    expect(screen.getByText("Finance")).toBeInTheDocument();
  });

  it("shows an API error without substituting sample figures", async () => {
    vi.mocked(getProfitLossReport).mockRejectedValue(new Error("Cannot reach the API."));
    render(
      <MemoryRouter>
        <AuthProvider>
          <DashboardPage />
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/Cannot reach the API/)).toBeInTheDocument();
  });
});
