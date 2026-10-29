import type {
  AttendanceRecord,
  BudgetRecord,
  Department,
  Employee,
  LeaveRecord,
  PayrollRecord,
  Transaction,
} from "@/types";

/** Sample records for UI development only. Not live Trailblazex company data. */
export const mockStore: {
  employees: Employee[];
  departments: Department[];
  transactions: Transaction[];
  payroll: PayrollRecord[];
  attendance: AttendanceRecord[];
  leave: LeaveRecord[];
  budgets: BudgetRecord[];
} = {
  employees: [
    {
      id: 1,
      name: "Asha Rao",
      email: "asha.rao@example.com",
      department: "People Operations",
      job_title: "HR Manager",
      status: "active",
    },
    {
      id: 2,
      name: "Vikram Shah",
      email: "vikram.shah@example.com",
      department: "Finance",
      job_title: "Accountant",
      status: "active",
    },
    {
      id: 3,
      name: "Meera Iyer",
      email: "meera.iyer@example.com",
      department: "Engineering",
      job_title: "Software Engineer",
      status: "inactive",
    },
  ] satisfies Employee[],
  departments: [
    { id: 1, name: "People Operations", code: "PEO", manager_name: "Asha Rao" },
    { id: 2, name: "Finance", code: "FIN", manager_name: "Vikram Shah" },
    { id: 3, name: "Engineering", code: "ENG", manager_name: "Meera Iyer" },
  ] satisfies Department[],
  transactions: [
    {
      id: 1,
      description: "Sample client retainer",
      amount: 480000,
      date: "2026-10-03",
      category: "Services",
      type: "revenue",
    },
    {
      id: 2,
      description: "Sample office rent",
      amount: 95000,
      date: "2026-10-05",
      category: "Facilities",
      type: "expense",
    },
    {
      id: 3,
      description: "Sample software licences",
      amount: 42000,
      date: "2026-09-12",
      category: "IT",
      type: "expense",
    },
    {
      id: 4,
      description: "Sample training workshop",
      amount: 125000,
      date: "2026-09-20",
      category: "Services",
      type: "revenue",
    },
  ] satisfies Transaction[],
  payroll: [
    {
      id: 1,
      employee_name: "Asha Rao",
      period_start: "2026-10-01",
      period_end: "2026-10-31",
      gross_pay: 120000,
      deductions: 12000,
      net_pay: 108000,
      status: "processed",
    },
  ] satisfies PayrollRecord[],
  attendance: [
    {
      id: 1,
      employee_name: "Asha Rao",
      date: "2026-10-27",
      status: "present",
      check_in: "09:12",
      check_out: "18:05",
    },
    {
      id: 2,
      employee_name: "Vikram Shah",
      date: "2026-10-27",
      status: "remote",
      check_in: "09:40",
      check_out: "17:50",
    },
  ] satisfies AttendanceRecord[],
  leave: [
    {
      id: 1,
      employee_name: "Meera Iyer",
      leave_type: "Annual",
      start_date: "2026-11-02",
      end_date: "2026-11-06",
      status: "pending",
      reason: "Sample personal travel",
    },
  ] satisfies LeaveRecord[],
  budgets: [
    {
      id: 1,
      department: "Engineering",
      period_start: "2026-10-01",
      period_end: "2026-12-31",
      allocated_amount: 750000,
      spent_amount: 42000,
    },
    {
      id: 2,
      department: "Finance",
      period_start: "2026-10-01",
      period_end: "2026-12-31",
      allocated_amount: 400000,
      spent_amount: 95000,
    },
  ] satisfies BudgetRecord[],
};

let nextId = 100;

export function nextMockId(): number {
  nextId += 1;
  return nextId;
}

export function delay(ms = 180): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
