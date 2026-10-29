from datetime import date
from decimal import Decimal
from typing import Annotated

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_serializer

from app.models import ApprovalStatus, AttendanceStatus, PayrollStatus, TransactionType

Money = Annotated[Decimal, Field(gt=0, max_digits=14, decimal_places=2)]
MoneyOrZero = Annotated[Decimal, Field(ge=0, max_digits=14, decimal_places=2)]


# ---------------------------------------------------------------------------
# Existing schemas — unchanged
# ---------------------------------------------------------------------------


class EmployeeCreate(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    department: str = Field(..., min_length=1, max_length=120)
    job_title: str = Field(..., min_length=1, max_length=120)
    salary: Money
    joining_date: date


class EmployeeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    email: EmailStr
    department: str
    job_title: str
    salary: Decimal
    joining_date: date

    @field_serializer("salary")
    def serialize_salary(self, value: Decimal) -> str:
        return f"{value:.2f}"


class TransactionCreate(BaseModel):
    type: TransactionType
    description: str = Field(..., min_length=1, max_length=500)
    amount: Money
    date: date
    category: str = Field(..., min_length=1, max_length=120)


class TransactionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    type: TransactionType
    description: str
    amount: Decimal
    date: date
    category: str

    @field_serializer("amount")
    def serialize_amount(self, value: Decimal) -> str:
        return f"{value:.2f}"


class DashboardOut(BaseModel):
    employee_count: int
    total_revenue: Decimal
    total_expenses: Decimal
    net_profit_loss: Decimal

    @field_serializer("total_revenue", "total_expenses", "net_profit_loss")
    def serialize_money(self, value: Decimal) -> str:
        return f"{value:.2f}"


class ProfitLossOut(BaseModel):
    start_date: date
    end_date: date
    total_revenue: Decimal
    total_expenses: Decimal
    net_profit_loss: Decimal

    @field_serializer("total_revenue", "total_expenses", "net_profit_loss")
    def serialize_money(self, value: Decimal) -> str:
        return f"{value:.2f}"


# ---------------------------------------------------------------------------
# Departments
# ---------------------------------------------------------------------------


class DepartmentCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    code: str = Field(..., min_length=1, max_length=12)
    manager_name: str = Field(..., min_length=1, max_length=200)


class DepartmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    code: str
    manager_name: str


# ---------------------------------------------------------------------------
# Payroll
# ---------------------------------------------------------------------------


class PayrollCreate(BaseModel):
    employee_name: str = Field(..., min_length=1, max_length=200)
    period_start: date
    period_end: date
    gross_pay: Money
    deductions: MoneyOrZero
    net_pay: MoneyOrZero
    status: PayrollStatus = PayrollStatus.draft


class PayrollOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    employee_name: str
    period_start: date
    period_end: date
    gross_pay: Decimal
    deductions: Decimal
    net_pay: Decimal
    status: PayrollStatus

    @field_serializer("gross_pay", "deductions", "net_pay")
    def serialize_money(self, value: Decimal) -> str:
        return f"{value:.2f}"


# ---------------------------------------------------------------------------
# Attendance
# ---------------------------------------------------------------------------


class AttendanceCreate(BaseModel):
    employee_name: str = Field(..., min_length=1, max_length=200)
    date: date
    status: AttendanceStatus
    check_in: str = Field(default="", max_length=10)
    check_out: str = Field(default="", max_length=10)


class AttendanceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    employee_name: str
    date: date
    status: AttendanceStatus
    check_in: str
    check_out: str


# ---------------------------------------------------------------------------
# Leave
# ---------------------------------------------------------------------------


class LeaveCreate(BaseModel):
    employee_name: str = Field(..., min_length=1, max_length=200)
    leave_type: str = Field(..., min_length=1, max_length=120)
    start_date: date
    end_date: date
    status: ApprovalStatus = ApprovalStatus.pending
    reason: str = Field(default="", max_length=1000)


class LeaveOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    employee_name: str
    leave_type: str
    start_date: date
    end_date: date
    status: ApprovalStatus
    reason: str


# ---------------------------------------------------------------------------
# Budgets
# ---------------------------------------------------------------------------


class BudgetCreate(BaseModel):
    department: str = Field(..., min_length=1, max_length=200)
    period_start: date
    period_end: date
    allocated_amount: Money
    spent_amount: MoneyOrZero = Decimal("0.00")


class BudgetOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    department: str
    period_start: date
    period_end: date
    allocated_amount: Decimal
    spent_amount: Decimal

    @field_serializer("allocated_amount", "spent_amount")
    def serialize_money(self, value: Decimal) -> str:
        return f"{value:.2f}"
