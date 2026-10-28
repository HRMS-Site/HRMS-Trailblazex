import { describe, expect, it } from "vitest";
import { canAccessModule, canMutate } from "@/lib/permissions";

describe("permissions", () => {
  it("allows admin to open payroll and budgets", () => {
    expect(canAccessModule("admin", "payroll")).toBe(true);
    expect(canMutate("admin")).toBe(true);
  });

  it("hides payroll from viewers without treating this as a security boundary", () => {
    expect(canAccessModule("viewer", "payroll")).toBe(false);
    expect(canAccessModule("viewer", "dashboard")).toBe(true);
    expect(canMutate("viewer")).toBe(false);
  });
});
