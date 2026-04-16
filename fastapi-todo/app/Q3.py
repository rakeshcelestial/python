import time
import uuid
import logging
from fastapi import FastAPI, Path, Query, Request
from typing import Literal, Optional

# --- SET UP LOGGING ---
# This prints our logs to the terminal
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("assignment_logger")

app = FastAPI(title="My REST API Assignment Project")

# --- QUESTION 3: Middleware & Request ID ---

@app.middleware("http")
async def add_process_time_and_request_id(request: Request, call_next):
    # 1. START: Before the request hits the endpoint
    start_time = time.time()
    
    # 2. Get X-Request-ID from headers, or generate a new one if missing
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    
    # 3. Process the request (This calls your @app.get endpoints)
    response = await call_next(request)
    
    # 4. END: After the endpoint is done
    process_time = (time.time() - start_time) * 1000  # Convert to milliseconds
    
    # 5. Attach the Request ID to the Response Header
    response.headers["X-Request-ID"] = request_id
    
    # 6. Log the details in the exact format requested
    # [req-id=...] GET /todos 200 15ms
    log_message = f"[req-id={request_id}] {request.method} {request.url.path} {response.status_code} {process_time:.2f}ms"
    logger.info(log_message)
    
    return response

# --- REUSING Q2 FROM PREVIOUS STEP ---
@app.get("/users/{user_id}/todos")
async def get_user_todos(
    user_id: int = Path(..., gt=0),
    status: Optional[Literal["pending", "done"]] = Query(None),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    return {"user_id": user_id, "items": []}