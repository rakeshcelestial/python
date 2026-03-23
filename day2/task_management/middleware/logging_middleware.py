import logging
import time

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("middleware")


class LoggingMiddleware(BaseHTTPMiddleware):
    """
    SRP: Handles only request/response logging as a cross-cutting concern.
    """

    async def dispatch(self, request: Request, call_next):
        start = time.perf_counter()
        response = await call_next(request)
        elapsed_ms = int((time.perf_counter() - start) * 1000)
        logger.info(
            "%s %s | %d | %dms",
            request.method,
            request.url.path,
            response.status_code,
            elapsed_ms,
        )
        return response
