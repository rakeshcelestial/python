from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
import time
from datetime import datetime

app = FastAPI()

# Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration_ms = int((time.time() - start_time) * 1000)

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    log_message = f"{timestamp} | {request.method} {request.url.path} | Status: {response.status_code} | Time: {duration_ms}ms\n"

    with open("api_logs.txt", "a") as f:
        f.write(log_message)

    return response


# In-memory storage
tasks = [{"id": 1, "title": "Sample Task", "description": "Demo", "status": "pending"},
         {"id":2, "title": "Medium Task", "description": "Demo", "status": "completeuvicorn"}]


# Custom Exception
class TaskNotFoundError(Exception):
    def __init__(self, task_id: int):
        self.task_id = task_id
        self.message = f"Task with id {task_id} not found"
        super().__init__(self.message)


# Global Exception Handler
@app.exception_handler(TaskNotFoundError)
async def task_not_found_handler(request: Request, exc: TaskNotFoundError):
    return JSONResponse(
        status_code=404,
        content={
            "error": "TaskNotFoundError",
            "message": exc.message,
            "status_code": 404
        }
    )


# Model
class TaskResponse(BaseModel):
    id: int
    title: str
    description: str
    status: str


# Endpoint
@app.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(task_id: int):
    for task in tasks:
        if task["id"] == task_id:
            return task

    raise TaskNotFoundError(task_id)