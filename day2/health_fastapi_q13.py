from fastapi import FastAPI, HTTPException, Query, status
from pydantic import BaseModel, Field
from typing import List, Optional, Literal

app = FastAPI()

#  In-memory storage
tasks = []
task_id_counter = 1


#  Pydantic Models

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


#  Health Check
@app.get("/health")
def health_check():
    return {"status": "healthy"}


#  Create Task
@app.post("/tasks", response_model=TaskResponse, status_code=201)
def create_task(task: TaskCreate):
    global task_id_counter

    new_task = {
        "id": task_id_counter,
        "title": task.title,
        "description": task.description,
        "status": task.status
    }

    tasks.append(new_task)
    task_id_counter += 1

    return new_task


#  Get All Tasks (with optional filter)
@app.get("/tasks", response_model=List[TaskResponse])
def get_tasks(status: Optional[str] = Query(None)):
    if status:
        filtered = [t for t in tasks if t["status"] == status]
        return filtered
    return tasks


#  Get Task by ID
@app.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(task_id: int):
    for task in tasks:
        if task["id"] == task_id:
            return task
    raise HTTPException(status_code=404, detail="Task not found")


#  Update Task
@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, updated: TaskUpdate):
    for task in tasks:
        if task["id"] == task_id:
            if updated.title is not None:
                task["title"] = updated.title
            if updated.description is not None:
                task["description"] = updated.description
            if updated.status is not None:
                task["status"] = updated.status
            return task

    raise HTTPException(status_code=404, detail="Task not found")


#  Delete Task
@app.delete("/tasks/{task_id}", status_code=200)
def delete_task(task_id: int):
    for i, task in enumerate(tasks):
        if task["id"] == task_id:
            tasks.pop(i)
            return {"message": "Task deleted"}

    raise HTTPException(status_code=404, detail="Task not found")