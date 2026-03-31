# LoanHub — Loan Application & Management System

A production-grade REST API built with **FastAPI | SQLAlchemy | PostgreSQL (Supabase) | Alembic**.

---

## Quick Start

### 1. Clone & setup virtual environment
```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure environment
Copy `.env` and fill in your Supabase credentials:
```
DATABASE_URL=postgresql://postgres:<password>@<host>:5432/postgres
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin1234
ADMIN_EMAIL=admin@loanhub.com
```

### 3. Run Alembic migrations
```bash
# First migration — creates users & loans tables
alembic upgrade head

# (Optional) Generate second migration for credit_score column
alembic revision --autogenerate -m "add credit_score to loans"
alembic upgrade head

# Demonstrate rollback
alembic downgrade -1

# Re-apply
alembic upgrade head
```

### 4. Start the server
```bash
uvicorn main:app --reload
```
Visit **http://localhost:8000/docs** for the interactive Swagger UI.

---

## Project Structure

```
loanhub/
├── main.py                     # App entrypoint, lifespan, admin seeding
├── config.py                   # Pydantic Settings (.env)
├── database.py                 # Engine, SessionLocal, Base, get_db()
├── models/
│   ├── enums.py                # UserRole, LoanPurpose, EmploymentStatus, LoanStatus
│   ├── db_models.py            # SQLAlchemy ORM: User, Loan
│   └── schemas.py              # Pydantic request/response schemas
├── services/
│   ├── user_service.py         # Registration, login, user logic
│   ├── loan_service.py         # Loan application, review logic
│   └── analytics_service.py   # Dashboard stats with comprehensions
├── repositories/
│   ├── base_repository.py      # Abstract BaseRepository (ABC / ISP)
│   └── sqlalchemy_repository.py # Concrete SQLAlchemy implementation (LSP)
├── routers/
│   ├── auth_router.py          # POST /auth/register, /auth/login
│   ├── loan_router.py          # POST /loans, GET /loans/my, /loans/my/{id}
│   ├── admin_router.py         # GET/PATCH /admin/loans + bulk-check
│   └── analytics_router.py    # GET /analytics/summary
├── decorators/
│   ├── timer.py                # @timer — execution time logging
│   ├── retry.py                # @retry(max_attempts) — connection retries
│   └── auth.py                 # @require_role(role) — role enforcement
├── middleware/
│   └── logging_middleware.py  # Request logging → logs/app.log
├── exceptions/
│   └── custom_exceptions.py   # 8 custom exceptions + global handlers
├── utils/
│   └── notifications.py       # OCP strategy pattern + asyncio.gather
├── alembic/
│   ├── env.py
│   └── versions/
│       ├── 001_initial.py      # Create users & loans tables
│       └── 002_add_credit_score.py
├── tests/
│   ├── conftest.py             # Fixtures (SQLite in-memory)
│   ├── test_auth.py            # 5 auth tests
│   ├── test_loans.py           # 5 loan tests
│   └── test_admin.py           # 5 admin tests
├── logs/
│   ├── app.log
│   └── notifications.log
├── LoanHub-API.postman_collection.json
├── alembic.ini
├── requirements.txt
└── .env
```

---

## API Endpoints

| Method | Endpoint | Who | Description |
|--------|----------|-----|-------------|
| POST | /auth/register | Public | Register new user |
| POST | /auth/login | Public | Login (user or admin) |
| POST | /loans | User | Submit loan application |
| GET | /loans/my | User | List my loans |
| GET | /loans/my/{id} | User | View single loan |
| GET | /admin/loans | Admin | List all loans with filters |
| GET | /admin/loans/{id} | Admin | View any loan detail |
| PATCH | /admin/loans/{id}/review | Admin | Approve or reject loan |
| POST | /admin/loans/bulk-check | Admin | Bulk eligibility check (threading) |
| GET | /analytics/summary | Admin | Loan statistics |
| GET | /health | Public | DB health check |

> **Authentication:** Pass `?user_id=<id>` as a query parameter on all protected endpoints.

---

## Running Tests

```bash
pytest tests/ -v
```

Expected: **15 tests passing**.

---

## Key Design Patterns

| Pattern | Where Used |
|---------|-----------|
| SOLID (all 5) | Services, Repositories, Notifications |
| Repository Pattern | `BaseRepository` ABC + `SQLAlchemyRepository` |
| Strategy Pattern (OCP) | `NotificationStrategy` — Console, LogFile, Email, SMS, Push |
| Decorator Pattern | `@timer`, `@retry`, `@require_role` |
| Dependency Injection | FastAPI `Depends(get_db)` |
| Background Tasks | FastAPI `BackgroundTasks` on loan apply & review |
| Threading | `ThreadPoolExecutor` in `/admin/loans/bulk-check` |
| Async Concurrency | `asyncio.gather()` for multi-channel notifications |
