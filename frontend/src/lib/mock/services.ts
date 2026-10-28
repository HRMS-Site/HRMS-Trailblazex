import { delay, mockStore, nextMockId } from "@/lib/mock/store";
import type { DateRange } from "@/lib/dateRange";
import type {
  AttendanceRecord,
  AttendanceWrite,
  BudgetRecord,
  BudgetWrite,
  Department,
  DepartmentWrite,
  Employee,
  EmployeeWrite,
  LeaveRecord,
  LeaveWrite,
  PayrollRecord,
  PayrollWrite,
  ProfitLossReport,
  SessionUser,
  Transaction,
  TransactionWrite,
} from "@/types";

function inRange(date: string, range: DateRange): boolean {
  return date >= range.start && date <= range.end;
}

function toNumber(value: number | string): number {
  return typeof value === "number" ? value : Number(value);
}

export async function mockLogin(email: string, password: string): Promise<SessionUser> {
  await delay();
  if (!email.trim() || !password.trim()) {
    throw new Error("Email and password are required.");
  }
  if (email.toLowerCase() === "viewer@example.com") {
    return { email, name: "Sample Viewer", role: "viewer" };
  }
  return { email, name: "Sample Administrator", role: "admin" };
}

export async function mockListEmployees(): Promise<Employee[]> {
  await delay();
  return [...mockStore.employees];
}

export async function mockCreateEmployee(body: EmployeeWrite): Promise<Employee> {
  await delay();
  const row: Employee = { ...body, id: nextMockId() };
  mockStore.employees.unshift(row);
  return row;
}

export async function mockUpdateEmployee(id: number | string, body: EmployeeWrite): Promise<Employee> {
  await delay();
  const index = mockStore.employees.findIndex((row) => String(row.id) === String(id));
  if (index < 0) {
    throw new Error("Employee not found in sample data.");
  }
  mockStore.employees[index] = { ...body, id };
  return mockStore.employees[index];
}

export async function mockDeleteEmployee(id: number | string): Promise<void> {
  await delay();
  mockStore.employees = mockStore.employees.filter((row) => String(row.id) !== String(id));
}

export async function mockListDepartments(): Promise<Department[]> {
  await delay();
  return [...mockStore.departments];
}

export async function mockCreateDepartment(body: DepartmentWrite): Promise<Department> {
  await delay();
  const row: Department = { ...body, id: nextMockId() };
  mockStore.departments.unshift(row);
  return row;
}

export async function mockUpdateDepartment(id: number | string, body: DepartmentWrite): Promise<Department> {
  await delay();
  const index = mockStore.departments.findIndex((row) => String(row.id) === String(id));
  if (index < 0) {
    throw new Error("Department not found in sample data.");
  }
  mockStore.departments[index] = { ...body, id };
  return mockStore.departments[index];
}

export async function mockDeleteDepartment(id: number | string): Promise<void> {
  await delay();
  mockStore.departments = mockStore.departments.filter((row) => String(row.id) !== String(id));
}

export async function mockListTransactions(type?: Transaction["type"]): Promise<Transaction[]> {
  await delay();
  return mockStore.transactions.filter((row) => (type ? row.type === type : true));
}

export async function mockCreateTransaction(body: TransactionWrite): Promise<Transaction> {
  await delay();
  const row: Transaction = { ...body, id: nextMockId() };
  mockStore.transactions.unshift(row);
  return row;
}

export async function mockUpdateTransaction(id: number | string, body: TransactionWrite): Promise<Transaction> {
  await delay();
  const index = mockStore.transactions.findIndex((row) => String(row.id) === String(id));
  if (index < 0) {
    throw new Error("Transaction not found in sample data.");
  }
  mockStore.transactions[index] = { ...body, id };
  return mockStore.transactions[index];
}

export async function mockDeleteTransaction(id: number | string): Promise<void> {
  await delay();
  mockStore.transactions = mockStore.transactions.filter((row) => String(row.id) !== String(id));
}

export async function mockListPayroll(): Promise<PayrollRecord[]> {
  await delay();
  return [...mockStore.payroll];
}

export async function mockCreatePayroll(body: PayrollWrite): Promise<PayrollRecord> {
  await delay();
  const row: PayrollRecord = { ...body, id: nextMockId() };
  mockStore.payroll.unshift(row);
  return row;
}

export async function mockUpdatePayroll(id: number | string, body: PayrollWrite): Promise<PayrollRecord> {
  await delay();
  const index = mockStore.payroll.findIndex((row) => String(row.id) === String(id));
  if (index < 0) {
    throw new Error("Payroll record not found in sample data.");
  }
  mockStore.payroll[index] = { ...body, id };
  return mockStore.payroll[index];
}

export async function mockDeletePayroll(id: number | string): Promise<void> {
  await delay();
  mockStore.payroll = mockStore.payroll.filter((row) => String(row.id) !== String(id));
}

export async function mockListAttendance(): Promise<AttendanceRecord[]> {
  await delay();
  return [...mockStore.attendance];
}

export async function mockCreateAttendance(body: AttendanceWrite): Promise<AttendanceRecord> {
  await delay();
  const row: AttendanceRecord = { ...body, id: nextMockId() };
  mockStore.attendance.unshift(row);
  return row;
}

