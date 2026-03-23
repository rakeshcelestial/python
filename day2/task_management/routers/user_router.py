import logging
from typing import List

from fastapi import APIRouter, Depends

from models.schemas import UserCreate, UserLogin, UserResponse
from repositories.json_repository import JSONRepository
from repositories.base_repository import BaseRepository
from services.user_service import UserService
from config import get_settings

logger = logging.getLogger("user_router")
router = APIRouter(prefix="/users", tags=["Users"])


def get_user_repository() -> BaseRepository:
    settings = get_settings()
    return JSONRepository(file_path=settings.users_file, data_key="users")


def get_user_service(repo: BaseRepository = Depends(get_user_repository)) -> UserService:
    return UserService(repository=repo)


@router.post("/register", status_code=201, response_model=UserResponse)
def register(payload: UserCreate, service: UserService = Depends(get_user_service)):
    """Register a new user. Returns 201 on success."""
    user = service.register(
        username=payload.username,
        email=payload.email,
        password=payload.password,
    )
    return user


@router.post("/login", status_code=200)
def login(payload: UserLogin, service: UserService = Depends(get_user_service)):
    """Validate credentials. Returns user info (no password) on success."""
    user = service.login(username=payload.username, password=payload.password)
    return {k: v for k, v in user.items() if k != "password"}


@router.get("", status_code=200, response_model=List[UserResponse])
def list_users(service: UserService = Depends(get_user_service)):
    """List all registered users."""
    users = service.list_users()
    return users


@router.delete("/{user_id}", status_code=200)
def delete_user(user_id: int, service: UserService = Depends(get_user_service)):
    """Delete a user by ID."""
    service.delete_user(user_id)
    return {"message": f"User {user_id} deleted successfully"}
