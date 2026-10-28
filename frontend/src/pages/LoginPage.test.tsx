import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { LoginPage } from "@/pages/LoginPage";

vi.mock("@/auth/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    requiresLogin: true,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

describe("LoginPage", () => {
  it("validates empty credentials", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByText("Enter a valid email.")).toBeInTheDocument();
  });
});
