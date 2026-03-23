from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional


class BaseRepository(ABC):
    """
    Abstract base class defining the data-access interface.
    ISP: Only data-access methods — no logging or validation.
    DIP: Services depend on this abstraction, not on concrete JSONRepository.
    LSP: Any subclass is a valid substitute without breaking service layer.
    """

    @abstractmethod
    def find_all(self) -> List[Dict[str, Any]]:
        """Return all records."""

    @abstractmethod
    def find_by_id(self, record_id: int) -> Optional[Dict[str, Any]]:
        """Return a single record by id, or None."""

    @abstractmethod
    def save(self, record: Dict[str, Any]) -> Dict[str, Any]:
        """Persist a new record and return it with generated id."""

    @abstractmethod
    def update(self, record_id: int, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing record and return the updated record, or None."""

    @abstractmethod
    def delete(self, record_id: int) -> bool:
        """Delete a record by id. Returns True if deleted, False if not found."""
