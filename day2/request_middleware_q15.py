from fastapi import FastAPI, Request
import time
from datetime import datetime

app = FastAPI()


#  Middleware for logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()

    # Process request
    response = await call_next(request)

    end_time = time.time()
    duration_ms = int((end_time - start_time) * 1000)

    # Timestamp
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Log format
    log = f"{timestamp} | {request.method} {request.url.path} | Status: {response.status_code} | Time: {duration_ms}ms\n"

    # Write to file
    with open("api_logs.txt", "a") as f:
        f.write(log)

    return response