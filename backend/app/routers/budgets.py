from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import BudgetRecord
from app.schemas import BudgetCreate, BudgetOut

router = APIRouter(prefix="/budgets", tags=["budgets"])


@router.get("", response_model=list[BudgetOut])
def list_budgets(db: Session = Depends(get_db)) -> list[BudgetRecord]:
    return list(
        db.scalars(
            select(BudgetRecord).order_by(BudgetRecord.period_start.desc(), BudgetRecord.id)
        ).all()
    )


@router.post("", response_model=BudgetOut, status_code=status.HTTP_201_CREATED)
def create_budget(payload: BudgetCreate, db: Session = Depends(get_db)) -> BudgetRecord:
    record = BudgetRecord(**payload.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/{record_id}", response_model=BudgetOut)
def get_budget(record_id: int, db: Session = Depends(get_db)) -> BudgetRecord:
    record = db.get(BudgetRecord, record_id)
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found.")
    return record


@router.put("/{record_id}", response_model=BudgetOut)
def update_budget(
    record_id: int,
    payload: BudgetCreate,
    db: Session = Depends(get_db),
) -> BudgetRecord:
    record = db.get(BudgetRecord, record_id)
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found.")
    for field, value in payload.model_dump().items():
        setattr(record, field, value)
    db.commit()
    db.refresh(record)
    return record


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_budget(record_id: int, db: Session = Depends(get_db)) -> None:
    record = db.get(BudgetRecord, record_id)
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found.")
    db.delete(record)
    db.commit()

