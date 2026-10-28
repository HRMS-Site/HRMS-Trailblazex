import { z } from "zod";

const money = z.coerce.number().positive("Enter an amount greater than zero.");
const moneyOrZero = z.coerce.number().min(0, "Amount cannot be negative.");

export const employeeSchema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  email: z.string().trim().email("Enter a valid email."),
  department: z.string().trim().min(2, "Department is required."),
  job_title: z.string().trim().min(2, "Job title is required."),
  status: z.enum(["active", "inactive"]),
});

export const departmentSchema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  code: z.string().trim().min(2, "Code is required.").max(12),
  manager_name: z.string().trim().min(2, "Manager name is required."),
});

export const transactionSchema = z.object({
  description: z.string().trim().min(2, "Description is required."),
  amount: money,
  date: z.string().min(1, "Date is required."),
  category: z.string().trim().min(2, "Category is required."),
  type: z.enum(["revenue", "expense"]),
});

export const payrollSchema = z
  .object({
    employee_name: z.string().trim().min(2, "Employee is required."),
    period_start: z.string().min(1, "Start date is required."),
    period_end: z.string().min(1, "End date is required."),
    gross_pay: money,
    deductions: moneyOrZero,
    net_pay: moneyOrZero,
    status: z.enum(["draft", "processed", "paid"]),
  })
  .refine((value) => value.period_start <= value.period_end, {
    message: "Period start must be on or before period end.",
    path: ["period_end"],
  });

export const attendanceSchema = z.object({
  employee_name: z.string().trim().min(2, "Employee is required."),
  date: z.string().min(1, "Date is required."),
  status: z.enum(["present", "absent", "leave", "remote"]),
  check_in: z.string(),
  check_out: z.string(),
});

export const leaveSchema = z
  .object({
    employee_name: z.string().trim().min(2, "Employee is required."),
    leave_type: z.string().trim().min(2, "Leave type is required."),
    start_date: z.string().min(1, "Start date is required."),
    end_date: z.string().min(1, "End date is required."),
    status: z.enum(["pending", "approved", "rejected"]),
    reason: z.string().trim().min(2, "Reason is required."),
  })
  .refine((value) => value.start_date <= value.end_date, {
    message: "Start date must be on or before end date.",
    path: ["end_date"],
  });

export const budgetSchema = z
  .object({
    department: z.string().trim().min(2, "Department is required."),
    period_start: z.string().min(1, "Start date is required."),
    period_end: z.string().min(1, "End date is required."),
    allocated_amount: money,
    spent_amount: moneyOrZero,
  })
  .refine((value) => value.period_start <= value.period_end, {
    message: "Start date must be on or before end date.",
    path: ["period_end"],
  });

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email."),
  password: z.string().min(1, "Password is required."),
});
