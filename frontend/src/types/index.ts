/**
 * Working TypeScript models for the frontend.
 *
 * docs/api-contracts.md was not in the repository when this was built.
 * Field names and routes are provisional and documented in frontend/README.md.
 * Align them with the official contract before production integration.
 */

export type EmployeeStatus = "active" | "inactive";
export type TransactionType = "revenue" | "expense";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type AttendanceStatus = "present" | "absent" | "leave" | "remote";
export type PayrollStatus = "draft" | "processed" | "paid";

export interface Employee {
  id: number | string;
  name: string;
  email: string;
  department: string;
  job_title: string;
  status: EmployeeStatus;
}

export interface EmployeeWrite {
  name: string;
  email: string;
  department: string;
  job_title: string;
  status: EmployeeStatus;
}

export interface Department {
  id: number | string;
  name: string;
  code: string;
  manager_name: string;
}

export interface DepartmentWrite {
  name: string;
  code: string;
  manager_name: string;
}

export interface Transaction {
  id: number | string;
  description: string;
  amount: number | string;
  date: string;
  category: string;
  type: TransactionType;
}

export interface TransactionWrite {
  description: string;
  amount: number;
  date: string;
  category: string;
  type: TransactionType;
}

export interface PayrollRecord {
  id: number | string;
  employee_name: string;
  period_start: string;
  period_end: string;
  gross_pay: number | string;
  deductions: number | string;
  net_pay: number | string;
  status: PayrollStatus;
}

export interface PayrollWrite {
  employee_name: string;
  period_start: string;
  period_end: string;
  gross_pay: number;
  deductions: number;
  net_pay: number;
  status: PayrollStatus;
}

export interface AttendanceRecord {
  id: number | string;
  employee_name: string;
  date: string;
  status: AttendanceStatus;
  check_in: string;
  check_out: string;
}

export interface AttendanceWrite {
  employee_name: string;
  date: string;
  status: AttendanceStatus;
  check_in: string;
  check_out: string;
}

export interface LeaveRecord {
  id: number | string;
  employee_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  status: ApprovalStatus;
  reason: string;
}

export interface LeaveWrite {
  employee_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  status: ApprovalStatus;
  reason: string;
}

export interface BudgetRecord {
  id: number | string;
  department: string;
  period_start: string;
  period_end: string;
  allocated_amount: number | string;
  spent_amount: number | string;
}

export interface BudgetWrite {
  department: string;
  period_start: string;
  period_end: string;
  allocated_amount: number;
  spent_amount: number;
}

export interface TrendPoint {
  period: string;
  revenue: number | string;
  expenses: number | string;
}

export interface DepartmentSummary {
  department: string;
  revenue: number | string;
  expenses: number | string;
  net_profit: number | string;
}

export interface ProfitLossReport {
  start_date?: string;
  end_date?: string;
  total_revenue: number | string;
  total_expenses: number | string;
  net_profit: number | string;
  profit_margin?: number | string | null;
  budget_utilization?: number | string | null;
  trends?: TrendPoint[];
  department_summaries?: DepartmentSummary[];
}

export interface SessionUser {
  email: string;
  name: string;
  role: "admin" | "viewer";
}
