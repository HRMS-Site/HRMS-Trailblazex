import { describe, expect, it } from "vitest";
import { resolveDateRange } from "@/lib/dateRange";

const now = new Date(2026, 9, 27);

describe("resolveDateRange", () => {
  it("resolves this month through today", () => {
    expect(resolveDateRange("this_month", { start: "2020-01-01", end: "2020-01-02" }, now)).toEqual({
      start: "2026-10-01",
      end: "2026-10-27",
    });
  });

  it("resolves last month as a closed range", () => {
    expect(resolveDateRange("last_month", { start: "2020-01-01", end: "2020-01-02" }, now)).toEqual({
      start: "2026-09-01",
      end: "2026-09-30",
    });
  });

  it("resolves this quarter", () => {
    expect(resolveDateRange("this_quarter", { start: "2020-01-01", end: "2020-01-02" }, now)).toEqual({
      start: "2026-10-01",
      end: "2026-10-27",
    });
  });

  it("resolves this year", () => {
    expect(resolveDateRange("this_year", { start: "2020-01-01", end: "2020-01-02" }, now)).toEqual({
      start: "2026-01-01",
      end: "2026-10-27",
    });
  });

  it("keeps a custom range", () => {
    const custom = { start: "2026-02-01", end: "2026-02-28" };
    expect(resolveDateRange("custom", custom, now)).toEqual(custom);
  });
});