export async function mockUpdateAttendance(id: number | string, body: AttendanceWrite): Promise<AttendanceRecord> {
  await delay();
  const index = mockStore.attendance.findIndex((row) => String(row.id) === String(id));
  if (index < 0) {
    throw new Error("Attendance record not found in sample data.");
  }
  mockStore.attendance[index] = { ...body, id };
  return mockStore.attendance[index];
}

export async function mockDeleteAttendance(id: number | string): Promise<void> {
  await delay();
  mockStore.attendance = mockStore.attendance.filter((row) => String(row.id) !== String(id));
}

export async function mockListLeave(): Promise<LeaveRecord[]> {
  await delay();
  return [...mockStore.leave];
}

export async function mockCreateLeave(body: LeaveWrite): Promise<LeaveRecord> {
  await delay();
  const row: LeaveRecord = { ...body, id: nextMockId() };
  mockStore.leave.unshift(row);
  return row;
}

export async function mockUpdateLeave(id: number | string, body: LeaveWrite): Promise<LeaveRecord> {
  await delay();
  const index = mockStore.leave.findIndex((row) => String(row.id) === String(id));
  if (index < 0) {
    throw new Error("Leave record not found in sample data.");
  }
  mockStore.leave[index] = { ...body, id };
  return mockStore.leave[index];
}

export async function mockDeleteLeave(id: number | string): Promise<void> {
  await delay();
  mockStore.leave = mockStore.leave.filter((row) => String(row.id) !== String(id));
}

export async function mockListBudgets(): Promise<BudgetRecord[]> {
  await delay();
  return [...mockStore.budgets];
}

export async function mockCreateBudget(body: BudgetWrite): Promise<BudgetRecord> {
  await delay();
  const row: BudgetRecord = { ...body, id: nextMockId() };
  mockStore.budgets.unshift(row);
  return row;
}

export async function mockUpdateBudget(id: number | string, body: BudgetWrite): Promise<BudgetRecord> {
  await delay();
  const index = mockStore.budgets.findIndex((row) => String(row.id) === String(id));
  if (index < 0) {
    throw new Error("Budget not found in sample data.");
  }
  mockStore.budgets[index] = { ...body, id };
  return mockStore.budgets[index];
}

export async function mockDeleteBudget(id: number | string): Promise<void> {
  await delay();
  mockStore.budgets = mockStore.budgets.filter((row) => String(row.id) !== String(id));
}

/**
 * Sample report totals are produced here to stand in for the backend
 * report endpoint. Pages must still consume this payload rather than
 * summing separately fetched lists.
 */
export async function mockProfitLoss(range: DateRange): Promise<ProfitLossReport> {
  await delay();
  const rows = mockStore.transactions.filter((row) => inRange(row.date, range));
  const totalRevenue = rows.filter((row) => row.type === "revenue").reduce((sum, row) => sum + toNumber(row.amount), 0);
  const totalExpenses = rows.filter((row) => row.type === "expense").reduce((sum, row) => sum + toNumber(row.amount), 0);
  const net = totalRevenue - totalExpenses;
  const budgets = mockStore.budgets.filter(
    (row) => row.period_end >= range.start && row.period_start <= range.end,
  );
  const allocated = budgets.reduce((sum, row) => sum + toNumber(row.allocated_amount), 0);
  const spent = budgets.reduce((sum, row) => sum + toNumber(row.spent_amount), 0);

  const departments = [...new Set(mockStore.departments.map((row) => row.name))];
  const department_summaries = departments.map((department) => {
    const related = rows.filter((row) =>
      department.toLowerCase().includes(row.category.toLowerCase()) ? false : row.category === department,
    );
    const mapped = related.length
      ? related
      : rows.filter((row) => (department === "Finance" ? row.type === "revenue" || row.category === "Facilities" : row.category === "IT" || row.category === "Services"));
    const revenue = mapped.filter((row) => row.type === "revenue").reduce((sum, row) => sum + toNumber(row.amount), 0);
    const expenses = mapped.filter((row) => row.type === "expense").reduce((sum, row) => sum + toNumber(row.amount), 0);
    return { department, revenue, expenses, net_profit: revenue - expenses };
  });

  const trends = ["2026-08", "2026-09", "2026-10"].map((period) => {
    const monthRows = mockStore.transactions.filter((row) => row.date.startsWith(period));
    return {
      period,
      revenue: monthRows.filter((row) => row.type === "revenue").reduce((sum, row) => sum + toNumber(row.amount), 0),
      expenses: monthRows.filter((row) => row.type === "expense").reduce((sum, row) => sum + toNumber(row.amount), 0),
    };
  });

  return {
    start_date: range.start,
    end_date: range.end,
    total_revenue: totalRevenue,
    total_expenses: totalExpenses,
    net_profit: net,
    profit_margin: totalRevenue === 0 ? 0 : Number(((net / totalRevenue) * 100).toFixed(2)),
    budget_utilization: allocated === 0 ? 0 : Number(((spent / allocated) * 100).toFixed(2)),
    trends,
    department_summaries,
  };
}
