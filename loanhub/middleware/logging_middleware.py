import logging
import os
import time

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

os.makedirs("logs", exist_ok=True)

app_logger = logging.getLogger("app")
app_logger.setLevel(logging.INFO)
if not app_logger.handlers:
    fh = logging.FileHandler("logs/app.log")
    fh.setFormatter(
        logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
    )
    app_logger.addHandler(fh)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.perf_counter()
        response = await call_next(request)
        elapsed_ms = int((time.perf_counter() - start) * 1000)
        app_logger.info(
            f"{request.method} {request.url.path} | {response.status_code} | {elapsed_ms}ms"
        )
        return response
