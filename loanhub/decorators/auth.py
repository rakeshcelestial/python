import functools
import logging

from exceptions.custom_exceptions import ForbiddenError

logger = logging.getLogger(__name__)


def require_role(role: str):
    """
    Decorator factory that enforces role-based access at the service layer.
    The decorated function must receive `current_user` as its first positional
    argument (after self if it's a method).
    """
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            # current_user may be passed as kwarg or 2nd positional arg
            current_user = kwargs.get("current_user")
            if current_user is None and len(args) >= 2:
                current_user = args[1]

            if current_user is None or current_user.role != role:
                raise ForbiddenError(
                    f"Access denied. Required role: {role}"
                )
            return func(*args, **kwargs)
        return wrapper
    return decorator
