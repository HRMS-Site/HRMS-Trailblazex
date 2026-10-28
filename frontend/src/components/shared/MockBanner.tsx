import { isMockApiEnabled } from "@/lib/env";

export function MockBanner() {
  if (!isMockApiEnabled()) {
    return null;
  }

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-950">
      Sample data for frontend development only. These figures are not live Trailblazex company records.
    </div>
  );
}
