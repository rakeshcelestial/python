import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from sqlalchemy import text

from config import settings
from database import Base, engine, verify_db_connection
from exceptions.custom_exceptions import (
    AppException,
    app_exception_handler,
    generic_exception_handler,
    validation_exception_handler,
)
from middleware.logging_middleware import RequestLoggingMiddleware
from routers import admin_router, analytics_router, auth_router, loan_router

# ─── Logging Setup ─────────────────────────────────────────────────────────────
os.makedirs("logs", exist_ok=True)
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL, logging.INFO),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("logs/app.log"),
    ],
)
logger = logging.getLogger(__name__)


# ─── Lifespan ──────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.APP_NAME}...")

    # Import models so SQLAlchemy registers them before create_all
    from models import db_models  # noqa: F401

    # Create tables (idempotent — won't drop existing)
    Base.metadata.create_all(bind=engine)

    # Verify DB connection with @retry decorator
    try:
        verify_db_connection()
    except Exception as exc:
        logger.error(f"Database connection failed after retries: {exc}")
        raise

    # Seed admin user
    from database import SessionLocal
    from services.user_service import UserService
    db = SessionLocal()
    try:
        UserService(db).seed_admin(
            username=settings.ADMIN_USERNAME,
            email=settings.ADMIN_EMAIL,
            password=settings.ADMIN_PASSWORD,
        )
    finally:
        db.close()

    logger.info(f"{settings.APP_NAME} started successfully")
    yield
    logger.info(f"{settings.APP_NAME} shutting down")


# ─── App Instance ──────────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    description="Loan Application & Management System",
    version="1.0.0",
    lifespan=lifespan,
)

# ─── Middleware ────────────────────────────────────────────────────────────────
app.add_middleware(RequestLoggingMiddleware)

# ─── Exception Handlers ────────────────────────────────────────────────────────
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# ─── Routers ──────────────────────────────────────────────────────────────────
app.include_router(auth_router.router)
app.include_router(loan_router.router)
app.include_router(admin_router.router)
app.include_router(analytics_router.router)


# ─── Health Endpoint ──────────────────────────────────────────────────────────
@app.get("/health", tags=["Utility"])
def health_check():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as exc:
        db_status = f"error: {exc}"
    return {"status": "ok", "app": settings.APP_NAME, "database": db_status}
