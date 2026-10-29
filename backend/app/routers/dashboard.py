from datetime import date
from decimal import Decimal, ROUND_HALF_UP

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import BudgetRecord, Department, Employee, Transaction, TransactionType
from app.schemas import DashboardOut, DepartmentSummaryOut, ProfitLossOut, TrendPointOut

router = APIRouter(tags=["dashboard"])
TWO_PLACES = Decimal("0.01")


def _as_money(value) -> Decimal:
    if value is None:
        return Decimal("0.00")
    return Decimal(str(value)).quantize(TWO_PLACES, rounding=ROUND_HALF_UP)


def _sum_amount(db: Session, txn_type: TransactionType, start: date | None = None, end: date | None = None) -> Decimal:
    query = select(func.coalesce(func.sum(Transaction.amount), 0)).where(Transaction.type == txn_type)
    if start is not None:
        query = query.where(Transaction.date >= start)
    if end is not None:
        query = query.where(Transaction.date <= end)
    return _as_money(db.scalar(query))


def _generate_month_periods(start: date, end: date) -> list[str]:
    periods: list[str] = []
    year = start.year
    month = start.month
    end_year = end.year
    end_month = end.month

    while (year, month) <= (end_year, end_month):
        periods.append(f"{year:04d}-{month:02d}")
        if month == 12:
            year += 1
            month = 1
        else:
            month += 1
    return periods


def _calculate_trends(db: Session, start_date: date, end_date: date) -> list[TrendPointOut]:
    periods = _generate_month_periods(start_date, end_date)
    month_data: dict[str, dict[str, Decimal]] = {
        p: {"revenue": Decimal("0.00"), "expenses": Decimal("0.00")} for p in periods
    }

    # Query all transactions within the requested date range
    txns = db.execute(
        select(Transaction.type, Transaction.date, Transaction.amount)
        .where(Transaction.date >= start_date, Transaction.date <= end_date)
        .order_by(Transaction.date)
    ).all()

    for txn_type, txn_date, txn_amount in txns:
        period_key = f"{txn_date.year:04d}-{txn_date.month:02d}"
        if period_key in month_data:
            amt = Decimal(str(txn_amount))
            if txn_type == TransactionType.revenue:
                month_data[period_key]["revenue"] += amt
            elif txn_type == TransactionType.expense:
                month_data[period_key]["expenses"] += amt

    return [
        TrendPointOut(
            period=p,
            revenue=_as_money(month_data[p]["revenue"]),
            expenses=_as_money(month_data[p]["expenses"]),
        )
        for p in periods
    ]


def _calculate_budget_utilization(db: Session, start_date: date, end_date: date) -> Decimal | None:
    """
    Calculates overall budget utilization for budgets overlapping the requested date range.

    NOTE: Budget utilization is computed using BudgetRecord.spent_amount and
    BudgetRecord.allocated_amount. The spent_amount is manually entered and is
    not automatically reconciled with transaction records.
    """
    overlapping_count = db.scalar(
        select(func.count(BudgetRecord.id)).where(
            BudgetRecord.period_start <= end_date,
            BudgetRecord.period_end >= start_date,
        )
    ) or 0

    if overlapping_count == 0:
        return None

    budget_sums = db.execute(
        select(
            func.coalesce(func.sum(BudgetRecord.allocated_amount), 0),
            func.coalesce(func.sum(BudgetRecord.spent_amount), 0),
        ).where(
            BudgetRecord.period_start <= end_date,
            BudgetRecord.period_end >= start_date,
        )
    ).one()

    total_allocated = Decimal(str(budget_sums[0]))
    total_spent = Decimal(str(budget_sums[1]))

    if total_allocated <= Decimal("0.00"):
        return Decimal("0.00")

    utilization = (total_spent / total_allocated) * Decimal("100.00")
    return utilization.quantize(TWO_PLACES, rounding=ROUND_HALF_UP)


def _get_department_summaries(db: Session) -> list[DepartmentSummaryOut]:
    """
    Returns department summaries for registered departments.

    LIMITATION NOTE:
    Transaction records currently do not contain a department foreign key or department
    attribute. To avoid fabricating financial numbers or making unreliable assumptions about
    Transaction.category, department-level revenue, expenses, and net profit are explicitly
    reported as 0.00.
    """
    departments = db.scalars(select(Department).order_by(Department.name)).all()
    return [
        DepartmentSummaryOut(
            department=dept.name,
            revenue=Decimal("0.00"),
            expenses=Decimal("0.00"),
            net_profit=Decimal("0.00"),
        )
        for dept in departments
    ]


@router.get("/dashboard", response_model=DashboardOut)
def get_dashboard(db: Session = Depends(get_db)) -> DashboardOut:
    employee_count = db.scalar(select(func.count(Employee.id))) or 0
    total_revenue = _sum_amount(db, TransactionType.revenue)
    total_expenses = _sum_amount(db, TransactionType.expense)
    return DashboardOut(
        employee_count=employee_count,
        total_revenue=total_revenue,
        total_expenses=total_expenses,
        net_profit_loss=total_revenue - total_expenses,
    )


@router.get("/reports/profit-loss", response_model=ProfitLossOut)
def get_profit_loss(
    start_date: date = Query(..., description="Inclusive start date (YYYY-MM-DD)"),
    end_date: date = Query(..., description="Inclusive end date (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
) -> ProfitLossOut:
    if start_date > end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="start_date must not be later than end_date.",
        )
    total_revenue = _sum_amount(db, TransactionType.revenue, start_date, end_date)
    total_expenses = _sum_amount(db, TransactionType.expense, start_date, end_date)
    net_profit = total_revenue - total_expenses

    if total_revenue > Decimal("0.00"):
        profit_margin = ((net_profit / total_revenue) * Decimal("100.00")).quantize(
            TWO_PLACES, rounding=ROUND_HALF_UP
        )
    else:
        profit_margin = Decimal("0.00")

    trends = _calculate_trends(db, start_date, end_date)
    budget_utilization = _calculate_budget_utilization(db, start_date, end_date)
    department_summaries = _get_department_summaries(db)

    return ProfitLossOut(
        start_date=start_date,
        end_date=end_date,
        total_revenue=total_revenue,
        total_expenses=total_expenses,
        net_profit_loss=net_profit,
        net_profit=net_profit,
        profit_margin=profit_margin,
        budget_utilization=budget_utilization,
        trends=trends,
        department_summaries=department_summaries,
    )
