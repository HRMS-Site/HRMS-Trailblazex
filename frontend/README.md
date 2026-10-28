# Trailblazex HRMS frontend

React + TypeScript + Vite application for Trailblazex HR and finance operations. The Python FastAPI backend is owned by another developer. This folder is the frontend ownership boundary.

## Setup

```bash
cd frontend
npm install
copy .env.example .env.local
```

On macOS or Linux, use `cp .env.example .env.local`.

## Development server

```bash
npm run dev
```

Open the URL Vite prints, usually `http://localhost:5173`.

## Build

```bash
npm run build
```

Preview the production build with `npm run preview`.

## Tests

```bash
npm run test
```

Watch mode: `npm run test:watch`. Lint: `npm run lint`.

## Environment

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Backend origin and API prefix. No trailing slash. |
| `VITE_USE_MOCK_API` | `true` uses in-memory sample data. `false` calls the real API. |

Do not hardcode hosts in components. Restart Vite after changing env files.

`.env.example` contains placeholders only.

## Sample data vs live API

`docs/api-contracts.md` was not in the repository when this frontend was built. Until that contract is published, keep `VITE_USE_MOCK_API=true`.

When the flag is `true`, every management screen and the dashboard use **sample data for UI development only**. A banner states that the figures are not live Trailblazex records.

When the flag is `false`, the Axios client calls `VITE_API_BASE_URL`. Failed live requests are shown as errors. They **never** fall back to sample data.

Switching off mock mode is the only change required to aim at a real backend. Then update `src/types` and `src/services` to match the published contract exactly.

### Screens currently using sample data (when `VITE_USE_MOCK_API=true`)

- Login (mock session only; no token format is invented)
- Dashboard
- Employees
- Departments
- Revenue
- Expenses
- Profit & Loss
- Payroll
- Attendance
- Leave
- Budgets

### Missing contract

Coordinate with the backend developer before treating the paths below as final. They are working assumptions so the UI can be built.

| Area | Assumed method and path |
| --- | --- |
| Employees | `GET/POST /employees`, `PUT/DELETE /employees/{id}` |
| Departments | `GET/POST /departments`, `PUT/DELETE /departments/{id}` |
| Transactions | `GET/POST /transactions`, `PUT/DELETE /transactions/{id}` (`type=revenue` or `expense`) |
| Profit & loss | `GET /reports/profit-loss?start_date=&end_date=` |
| Payroll | `GET/POST /payroll`, `PUT/DELETE /payroll/{id}` |
| Attendance | `GET/POST /attendance`, `PUT/DELETE /attendance/{id}` |
| Leave | `GET/POST /leave`, `PUT/DELETE /leave/{id}` |
| Budgets | `GET/POST /budgets`, `PUT/DELETE /budgets/{id}` |
| Authentication | **Not implemented live.** No token format is assumed. |

List endpoints may return an array or `{ items | data | results }`.

Financial cards always render `total_revenue`, `total_expenses`, and `net_profit` from the report payload. Optional `profit_margin`, `budget_utilization`, `trends`, and `department_summaries` display when present and show empty/unavailable states when omitted.

Currency is formatted as INR (₹). Dates use `YYYY-MM-DD` on the wire and `en-IN` in the UI.

## Authentication

Live login is blocked until the API contract defines the request, response, and expiry behaviour.

In sample-data mode:

- Any email except `viewer@example.com` signs in as an administrator (any password).
- `viewer@example.com` is a read-mostly viewer. Payroll and budgets are hidden in the UI only.

Frontend permission checks are not a security boundary.

## Out of scope

Employee document management, training, employee self-service, and financial forecasting are not part of this frontend.
