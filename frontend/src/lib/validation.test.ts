import { describe, expect, it } from "vitest";
import { employeeSchema, loginSchema, transactionSchema } from "@/lib/validation";

describe("form schemas", () => {
  it("rejects an invalid employee email", () => {
    const result = employeeSchema.safeParse({
      name: "Asha",
      email: "not-an-email",
      department: "HR",
      job_title: "Manager",
      status: "active",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-positive amount", () => {
    const result = transactionSchema.safeParse({
      description: "Rent",
      amount: 0,
      date: "2026-10-01",
      category: "Facilities",
      type: "expense",
    });
    expect(result.success).toBe(false);
  });

  it("requires a login password", () => {
    const result = loginSchema.safeParse({ email: "admin@example.com", password: "" });
    expect(result.success).toBe(false);
  });
});
