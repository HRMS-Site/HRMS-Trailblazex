import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DateRangeSelector } from "@/components/shared/DateRangeSelector";

describe("DateRangeSelector", () => {
  it("notifies when the preset changes", async () => {
    const user = userEvent.setup();
    const onPresetChange = vi.fn();
    render(
      <DateRangeSelector
        preset="this_month"
        custom={{ start: "2026-10-01", end: "2026-10-27" }}
        onPresetChange={onPresetChange}
        onCustomChange={vi.fn()}
      />,
    );
    await user.selectOptions(screen.getByLabelText("Period"), "this_year");
    expect(onPresetChange).toHaveBeenCalledWith("this_year");
  });
});
