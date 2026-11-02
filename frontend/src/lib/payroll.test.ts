import { describe, expect, it } from "vitest";
import { calculateNetPay } from "@/lib/payroll";
import { payrollSchema } from "@/lib/validation";

describe("payroll calculations", () => {
  it("calculates net pay from gross pay and deductions", () => {
    expect(calculateNetPay(35000, 0)).toBe(35000);
    expect(calculateNetPay(35000, 5000)).toBe(30000);
    expect(calculateNetPay(40000, 8000)).toBe(32000);
  });

  it("treats empty values as zero and prevents negative net pay", () => {
    expect(calculateNetPay("", "")).toBe(0);
    expect(calculateNetPay(2000, 5000)).toBe(0);
  });

  it("accepts valid payroll values and rejects invalid deductions", () => {
    const valid = payrollSchema.safeParse({
      employee_name: "Jane Doe",
      period_start: "2026-01-01",
      period_end: "2026-01-31",
      gross_pay: 35000,
      deductions: 5000,
      net_pay: 30000,
      status: "draft",
    });

    expect(valid.success).toBe(true);

    const invalid = payrollSchema.safeParse({
      employee_name: "Jane Doe",
      period_start: "2026-01-31",
      period_end: "2026-01-01",
      gross_pay: 35000,
      deductions: 50000,
      net_pay: 0,
      status: "draft",
    });

    expect(invalid.success).toBe(false);
  });
});
