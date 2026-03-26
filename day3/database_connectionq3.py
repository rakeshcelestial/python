import psycopg2
from psycopg2 import errors
from dotenv import load_dotenv
import os


def run_raw_query():
    # Load environment variables
    load_dotenv()
    DATABASE_URL = os.getenv("DATABASE_URL")
   

    conn = None
    cursor = None

    try:
        # Connect to Supabase PostgreSQL
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        print("Connected to Supabase successfully!\n")

        # Updated query (users ➝ customer)
        query = "SELECT * FROM customer LIMIT %s;"
        cursor.execute(query, (5,))

        rows = cursor.fetchall()

        print("Customer Data (raw SQL):")
        for row in rows:
            print(row)

        print(f"\nRows fetched: {len(rows)}")

    except errors.UndefinedTable:
        print("Error: 'customer' table does not exist.")

    except Exception as e:
        print(f"Database error: {e}")

    finally:
        # Always close connection
        if cursor:
            cursor.close()
        if conn:
            conn.close()
            print("\nConnection closed.")


# Run the function
run_raw_query()