import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AlertMessage({
  children,
  variant = "error",
}: {
  children: ReactNode;
  variant?: "error" | "info";
}) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border px-4 py-3 text-sm",
        variant === "error"
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-sky-200 bg-sky-50 text-sky-900",
      )}
    >
      {children}
    </div>
  );
}
