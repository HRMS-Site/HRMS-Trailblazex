import logging
import os
from collections.abc import Generator

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker
from sqlalchemy.pool import StaticPool

logger = logging.getLogger(__name__)

load_dotenv()


def _database_url() -> str:
    url = os.getenv("DATABASE_URL")
    if url:
        return url

    user = os.getenv("POSTGRES_USER")
    password = os.getenv("POSTGRES_PASSWORD")
    host = os.getenv("POSTGRES_HOST", "localhost")
    port = os.getenv("POSTGRES_PORT", "5432")
    name = os.getenv("POSTGRES_DB")
    if user and password and name:
        return f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{name}"

    raise RuntimeError(
        "Database is not configured. Set DATABASE_URL or POSTGRES_USER, "
        "POSTGRES_PASSWORD, and POSTGRES_DB in backend/.env (see .env.example)."
    )


DATABASE_URL = _database_url()

connect_args: dict = {}
engine_kwargs: dict = {}

if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False
    engine_kwargs["poolclass"] = StaticPool
else:
    engine_kwargs["pool_pre_ping"] = True
    connect_args["connect_timeout"] = 5

engine = create_engine(DATABASE_URL, connect_args=connect_args, **engine_kwargs)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    from app import models  # noqa: F401
    from sqlalchemy import text
    from sqlalchemy.exc import SQLAlchemyError

    Base.metadata.create_all(bind=engine)
    if not DATABASE_URL.startswith("sqlite"):
        try:
            with engine.begin() as conn:
                conn.execute(
                    text("ALTER TABLE employees ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' NOT NULL")
                )
        except SQLAlchemyError as exc:
            logger.error("Failed to ensure employees.status column in database: %s", exc, exc_info=True)
            raise RuntimeError(
                f"Database migration failed: could not ensure 'status' column on 'employees' table. Error: {exc}"
            ) from exc
