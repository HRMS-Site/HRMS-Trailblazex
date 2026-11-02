import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EmployeesPage } from "@/pages/EmployeesPage";

const { mockEmployees } = vi.hoisted(() => ({
  mockEmployees: [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      department: "IT",
      job_title: "Senior Engineer",
      status: "active",
    },
    {
      id: 2,
      name: "Priya Singh",
      email: "priya.singh@example.com",
      department: "Finance",
      job_title: "Analyst",
      status: "inactive",
    },
  ],
}));

vi.mock("@/auth/AuthContext", () => ({
  useAuth: () => ({ user: null, logout: vi.fn(), requiresLogin: false }),
}));

vi.mock("@/services/employees", () => ({
  listEmployees: vi.fn().mockResolvedValue(mockEmployees),
  createEmployee: vi.fn(),
  updateEmployee: vi.fn(),
  deleteEmployee: vi.fn(),
}));

vi.mock("@/lib/permissions", () => ({
  canMutate: () => true,
}));

describe("EmployeesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the compact employee table and opens the action menu and details dialog", async () => {
    const { container } = render(
      <MemoryRouter>
        <EmployeesPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Rahul Sharma")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Department")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getByText("rahul.sharma@example.com")).toBeInTheDocument();
    expect(container.querySelector(".overflow-x-auto")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /actions for rahul sharma/i }));

    await waitFor(() => {
      expect(screen.getByText("View Details")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("View Details"));

    await waitFor(() => {
      expect(screen.getByText("Full Name")).toBeInTheDocument();
      expect(screen.getAllByText("Rahul Sharma").length).toBeGreaterThan(0);
      expect(screen.getByText("Senior Engineer")).toBeInTheDocument();
    });
  });
});
