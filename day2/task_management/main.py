import logging
import logging.config
import os

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from config import get_settings
from exceptions.custom_exceptions import (
    DuplicateUserError,
    InvalidCredentialsError,
    TaskNotFoundError,
    UserNotFoundError,
)
from middleware.logging_middleware import LoggingMiddleware
from routers import task_router, user_router

settings = get_settings()

# ── Logging setup ─────────────────────────────────────────────────────────────
os.makedirs(os.path.dirname(settings.log_file), exist_ok=True)

LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {
            "format": "%(asctime)s - %(levelname)s - %(name)s - %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        }
    },
    "handlers": {
        "file": {
            "class": "logging.FileHandler",
            "filename": settings.log_file,
            "formatter": "standard",
            "encoding": "utf-8",
        },
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "standard",
        },
    },
    "root": {
        "handlers": ["file", "console"],
        "level": settings.log_level,
    },
}
logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger(__name__)

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug,
)

app.add_middleware(LoggingMiddleware)

# ── Exception handlers ────────────────────────────────────────────────────────

def error_response(exc_name: str, message: str, status_code: int):
    return JSONResponse(
        status_code=status_code,
        content={"error": exc_name, "message": message, "status_code": status_code},
    )


@app.exception_handler(UserNotFoundError)
async def user_not_found_handler(request: Request, exc: UserNotFoundError):
    return error_response("UserNotFoundError", str(exc), 404)


@app.exception_handler(TaskNotFoundError)
async def task_not_found_handler(request: Request, exc: TaskNotFoundError):
    return error_response("TaskNotFoundError", str(exc), 404)


@app.exception_handler(DuplicateUserError)
async def duplicate_user_handler(request: Request, exc: DuplicateUserError):
    return error_response("DuplicateUserError", str(exc), 409)


@app.exception_handler(InvalidCredentialsError)
async def invalid_credentials_handler(request: Request, exc: InvalidCredentialsError):
    return error_response("InvalidCredentialsError", str(exc), 401)


@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    return error_response("ValidationError", str(exc), 422)


# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(user_router.router)
app.include_router(task_router.router)


@app.get("/", tags=["Health"])
def root():
    logger.info("Health check endpoint called")
    return {"status": "ok", "app": settings.app_name, "version": settings.app_version}


if __name__ == "__main__":
    import uvicorn
    logger.info("Starting %s v%s", settings.app_name, settings.app_version)
    uvicorn.run("main:app", host=settings.host, port=settings.port, reload=settings.debug)
