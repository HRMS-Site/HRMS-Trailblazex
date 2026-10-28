from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Transaction
from app.schemas import TransactionCreate, TransactionOut

router = APIRouter(prefix="/transactions", tags=["finance"])


@router.post("", response_model=TransactionOut, status_code=status.HTTP_201_CREATED)
def add_transaction(payload: TransactionCreate, db: Session = Depends(get_db)) -> Transaction:
    transaction = Transaction(**payload.model_dump())
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


@router.get("", response_model=list[TransactionOut])
def list_transactions(db: Session = Depends(get_db)) -> list[Transaction]:
    return list(db.scalars(select(Transaction).order_by(Transaction.id)).all())
