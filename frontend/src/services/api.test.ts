import { describe, expect, it } from "vitest";
import { unwrapList } from "@/services/api";

describe("unwrapList", () => {
  it("accepts a bare array", () => {
    expect(unwrapList<number>([1, 2])).toEqual([1, 2]);
  });

  it("accepts FastAPI-style { items } payloads", () => {
    expect(unwrapList<string>({ items: ["a"] })).toEqual(["a"]);
  });

  it("rejects unknown shapes", () => {
    expect(() => unwrapList({ total: 0 })).toThrow(/unexpected list format/i);
  });
});
