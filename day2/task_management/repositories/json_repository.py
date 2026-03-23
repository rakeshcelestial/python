import json
import logging
import os
from typing import Any, Dict, List, Optional

from filelock import FileLock

from repositories.base_repository import BaseRepository

logger = logging.getLogger(__name__)


class JSONRepository(BaseRepository):
    """
    Concrete repository backed by a JSON file.
    SRP: Handles only persistence — no business logic.
    OCP: New entity types only need a new instance with a different file/key.
    LSP: Can replace BaseRepository in any service without breakage.
    """

    def __init__(self, file_path: str, data_key: str) -> None:
        self._file_path = file_path
        self._data_key = data_key
        self._lock_path = file_path + ".lock"
        self._ensure_file()

    # ── private helpers ──────────────────────────────────────────────────────

    def _ensure_file(self) -> None:
        """Auto-create file with empty structure if missing or corrupted."""
        os.makedirs(os.path.dirname(self._file_path), exist_ok=True)
        if not os.path.exists(self._file_path):
            self._write({self._data_key: []})
            logger.info("Created new data file: %s", self._file_path)
            return
        try:
            with open(self._file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            if self._data_key not in data:
                raise ValueError("Missing key")
        except (json.JSONDecodeError, ValueError):
            logger.error("Corrupted data file %s — recreating", self._file_path)
            self._write({self._data_key: []})

    def _read(self) -> Dict[str, Any]:
        with open(self._file_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def _write(self, data: Dict[str, Any]) -> None:
        # Atomic write: write to temp file then rename
        tmp_path = self._file_path + ".tmp"
        with open(tmp_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, default=str)
        os.replace(tmp_path, self._file_path)

    def _next_id(self, records: List[Dict[str, Any]]) -> int:
        return max((r["id"] for r in records), default=0) + 1

    # ── BaseRepository implementation ────────────────────────────────────────

    def find_all(self) -> List[Dict[str, Any]]:
        with FileLock(self._lock_path):
            return self._read()[self._data_key]

    def find_by_id(self, record_id: int) -> Optional[Dict[str, Any]]:
        with FileLock(self._lock_path):
            records = self._read()[self._data_key]
        return next((r for r in records if r["id"] == record_id), None)

    def save(self, record: Dict[str, Any]) -> Dict[str, Any]:
        with FileLock(self._lock_path):
            data = self._read()
            records = data[self._data_key]
            record["id"] = self._next_id(records)
            records.append(record)
            self._write(data)
        return record

    def update(self, record_id: int, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        with FileLock(self._lock_path):
            file_data = self._read()
            records = file_data[self._data_key]
            for i, r in enumerate(records):
                if r["id"] == record_id:
                    records[i].update(data)
                    self._write(file_data)
                    return records[i]
        return None

    def delete(self, record_id: int) -> bool:
        with FileLock(self._lock_path):
            file_data = self._read()
            records = file_data[self._data_key]
            original_len = len(records)
            file_data[self._data_key] = [r for r in records if r["id"] != record_id]
            if len(file_data[self._data_key]) == original_len:
                return False
            self._write(file_data)
        return True
