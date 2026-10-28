# Trailblazex HRMS API Contract (MVP)

**Owner:** Backend developer  
**Base URL:** `{origin}/api/v1`  
**Version:** 0.1.0 (MVP)

Local origin: `http://127.0.0.1:8000`  
Swagger UI: `http://127.0.0.1:8000/docs`

The frontend should integrate against this document. Authentication, payroll, attendance, leave, budgets, and forecasting are **not** in this MVP.

---

## Conventions

| Topic | Rule |
|--------|------|
| JSON | `Content-Type: application/json` |
| Dates | ISO 8601 date `YYYY-MM-DD` |
| Money | String with two decimal places, e.g. `"1500.00"` (never a float) |
| CORS | Allowed origin: `http://localhost:5173` |

There is no authentication header in this MVP.

---

## Errors

Validation failures (missing fields, bad email, non-positive amount, invalid enum) return **422** with FastAPI’s default body:

```json
{
  "detail": [
    {
      "type": "greater_than",
      "loc": ["body", "amount"],
      "msg": "Input should be greater than 0",
      "input": "0"
    }
  ]
}
```

Business and lookup errors return **400**, **404**, or **409** with:

```json
{
  "detail": "Employee not found."
}
```

| HTTP | When |
|------|------|
| 201 | Resource created |
| 204 | Employee deleted |
| 400 | `start_date` is later than `end_date` |
| 404 | Employee id does not exist |
| 409 | Duplicate employee email |
| 422 | Request body or query failed validation |

---

## Health

### `GET /health`

Not under `/api/v1`.

**Response 200**

```json
{
  "status": "ok"
}
```

---

## Employees

### `POST /api/v1/employees`

Create an employee.

**Request**

```json
{
  "full_name": "Ada Lovelace",
  "email": "ada@trailblazex.com",
  "department": "Engineering",
  "job_title": "Software Engineer",
  "salary": "120000.00",
  "joining_date": "2026-01-10"
}
```

| Field | Type | Rules |
|--------|------|--------|
| full_name | string | required, 1–200 chars |
| email | string | required, valid email, unique |
| department | string | required, 1–120 chars |
| job_title | string | required, 1–120 chars |
| salary | money string | required, greater than 0, max 14 digits, 2 decimal places |
| joining_date | date | required, `YYYY-MM-DD` |

**Response 201**

```json
{
  "id": 1,
  "full_name": "Ada Lovelace",
  "email": "ada@trailblazex.com",
  "department": "Engineering",
  "job_title": "Software Engineer",
  "salary": "120000.00",
  "joining_date": "2026-01-10"
}
```

**409** if the email is already used.

### `GET /api/v1/employees`

List all employees, ordered by `id`.

**Response 200:** array of employee objects (same shape as create).

### `GET /api/v1/employees/{id}`

**Response 200:** one employee object.  
**404** if not found.

### `DELETE /api/v1/employees/{id}`

**Response 204:** empty body.  
**404** if not found.

---

## Financial transactions

`type` is `revenue` or `expense`. Amounts are stored as `NUMERIC(14, 2)`.

### `POST /api/v1/transactions`

**Request**

```json
{
  "type": "revenue",
  "description": "January product sales",
  "amount": "15000.00",
  "date": "2026-01-31",
  "category": "sales"
}
```

Expense example:

```json
{
  "type": "expense",
  "description": "Office rent",
  "amount": "2500.00",
  "date": "2026-02-01",
  "category": "facilities"
}
```

| Field | Type | Rules |
|--------|------|--------|
| type | string | required, `revenue` or `expense` |
| description | string | required, 1–500 chars |
| amount | money string | required, greater than 0, max 14 digits, 2 decimal places |
| date | date | required, `YYYY-MM-DD` (used for profit/loss filtering) |
| category | string | required, 1–120 chars |

**Response 201**

```json
{
  "id": 1,
  "type": "revenue",
  "description": "January product sales",
  "amount": "15000.00",
  "date": "2026-01-31",
  "category": "sales"
}
```

### `GET /api/v1/transactions`

List all transactions, ordered by `id`.

**Response 200:** array of transaction objects.

---

## Dashboard

### `GET /api/v1/dashboard`

Totals across **all** transactions.  
`net_profit_loss = total_revenue - total_expenses`.

**Response 200**

```json
{
  "employee_count": 12,
  "total_revenue": "15000.00",
  "total_expenses": "2500.00",
  "net_profit_loss": "12500.00"
}
```

A negative `net_profit_loss` is a net loss, e.g. `"-500.00"`.

---

## Profit/loss report

### `GET /api/v1/reports/profit-loss`

Inclusive date range on `transactions.date`.

**Query parameters**

| Name | Type | Required |
|------|------|----------|
| start_date | date `YYYY-MM-DD` | yes |
| end_date | date `YYYY-MM-DD` | yes |

Example: `/api/v1/reports/profit-loss?start_date=2026-01-01&end_date=2026-01-31`

**Response 200**

```json
{
  "start_date": "2026-01-01",
  "end_date": "2026-01-31",
  "total_revenue": "15000.00",
  "total_expenses": "0.00",
  "net_profit_loss": "15000.00"
}
```

**400** if `start_date` is later than `end_date`:

```json
{
  "detail": "start_date must not be later than end_date."
}
```

**422** if a date is missing or not `YYYY-MM-DD`.
