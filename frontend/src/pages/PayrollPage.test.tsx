import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PayrollPage } from "@/pages/PayrollPage";

vi.mock("@/auth/AuthContext", () => ({
  useAuth: () => ({ user: null, logout: vi.fn(), requiresLogin: false }),
}));

vi.mock("@/lib/permissions", () => ({
  canMutate: () => true,
}));

const { mockPayrollRows } = vi.hoisted(() => ({
  mockPayrollRows: [
    {
      id: 1,
      employee_name: "Rahul Sharma",
      period_start: "2026-01-01",
      period_end: "2026-01-31",
      gross_pay: 35000,
      deductions: 5000,
      net_pay: 30000,
      status: "paid",
    },
  ],
}));

vi.mock("@/services/payroll", () => ({
  listPayroll: vi.fn().mockResolvedValue(mockPayrollRows),
  createPayroll: vi.fn().mockResolvedValue({ id: 1 }),
  updatePayroll: vi.fn(),
  deletePayroll: vi.fn(),
}));

describe("PayrollPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows Gross Pay, Deductions, and Net Pay in the correct order", async () => {
    render(<PayrollPage />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
      expect(screen.getByText("Rahul Sharma")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /add/i }));

    await waitFor(() => {
      expect(screen.getByLabelText("Employee")).toBeInTheDocument();
      expect(screen.getByLabelText("Period Start")).toBeInTheDocument();
      expect(screen.getByLabelText("Period End")).toBeInTheDocument();
      expect(screen.getByLabelText("Gross Pay (INR)")).toBeInTheDocument();
      expect(screen.getByLabelText("Deductions (INR)")).toBeInTheDocument();
      expect(screen.getByLabelText("Net Pay (INR)")).toBeInTheDocument();
      expect(screen.getByLabelText("Status")).toBeInTheDocument();
    });

    const labels = Array.from(document.querySelectorAll("label"))
      .map((label) => label.textContent?.trim())
      .filter((text) => text && ["Employee", "Period Start", "Period End", "Gross Pay (INR)", "Deductions (INR)", "Net Pay (INR)", "Status"].includes(text));

    expect(labels).toEqual(["Employee", "Period Start", "Period End", "Gross Pay (INR)", "Deductions (INR)", "Net Pay (INR)", "Status"]);
  });

  it("shows the actual employee name in the mobile detail dialog", async () => {
    render(<PayrollPage />);

    await waitFor(() => {
      expect(screen.getByText("Rahul Sharma")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /actions for rahul sharma/i }));
    fireEvent.click(screen.getByText("Detail"));

    await waitFor(() => {
      expect(screen.getAllByText("Rahul Sharma").length).toBeGreaterThan(0);
      expect(screen.queryByText("Unknown")).not.toBeInTheDocument();
    });
  });
});
