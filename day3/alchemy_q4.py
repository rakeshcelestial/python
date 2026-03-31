import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base


# Load environment variables
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found in .env file")


#  Mask password for safe printing
def mask_db_url(db_url):
    # postgresql://user:password@host:port/db
    try:
        prefix, rest = db_url.split("://")
        user_pass, host_part = rest.split("@")
        user, _ = user_pass.split(":")
        return f"{prefix}://{user}:***@{host_part}"
    except Exception:
        return "Invalid DATABASE_URL"


#  Create engine
engine = create_engine(DATABASE_URL, echo=False)

print(f"Engine created: {mask_db_url(DATABASE_URL)}")


#  Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

print("Session factory ready.")


#  Base class for models
Base = declarative_base()


#  Verify connection
def verify_connection():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            value = result.scalar()

            print(f"Connection verified: SELECT 1 returned {value}")
            print("Database connection successful!")

    except Exception as e:
        print(f"Database connection failed: {e}")