from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import PayrollRecord
from app.schemas import PayrollCreate, PayrollOut

router = APIRouter(prefix="/payroll", tags=["payroll"])


@router.get("", response_model=list[PayrollOut])
def list_payroll(db: Session = Depends(get_db)) -> list[PayrollRecord]:
    return list(db.scalars(select(PayrollRecord).order_by(PayrollRecord.id)).all())


@router.post("", response_model=PayrollOut, status_code=status.HTTP_201_CREATED)
def create_payroll(payload: PayrollCreate, db: Session = Depends(get_db)) -> PayrollRecord:
    record = PayrollRecord(**payload.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/{record_id}", response_model=PayrollOut)
def get_payroll(record_id: int, db: Session = Depends(get_db)) -> PayrollRecord:
    record = db.get(PayrollRecord, record_id)
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payroll record not found.")
    return record


@router.put("/{record_id}", response_model=PayrollOut)
def update_payroll(
    record_id: int,
    payload: PayrollCreate,
    db: Session = Depends(get_db),
) -> PayrollRecord:
    record = db.get(PayrollRecord, record_id)
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payroll record not found.")
    for field, value in payload.model_dump().items():
        setattr(record, field, value)
    db.commit()
    db.refresh(record)
    return record


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_payroll(record_id: int, db: Session = Depends(get_db)) -> None:
    record = db.get(PayrollRecord, record_id)
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payroll record not found.")
    db.delete(record)
    db.commit()

