import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DateRangeSelector } from "@/components/shared/DateRangeSelector";

describe("DateRangeSelector", () => {
  it("notifies when the year or month changes", async () => {
    const user = userEvent.setup();
    const onYearChange = vi.fn();
    const onMonthChange = vi.fn();

    render(
      <DateRangeSelector
        year={2026}
        month={11}
        onYearChange={onYearChange}
        onMonthChange={onMonthChange}
      />,
    );

    await user.selectOptions(screen.getByLabelText("Select year"), "2025");
    await user.selectOptions(screen.getByLabelText("Select month"), "2");

    expect(onYearChange).toHaveBeenCalledWith(2025);
    expect(onMonthChange).toHaveBeenCalledWith(2);
  });

  it("shows the selected period summary for the chosen month", () => {
    render(
      <DateRangeSelector
        year={2026}
        month={11}
        onYearChange={vi.fn()}
        onMonthChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Selected Period: November 2026")).toBeInTheDocument();
    expect(screen.getByText("Start Date: 01 November 2026")).toBeInTheDocument();
    expect(screen.getByText("End Date: 30 November 2026")).toBeInTheDocument();
  });
});
