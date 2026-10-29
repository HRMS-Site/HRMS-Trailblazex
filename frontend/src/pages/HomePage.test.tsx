import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { HomePage } from "@/pages/HomePage";

vi.mock("@/lib/env", () => ({
  isMockApiEnabled: () => false,
}));

describe("HomePage", () => {
  it("routes the Get Started CTA to the dashboard when live API mode is active", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    const links = screen.getAllByRole("link", { name: /Get Started/i });
    expect(links.some((link) => link.getAttribute("href") === "/dashboard")).toBe(true);
  });
});
