export type AppRole = "admin" | "viewer";

export type AppModule =
  | "dashboard"
  | "employees"
  | "departments"
  | "revenue"
  | "expenses"
  | "profit_loss"
  | "payroll"
  | "attendance"
  | "leave"
  | "budgets";

const VIEWER_DENIED: AppModule[] = ["payroll", "budgets"];

/** UI-only checks. The backend remains the security boundary. */
export function canAccessModule(role: AppRole | undefined, module: AppModule): boolean {
  if (!role) {
    return false;
  }
  if (role === "admin") {
    return true;
  }
  return !VIEWER_DENIED.includes(module);
}

export function canMutate(role: AppRole | undefined): boolean {
  return role === "admin";
}
