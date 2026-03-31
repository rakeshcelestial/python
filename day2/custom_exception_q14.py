from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List

app = FastAPI()

#  In-memory storage
tasks = [{"id": 1, "title": "Sample Task", "description": "Demo", "status": "pending"}]


#  Custom Exception
class TaskNotFoundError(Exception):
    def __init__(self, task_id: int):
        self.task_id = task_id
        self.message = f"Task with id {task_id} not found"
        super().__init__(self.message)


#  Global Exception Handler
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


#  Pydantic Model
class TaskResponse(BaseModel):
    id: int
    title: str
    description: str
    status: str


#  Example Endpoint (GET by ID)
@app.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(task_id: int):
    for task in tasks:
        if task["id"] == task_id:
            return task

    #  Raise custom exception instead of HTTPException
    raise TaskNotFoundError(task_id)