import hashlib
import logging

from sqlalchemy.orm import Session

from exceptions.custom_exceptions import (
    DuplicateUserError,
    ForbiddenError,
    InvalidCredentialsError,
    UserNotFoundError,
)
from models.db_models import User
from models.enums import UserRole
from models.schemas import UserCreate, UserLogin
from repositories.sqlalchemy_repository import SQLAlchemyRepository

logger = logging.getLogger(__name__)


def _hash_password(plain: str) -> str:
    return hashlib.sha256(plain.encode()).hexdigest()


def _verify_password(plain: str, hashed: str) -> bool:
    return hashlib.sha256(plain.encode()).hexdigest() == hashed


class UserService:
    """Handles registration, login, and user management (SRP)."""

    def __init__(self, db: Session):
        # DIP: depends on BaseRepository abstraction
        self._repo: SQLAlchemyRepository = SQLAlchemyRepository(User, db)

    def register(self, data: UserCreate) -> User:
        # Check for duplicates
        if self._repo.find_by(username=data.username):
            logger.warning(f"Duplicate username attempt: {data.username}")
            raise DuplicateUserError(f"Username '{data.username}' is already taken")
        if self._repo.find_by(email=data.email):
            logger.warning(f"Duplicate email attempt: {data.email}")
            raise DuplicateUserError(f"Email '{data.email}' is already registered")

        user = User(
            username=data.username,
            email=data.email,
            password=_hash_password(data.password),
            phone=data.phone,
            monthly_income=data.monthly_income,
            role=UserRole.user,
        )
        saved = self._repo.save(user)
        logger.info(f"User registered: {saved.username} (id={saved.id})")
        return saved

    def login(self, data: UserLogin) -> User:
        user = self._repo.find_by(username=data.username)
        if not user or not _verify_password(data.password, user.password):
            logger.error(f"Invalid credentials for username: {data.username}")
            raise InvalidCredentialsError()
        logger.info(f"User logged in: {user.username} (role={user.role})")
        return user

    def get_by_id(self, user_id: int) -> User:
        user = self._repo.find(user_id)
        if not user:
            raise UserNotFoundError(f"User with id={user_id} not found")
        return user

    def get_by_username(self, username: str) -> User:
        user = self._repo.find_by(username=username)
        if not user:
            raise UserNotFoundError(f"User '{username}' not found")
        return user

    def seed_admin(self, username: str, email: str, password: str) -> None:
        """Create admin user on startup if not already present."""
        existing = self._repo.find_by(username=username)
        if existing:
            logger.info("Admin user already exists")
            return
        admin = User(
            username=username,
            email=email,
            password=_hash_password(password),
            phone="0000000000",
            monthly_income=0,
            role=UserRole.admin,
        )
        self._repo.save(admin)
        logger.info("Admin user seeded successfully")

    def count_all(self) -> int:
        return self._repo.count_by()

    def update_user(self, user_id: int, data) -> "User":
        user = self._repo.find(user_id)
        if not user:
            raise UserNotFoundError(f"User with id={user_id} not found")

        # Check email uniqueness only if email is being changed
        if data.email and data.email != user.email:
            existing = self._repo.find_by(email=data.email)
            if existing:
                logger.warning(f"Duplicate email attempt: {data.email}")
                raise DuplicateUserError(
                    f"Email '{data.email}' is already registered"
                )

        # Apply only the fields that were actually sent (not None)
        if data.email is not None:
            user.email = data.email

        if data.phone is not None:
            user.phone = data.phone

        if data.monthly_income is not None:
            user.monthly_income = data.monthly_income

        if data.password is not None:
            user.password = _hash_password(data.password)

        updated = self._repo.update(user)
        logger.info(f"User updated: {user.username} (id={user_id})")
        return updated

def change_user_role(self, target_user_id: int, new_role: "UserRole") -> "User":
    user = self._repo.find(target_user_id)
    if not user:
        raise UserNotFoundError(f"User with id={target_user_id} not found")

    old_role = user.role
    user.role = new_role
    updated = self._repo.update(user)
    logger.info(
        f"Role changed: user '{user.username}' (id={target_user_id}) "
        f"{old_role} → {new_role}"
    )
    return updated