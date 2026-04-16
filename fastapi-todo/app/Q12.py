from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# --- CORS CONFIGURATION ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # The exact URL of your React app
    allow_credentials=True, # Allow sending cookies/auth headers
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"] # Allows React to see our custom ID from Q3
)

@app.get("/todos")
def get_todos():
    return [{"id": 1, "task": "Learn CORS"}]

