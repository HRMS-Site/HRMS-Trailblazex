import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routers import attendance, budgets, dashboard, departments, employees, finance, leave, payroll


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="Trailblazex HRMS",
    description="Simple HRMS MVP: employees, financial transactions, and profit/loss.",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Explicit allowed origins
ALLOWED_ORIGINS = [
    "https://hrms-trailblazex.vercel.app",
    "https://hrms-trailblazex.vercel.app/",
    "http://localhost:5176",
    "http://127.0.0.1:5176",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5177",
    "http://127.0.0.1:5177",
]

# Allow extending via environment variable if configured in deployment settings
_env_origins = os.getenv("ALLOWED_ORIGINS") or os.getenv("CORS_ORIGINS")
if _env_origins:
    for _origin in _env_origins.split(","):
        _clean = _origin.strip()
        if _clean and _clean not in ALLOWED_ORIGINS:
            ALLOWED_ORIGINS.append(_clean)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"^https:\/\/hrms-trailblazex(-[a-z0-9-]+)?\.vercel\.app\/?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Existing routers
app.include_router(employees.router, prefix="/api/v1")
app.include_router(finance.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")

# New routers
app.include_router(departments.router, prefix="/api/v1")
app.include_router(payroll.router, prefix="/api/v1")
app.include_router(attendance.router, prefix="/api/v1")
app.include_router(leave.router, prefix="/api/v1")
app.include_router(budgets.router, prefix="/api/v1")


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok"}
