from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy.orm import Session

from database import get_db
from exceptions.custom_exceptions import ForbiddenError, TokenError
from models.db_models import User
from services.user_service import UserService
from utils.jwt_utils import decode_access_token

bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    FastAPI dependency — extracts and validates the Bearer JWT token.
    Injects the authenticated User object into any route that depends on it.
    """
    token = credentials.credentials
    try:
        payload = decode_access_token(token)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise TokenError("Token payload missing subject")
    except JWTError:
        raise TokenError("Invalid or expired token")

    user = UserService(db).get_by_id(int(user_id))
    return user


def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """Dependency that additionally enforces admin role."""
    from models.enums import UserRole
    if current_user.role != UserRole.admin:
        raise ForbiddenError("Only admins can access this endpoint")
    return current_user