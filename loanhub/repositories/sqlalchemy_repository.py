from typing import Any, List, Optional, Type, TypeVar

from sqlalchemy.orm import Session

from repositories.base_repository import BaseRepository

T = TypeVar("T")


class SQLAlchemyRepository(BaseRepository[T]):
    """
    Concrete SQLAlchemy repository — drop-in replacement for BaseRepository (LSP).
    Services depend on BaseRepository (DIP), never on this class directly.
    """

    def __init__(self, model: Type[T], db: Session):
        self._model = model
        self._db = db

    def save(self, entity: T) -> T:
        self._db.add(entity)
        self._db.commit()
        self._db.refresh(entity)
        return entity

    def find(self, entity_id: int) -> Optional[T]:
        return self._db.query(self._model).filter(
            self._model.id == entity_id
        ).first()

    def find_all(self, **filters) -> List[T]:
        query = self._db.query(self._model)
        for key, value in filters.items():
            if value is not None:
                query = query.filter(getattr(self._model, key) == value)
        return query.all()

    def update(self, entity: T) -> T:
        self._db.commit()
        self._db.refresh(entity)
        return entity

    def delete(self, entity_id: int) -> bool:
        entity = self.find(entity_id)
        if entity:
            self._db.delete(entity)
            self._db.commit()
            return True
        return False

    def find_by(self, **kwargs) -> Optional[T]:
        """Helper: find first record matching keyword arguments."""
        query = self._db.query(self._model)
        for key, value in kwargs.items():
            query = query.filter(getattr(self._model, key) == value)
        return query.first()

    def find_all_filtered(
        self,
        filters: dict,
        page: int = 1,
        limit: int = 10,
        sort_by: str = None,
        order: str = "desc",
    ) -> List[T]:
        query = self._db.query(self._model)
        for key, value in filters.items():
            if value is not None:
                query = query.filter(getattr(self._model, key) == value)
        if sort_by:
            col = getattr(self._model, sort_by, None)
            if col is not None:
                query = query.order_by(col.desc() if order == "desc" else col.asc())
        offset = (page - 1) * limit
        return query.offset(offset).limit(limit).all()

    def count_by(self, **kwargs) -> int:
        query = self._db.query(self._model)
        for key, value in kwargs.items():
            query = query.filter(getattr(self._model, key) == value)
        return query.count()

    def find_all_raw(self) -> List[T]:
        return self._db.query(self._model).all()
