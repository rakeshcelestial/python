import logging

from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from config import settings
from decorators.retry import retry

logger = logging.getLogger(__name__)


class Base(DeclarativeBase):
    pass


engine = create_engine(
    settings.DATABASE_URL,
    pool_size=settings.POOL_SIZE,
    max_overflow=settings.MAX_OVERFLOW,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@retry(max_attempts=3)
def verify_db_connection():
    """Verify the database connection using raw SQL SELECT 1."""
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    logger.info("Database connection verified successfully")


def get_db():
    """Dependency generator that yields a DB session and closes after request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
