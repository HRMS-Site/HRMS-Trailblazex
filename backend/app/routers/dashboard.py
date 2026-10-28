from datetime import date
from decimal import Decimal, ROUND_HALF_UP

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Employee, Transaction, TransactionType
from app.schemas import DashboardOut, ProfitLossOut

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
    return ProfitLossOut(
        start_date=start_date,
        end_date=end_date,
        total_revenue=total_revenue,
        total_expenses=total_expenses,
        net_profit_loss=total_revenue - total_expenses,
    )
