from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import LeaveRecord
from app.schemas import LeaveCreate, LeaveOut

router = APIRouter(prefix="/leave", tags=["leave"])


@router.get("", response_model=list[LeaveOut])
def list_leave(db: Session = Depends(get_db)) -> list[LeaveRecord]:
    return list(
        db.scalars(
            select(LeaveRecord).order_by(LeaveRecord.start_date.desc(), LeaveRecord.id)
        ).all()
    )


@router.post("", response_model=LeaveOut, status_code=status.HTTP_201_CREATED)
def create_leave(payload: LeaveCreate, db: Session = Depends(get_db)) -> LeaveRecord:
    record = LeaveRecord(**payload.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/{record_id}", response_model=LeaveOut)
def get_leave(record_id: int, db: Session = Depends(get_db)) -> LeaveRecord:
    record = db.get(LeaveRecord, record_id)
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Leave record not found.")
    return record


@router.put("/{record_id}", response_model=LeaveOut)
def update_leave(
    record_id: int,
    payload: LeaveCreate,
    db: Session = Depends(get_db),
) -> LeaveRecord:
    record = db.get(LeaveRecord, record_id)
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Leave record not found.")
    for field, value in payload.model_dump().items():
        setattr(record, field, value)
    db.commit()
    db.refresh(record)
    return record


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_leave(record_id: int, db: Session = Depends(get_db)) -> None:
    record = db.get(LeaveRecord, record_id)
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Leave record not found.")
    db.delete(record)
    db.commit()

