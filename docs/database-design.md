# Trailblazex HRMS database design (MVP)

**Owner:** Backend developer  
**Engine:** PostgreSQL 14+  
**ORM:** SQLAlchemy 2.x  
**Initialization:** `Base.metadata.create_all` on FastAPI startup (`app/database.py`)

Money is stored as `NUMERIC(14, 2)`, never as floating point. Application math uses Python `Decimal`. JSON responses serialize money as strings with two decimal places.

---

## Tables

### `employees`

| Column | Type | Notes |
|--------|------|--------|
| id | INTEGER PK | |
| full_name | VARCHAR(200) NOT NULL | |
| email | VARCHAR(255) UNIQUE NOT NULL | Indexed |
| department | VARCHAR(120) NOT NULL | Plain text in the MVP (no departments table) |
| job_title | VARCHAR(120) NOT NULL | |
| salary | NUMERIC(14, 2) NOT NULL | Greater than 0 |
| joining_date | DATE NOT NULL | |

### `transactions`

| Column | Type | Notes |
|--------|------|--------|
| id | INTEGER PK | |
| type | VARCHAR NOT NULL | `revenue` or `expense` (SQLAlchemy enum stored as string) |
| description | VARCHAR(500) NOT NULL | |
| amount | NUMERIC(14, 2) NOT NULL | Greater than 0 |
| date | DATE NOT NULL | Indexed; used for profit/loss range filters |
| category | VARCHAR(120) NOT NULL | Free-text category |

---

## Financial rules

Inclusive date filters. Invalid ranges (`start_date` later than `end_date`) return HTTP 400.

```
total_revenue     = SUM(amount) WHERE type = revenue  [and date in range for reports]
total_expenses    = SUM(amount) WHERE type = expense  [and date in range for reports]
net_profit_loss   = total_revenue - total_expenses
```

Dashboard uses all rows. The profit/loss report uses `date` between `start_date` and `end_date` inclusive.

---

## Out of scope for this MVP

Authentication, payroll, attendance, leave, budgets, forecasting, Alembic migrations, and normalized department/designation tables.
