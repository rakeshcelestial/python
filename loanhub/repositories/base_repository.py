from abc import ABC, abstractmethod
from typing import Any, Generic, List, Optional, TypeVar

T = TypeVar("T")


class BaseRepository(ABC, Generic[T]):
    """Abstract base repository defining only CRUD operations (ISP)."""

    @abstractmethod
    def save(self, entity: T) -> T:
        ...

    @abstractmethod
    def find(self, entity_id: int) -> Optional[T]:
        ...

    @abstractmethod
    def find_all(self, **filters) -> List[T]:
        ...

    @abstractmethod
    def update(self, entity: T) -> T:
        ...

    @abstractmethod
    def delete(self, entity_id: int) -> bool:
        ...
