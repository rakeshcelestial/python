import logging
from typing import List, Optional

from fastapi import APIRouter, Depends, Query

from models.enums import TaskPriority, TaskStatus
from models.schemas import TaskCreate, TaskResponse, TaskUpdate
from repositories.json_repository import JSONRepository
from repositories.base_repository import BaseRepository
from services.task_service import TaskService
from config import get_settings

logger = logging.getLogger("task_router")
router = APIRouter(prefix="/tasks", tags=["Tasks"])


def get_task_repository() -> BaseRepository:
    settings = get_settings()
    return JSONRepository(file_path=settings.tasks_file, data_key="tasks")


def get_task_service(repo: BaseRepository = Depends(get_task_repository)) -> TaskService:
    return TaskService(repository=repo)


@router.post("", status_code=201, response_model=TaskResponse)
def create_task(payload: TaskCreate, service: TaskService = Depends(get_task_service)):
    """Create a new task."""
    task = service.create_task(
        title=payload.title,
        owner=payload.owner,
        priority=payload.priority,
        description=payload.description,
    )
    return task


@router.get("", status_code=200, response_model=List[TaskResponse])
def list_tasks(
    status: Optional[TaskStatus] = Query(default=None),
    priority: Optional[TaskPriority] = Query(default=None),
    owner: Optional[str] = Query(default=None),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    service: TaskService = Depends(get_task_service),
):
    """List tasks with optional filters and pagination."""
    return service.list_tasks(
        status=status.value if status else None,
        priority=priority.value if priority else None,
        owner=owner,
        page=page,
        limit=limit,
    )


@router.get("/{task_id}", status_code=200, response_model=TaskResponse)
def get_task(task_id: int, service: TaskService = Depends(get_task_service)):
    """Get a specific task by ID."""
    return service.get_task(task_id)


@router.put("/{task_id}", status_code=200, response_model=TaskResponse)
def full_update_task(
    task_id: int,
    payload: TaskCreate,
    service: TaskService = Depends(get_task_service),
):
    """Full replacement update of a task."""
    data = payload.model_dump()
    return service.update_task(task_id, data)


@router.patch("/{task_id}", status_code=200, response_model=TaskResponse)
def partial_update_task(
    task_id: int,
    payload: TaskUpdate,
    service: TaskService = Depends(get_task_service),
):
    """Partial update of a task (only provided fields are changed)."""
    data = payload.model_dump(exclude_unset=True)
    return service.update_task(task_id, data)


@router.delete("/{task_id}", status_code=200)
def delete_task(task_id: int, service: TaskService = Depends(get_task_service)):
    """Delete a task by ID."""
    service.delete_task(task_id)
    return {"message": f"Task {task_id} deleted successfully"}
