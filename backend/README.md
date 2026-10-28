# Trailblazex HRMS backend (MVP)

FastAPI + SQLAlchemy + PostgreSQL API for employee records, revenue/expense transactions, a dashboard, and a date-range profit/loss report.

## Prerequisites

- Python 3.11 or newer
- PostgreSQL 14 or newer, running locally

Create a database and user (psql example — use your own password):

```sql
CREATE USER YOUR_DB_USER WITH PASSWORD 'YOUR_DB_PASSWORD';
CREATE DATABASE hrms OWNER YOUR_DB_USER;
```

If PostgreSQL is not installed, install it from https://www.postgresql.org/download/windows/ (or your OS package manager), start the service, then create the database above.

## Setup

From the `backend/` folder:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Edit `.env` and set `DATABASE_URL` with your real username and password. Tables are created automatically on startup (`create_all`).

## Run

```bash
uvicorn app.main:app --reload --app-dir .
```

- API prefix: `http://127.0.0.1:8000/api/v1`
- Health: `http://127.0.0.1:8000/health`
- Swagger UI: `http://127.0.0.1:8000/docs`

CORS is enabled for the local frontend at `http://localhost:5173`.

## Tests

Tests use an in-memory SQLite database so they do not require PostgreSQL:

```bash
pytest
```

## Contract

See `docs/api-contracts.md` in the repository root.
