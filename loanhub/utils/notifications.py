import asyncio
import logging
import os
from abc import ABC, abstractmethod
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

# Ensure logs directory exists
os.makedirs("logs", exist_ok=True)

notification_logger = logging.getLogger("notifications")
notification_logger.setLevel(logging.INFO)
if not notification_logger.handlers:
    fh = logging.FileHandler("logs/notifications.log")
    fh.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(message)s"))
    notification_logger.addHandler(fh)

# In-memory counter for total reviews processed today
_review_counter = {"count": 0}


def increment_review_counter():
    _review_counter["count"] += 1
    return _review_counter["count"]


def get_review_counter():
    return _review_counter["count"]


# ─── OCP: Notification Strategy (Open/Closed Principle) ────────────────────────

class NotificationStrategy(ABC):
    """Abstract base — add new channels (Email, SMS) without changing existing code."""

    @abstractmethod
    async def send(self, message: str) -> None:
        ...


class ConsoleNotification(NotificationStrategy):
    async def send(self, message: str) -> None:
        await asyncio.sleep(0.05)  # simulate I/O
        logger.info(f"[CONSOLE NOTIFICATION] {message}")


class LogFileNotification(NotificationStrategy):
    async def send(self, message: str) -> None:
        await asyncio.sleep(0.05)  # simulate I/O
        notification_logger.info(message)


class EmailNotification(NotificationStrategy):
    """Adding a new channel without modifying existing strategies (OCP)."""
    async def send(self, message: str) -> None:
        await asyncio.sleep(0.1)  # simulate email API call
        logger.info(f"[EMAIL NOTIFICATION] {message}")


class SMSNotification(NotificationStrategy):
    async def send(self, message: str) -> None:
        await asyncio.sleep(0.1)  # simulate SMS API call
        logger.info(f"[SMS NOTIFICATION] {message}")


class PushNotification(NotificationStrategy):
    async def send(self, message: str) -> None:
        await asyncio.sleep(0.08)
        logger.info(f"[PUSH NOTIFICATION] {message}")


# ─── Async concurrent notification (asyncio.gather) ───────────────────────────

async def notify_all_channels(message: str) -> None:
    """Send notifications concurrently via email, SMS, and push using asyncio.gather."""
    channels: list[NotificationStrategy] = [
        EmailNotification(),
        SMSNotification(),
        PushNotification(),
    ]
    await asyncio.gather(*[channel.send(message) for channel in channels])
    logger.info(f"[NOTIFY] All channels notified: {message}")


# ─── Background task functions ─────────────────────────────────────────────────

def notify_loan_reviewed(loan_id: int, username: str, status: str) -> None:
    """Background task: log + async multi-channel notification on loan review."""
    ts = datetime.now(timezone.utc).isoformat()
    msg = (
        f"[{ts}] Loan #{loan_id} for user '{username}' has been {status} "
        f"--- notification sent"
    )
    notification_logger.info(msg)
    increment_review_counter()
    # Run async notification in a new event loop
    asyncio.run(notify_all_channels(msg))


def notify_loan_applied(loan_id: int, username: str, purpose: str, amount: int) -> None:
    """Background task: log new loan application."""
    ts = datetime.now(timezone.utc).isoformat()
    msg = (
        f"[{ts}] New loan application #{loan_id} by '{username}' "
        f"for {purpose} --- ₹{amount}"
    )
    notification_logger.info(msg)
