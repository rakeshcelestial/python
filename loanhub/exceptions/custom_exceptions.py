from fastapi import Request
from fastapi.responses import JSONResponse


# ─── Custom Exceptions ─────────────────────────────────────────────────────────

class AppException(Exception):
    def __init__(self, message: str, status_code: int):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class UserNotFoundError(AppException):
    def __init__(self, message: str = "User not found"):
        super().__init__(message, 404)


class DuplicateUserError(AppException):
    def __init__(self, message: str = "Username or email already exists"):
        super().__init__(message, 409)


class InvalidCredentialsError(AppException):
    def __init__(self, message: str = "Invalid username or password"):
        super().__init__(message, 401)


class ForbiddenError(AppException):
    def __init__(self, message: str = "You do not have permission to perform this action"):
        super().__init__(message, 403)


class LoanNotFoundError(AppException):
    def __init__(self, message: str = "Loan not found"):
        super().__init__(message, 404)


class MaxPendingLoansError(AppException):
    def __init__(self, message: str = "You already have 3 pending loans. Wait for review before applying again."):
        super().__init__(message, 422)


class InvalidLoanReviewError(AppException):
    def __init__(self, message: str = "Only pending loans can be reviewed"):
        super().__init__(message, 422)


# ─── Global Exception Handlers ─────────────────────────────────────────────────

def _error_response(exc_name: str, message: str, status_code: int) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={
            "error": exc_name,
            "message": message,
            "status_code": status_code,
        },
    )


async def app_exception_handler(request: Request, exc: AppException):
    return _error_response(type(exc).__name__, exc.message, exc.status_code)


async def validation_exception_handler(request: Request, exc):
    from fastapi.exceptions import RequestValidationError
    errors = exc.errors()
    message = "; ".join(
        f"{'.'.join(str(loc) for loc in e['loc'])}: {e['msg']}" for e in errors
    )
    return _error_response("ValidationError", message, 422)


async def generic_exception_handler(request: Request, exc: Exception):
    import logging
    logging.getLogger(__name__).error(f"Unhandled exception: {exc}", exc_info=True)
    return _error_response("InternalServerError", "An unexpected error occurred", 500)

class TokenError(AppException):
    def __init__(self, message: str = "Invalid or expired token"):
        super().__init__(message, 401)
