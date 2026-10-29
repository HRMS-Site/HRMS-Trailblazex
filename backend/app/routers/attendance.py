from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import AttendanceRecord
from app.schemas import AttendanceCreate, AttendanceOut

router = APIRouter(prefix="/attendance", tags=["attendance"])


@router.get("", response_model=list[AttendanceOut])
def list_attendance(db: Session = Depends(get_db)) -> list[AttendanceRecord]:
    return list(
        db.scalars(
            select(AttendanceRecord).order_by(AttendanceRecord.date.desc(), AttendanceRecord.id)
        ).all()
    )


@router.post("", response_model=AttendanceOut, status_code=status.HTTP_201_CREATED)
def create_attendance(payload: AttendanceCreate, db: Session = Depends(get_db)) -> AttendanceRecord:
    record = AttendanceRecord(**payload.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/{record_id}", response_model=AttendanceOut)
def get_attendance(record_id: int, db: Session = Depends(get_db)) -> AttendanceRecord:
    record = db.get(AttendanceRecord, record_id)
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attendance record not found.")
    return record


@router.put("/{record_id}", response_model=AttendanceOut)
def update_attendance(
    record_id: int,
    payload: AttendanceCreate,
    db: Session = Depends(get_db),
) -> AttendanceRecord:
    record = db.get(AttendanceRecord, record_id)
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attendance record not found.")
    for field, value in payload.model_dump().items():
        setattr(record, field, value)
    db.commit()
    db.refresh(record)
    return record


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_attendance(record_id: int, db: Session = Depends(get_db)) -> None:
    record = db.get(AttendanceRecord, record_id)
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attendance record not found.")
    db.delete(record)
    db.commit()

