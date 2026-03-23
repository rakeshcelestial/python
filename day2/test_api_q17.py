from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional, Literal

# ---------------- SETTINGS ----------------
class Settings(BaseSettings):
    APP_NAME: str
    DEBUG: bool
    JSON_DB_PATH: str
    LOG_LEVEL: str

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()

@asynccontextmanager 
async def lifespan(app: FastAPI):
    print(f"App: {settings.APP_NAME} | Debug: {settings.DEBUG} | DB: {settings.JSON_DB_PATH}")
    yield

app = FastAPI(lifespan=lifespan)

# ---------------- DATA ----------------
tasks = []
task_id_counter = 1

# ---------------- CUSTOM EXCEPTION ----------------
class TaskNotFoundError(Exception):
    def __init__(self, task_id: int):
        self.message = f"Task with id {task_id} not found"

# ---------------- EXCEPTION HANDLER ----------------
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

# ---------------- MODELS ----------------
class TaskCreate(BaseModel):
    title: str
    description: str
    status: Literal["pending", "in_progress", "completed"]

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[Literal["pending", "in_progress", "completed"]] = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: str
    status: str

# ---------------- ROUTES ----------------

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/tasks", response_model=TaskResponse, status_code=201)
def create_task(task: TaskCreate):
    global task_id_counter
    new_task = {"id": task_id_counter, **task.dict()}
    tasks.append(new_task)
    task_id_counter += 1
    return new_task

@app.get("/tasks", response_model=List[TaskResponse])
def get_tasks(status: Optional[str] = None):
    if status:
        return [t for t in tasks if t["status"] == status]
    return tasks

@app.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(task_id: int):
    for task in tasks:
        if task["id"] == task_id:
            return task
    raise TaskNotFoundError(task_id)

@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, updated: TaskUpdate):
    for task in tasks:
        if task["id"] == task_id:
            if updated.title:
                task["title"] = updated.title
            if updated.description:
                task["description"] = updated.description
            if updated.status:
                task["status"] = updated.status
            return task
    raise TaskNotFoundError(task_id)

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    for i, task in enumerate(tasks):
        if task["id"] == task_id:
            tasks.pop(i)
            return {"message": "Task deleted"}
    raise TaskNotFoundError(task_id)