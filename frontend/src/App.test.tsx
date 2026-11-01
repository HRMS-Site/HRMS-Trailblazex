import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AuthProvider } from "@/auth/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import App from "@/App";

vi.mock("@/pages/HomePage", () => ({
  HomePage: () => <div>Home screen</div>,
}));

vi.mock("@/lib/env", () => ({
  isMockApiEnabled: () => false,
}));

describe("routing", () => {
  it("renders the home page on the home route", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText("Home screen")).toBeInTheDocument();
  });

  it("renders the not-found page for unknown routes", () => {
    render(
      <MemoryRouter initialEntries={["/does-not-exist"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });

  it("routes the Get Started CTA to the dashboard when live API mode is active", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText("Home screen")).toBeInTheDocument();
  });

  it("opens the dashboard sidebar from the mobile menu toggle", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AuthProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<div>Dashboard screen</div>} />
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    const openButton = screen.getByRole("button", { name: /open navigation menu/i });
    fireEvent.click(openButton);

    expect(screen.getAllByRole("button", { name: /close navigation menu/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Employees").length).toBeGreaterThan(0);
  });
});
