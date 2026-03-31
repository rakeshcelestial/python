from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

#  Load environment variables
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

#  Create engine with connection pool configuration
engine = create_engine(
    DATABASE_URL,
    pool_size=5,          # Number of persistent connections in pool
    max_overflow=10,      # Extra connections allowed beyond pool_size
    pool_timeout=30,      # Wait time (seconds) before giving timeout error
    pool_recycle=1800,    # Recycle connections after 30 mins (avoid stale connections)
    pool_pre_ping=True    # Checks connection before using (important for Supabase)
)

#  Create session factory
Session = sessionmaker(bind=engine)


#  Main execution
if __name__ == "__main__":
    sessions = []

    try:
        # Open 3 sessions and check pool status
        for i in range(3):
            s = Session()
            s.execute(text("SELECT 1"))  # Force connection checkout
            sessions.append(s)

            print(f"After opening session {i+1}: {engine.pool.status()}")

    finally:
        # Close all sessions properly
        for s in sessions:
            s.close()

        print(f"\nAfter closing all: {engine.pool.status()}")
