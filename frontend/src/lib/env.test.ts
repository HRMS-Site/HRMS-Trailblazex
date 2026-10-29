import { describe, expect, it } from "vitest";
import { getApiBaseUrl, isMockApiEnabled } from "./env";

describe("environment configuration", () => {
  it("uses the live API when mock mode is disabled", () => {
    expect(import.meta.env.VITE_USE_MOCK_API).toBe("false");
    expect(isMockApiEnabled()).toBe(false);
    expect(getApiBaseUrl()).toBe("https://hrms-trailblazex.onrender.com/api/v1");
  });
});
