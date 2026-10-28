from datetime import date
from decimal import Decimal
from typing import Annotated

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_serializer

from app.models import TransactionType

Money = Annotated[Decimal, Field(gt=0, max_digits=14, decimal_places=2)]


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
