# Trailblazex HRMS

Professional Human Resource Management System for Trailblazex.

| Path | Owner |
|------|--------|
| `backend/` | Backend developer |
| `frontend/` | Frontend developer |
| `docs/api-contracts.md` | Backend developer (source of truth for APIs) |
| `docs/database-design.md` | Backend developer (schema and financial rules) |

The frontend must integrate only against `docs/api-contracts.md`. Do not invent endpoints or treat client-side math as authoritative financial records.

This repository currently ships an **MVP backend**: employees, financial transactions, dashboard totals, and a date-range profit/loss report. Authentication, payroll, attendance, leave, budgets, and forecasting are not included yet.

## Local development (backend)

Requirements: Python 3.11+, PostgreSQL 14+.

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Set `DATABASE_URL` in `backend/.env` (placeholders only in `.env.example`). PostgreSQL must be running and the database must exist. Tables are created on application startup.

```bash
uvicorn app.main:app --reload --app-dir .
```

- API base URL: `http://127.0.0.1:8000/api/v1`
- Health: `http://127.0.0.1:8000/health`
- Swagger: `http://127.0.0.1:8000/docs`

```bash
pytest
```

Tests use in-memory SQLite. They do not prove PostgreSQL connectivity.

If PostgreSQL is not installed, see `backend/README.md`.

## Frontend

Owned by the frontend developer. Setup instructions belong in `frontend/` once that project exists.

## Git

# Use feature branches (`feature/backend-*`, `feature/frontend-*`). Do not push directly to `main`.

# HRMS-Trailblazex
