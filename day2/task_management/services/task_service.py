import logging
from datetime import datetime
from typing import Any, Dict, List, Optional

from exceptions.custom_exceptions import TaskNotFoundError
from models.enums import TaskPriority, TaskStatus
from repositories.base_repository import BaseRepository

logger = logging.getLogger("task_service")


class TaskService:
    """
    SRP: Encapsulates all task business logic.
    DIP: Depends on BaseRepository abstraction injected at construction.
    """

    def __init__(self, repository: BaseRepository) -> None:
        self._repo = repository

    def create_task(
        self,
        title: str,
        owner: str,
        priority: TaskPriority,
        description: Optional[str] = None,
    ) -> Dict[str, Any]:
        now = datetime.utcnow().isoformat()
        task = {
            "title": title,
            "description": description,
            "status": TaskStatus.pending.value,
            "priority": priority.value,
            "owner": owner,
            "created_at": now,
            "updated_at": now,
        }
        saved = self._repo.save(task)
        logger.info("Task '%s' created by '%s'", title, owner)
        return saved

    def list_tasks(
        self,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        owner: Optional[str] = None,
        page: int = 1,
        limit: int = 10,
    ) -> List[Dict[str, Any]]:
        tasks = self._repo.find_all()
        if status:
            tasks = [t for t in tasks if t.get("status") == status]
        if priority:
            tasks = [t for t in tasks if t.get("priority") == priority]
        if owner:
            tasks = [t for t in tasks if t.get("owner") == owner]
        start = (page - 1) * limit
        return tasks[start: start + limit]

    def get_task(self, task_id: int) -> Dict[str, Any]:
        task = self._repo.find_by_id(task_id)
        if task is None:
            logger.error("Task ID %d not found", task_id)
            raise TaskNotFoundError(task_id)
        return task

    def update_task(self, task_id: int, data: Dict[str, Any]) -> Dict[str, Any]:
        self.get_task(task_id)  # raises if not found
        data["updated_at"] = datetime.utcnow().isoformat()
        # Convert enums to values for storage
        for key in ("status", "priority"):
            if key in data and hasattr(data[key], "value"):
                data[key] = data[key].value
        updated = self._repo.update(task_id, data)
        logger.info("Task ID %d updated", task_id)
        return updated

    def delete_task(self, task_id: int) -> None:
        deleted = self._repo.delete(task_id)
        if not deleted:
            logger.error("Task ID %d not found", task_id)
            raise TaskNotFoundError(task_id)
        logger.info("Task ID %d deleted", task_id)
