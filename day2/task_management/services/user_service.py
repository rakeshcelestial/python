import hashlib
import logging
from datetime import datetime
from typing import Any, Dict, List

from exceptions.custom_exceptions import (
    DuplicateUserError,
    InvalidCredentialsError,
    UserNotFoundError,
)
from repositories.base_repository import BaseRepository

logger = logging.getLogger("user_service")


def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


class UserService:
    """
    SRP: Encapsulates all user business logic.
    DIP: Depends on BaseRepository abstraction injected at construction.
    """

    def __init__(self, repository: BaseRepository) -> None:
        self._repo = repository

    def register(self, username: str, email: str, password: str) -> Dict[str, Any]:
        # Duplicate check
        existing = self._repo.find_all()
        if any(u["username"] == username for u in existing):
            logger.warning("Duplicate username: '%s'", username)
            raise DuplicateUserError(username)

        user = {
            "username": username,
            "email": email,
            "password": _hash_password(password),
            "created_at": datetime.utcnow().isoformat(),
        }
        saved = self._repo.save(user)
        logger.info("User '%s' registered", username)
        return saved

    def login(self, username: str, password: str) -> Dict[str, Any]:
        users = self._repo.find_all()
        user = next((u for u in users if u["username"] == username), None)
        if not user or user["password"] != _hash_password(password):
            logger.warning("Failed login attempt for username: '%s'", username)
            raise InvalidCredentialsError()
        logger.info("User '%s' logged in", username)
        return user

    def list_users(self) -> List[Dict[str, Any]]:
        return self._repo.find_all()

    def delete_user(self, user_id: int) -> None:
        deleted = self._repo.delete(user_id)
        if not deleted:
            logger.error("User ID %d not found", user_id)
            raise UserNotFoundError(user_id)
        logger.info("User ID %d deleted", user_id)
