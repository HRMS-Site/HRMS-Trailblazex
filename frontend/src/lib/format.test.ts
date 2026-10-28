import { describe, expect, it } from "vitest";
import { formatCurrency, formatInteger, toIsoDate } from "@/lib/format";

describe("formatCurrency", () => {
  it("formats INR amounts", () => {
    expect(formatCurrency(1500)).toContain("1,500.00");
  });

  it("returns a dash for invalid values", () => {
    expect(formatCurrency(undefined)).toBe("—");
    expect(formatCurrency("abc")).toBe("—");
  });
});

describe("formatInteger", () => {
  it("formats whole numbers", () => {
    expect(formatInteger(12)).toBe("12");
  });
});

describe("toIsoDate", () => {
  it("formats a calendar date as YYYY-MM-DD", () => {
    expect(toIsoDate(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});
