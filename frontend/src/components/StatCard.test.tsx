import { render, screen } from "@testing-library/react";
import { Users } from "lucide-react";
import { describe, expect, it } from "vitest";
import { StatCard } from "@/components/StatCard";

describe("StatCard", () => {
  it("renders the label and value", () => {
    render(<StatCard label="Total employees" value="12" icon={Users} />);
    expect(screen.getByText("Total employees")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });
});
