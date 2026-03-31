import pytest
from fastapi.testclient import TestClient
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))


@pytest.fixture()
def tmp_data_dir(tmp_path, monkeypatch):
    monkeypatch.setenv("TASKS_FILE", str(tmp_path / "tasks.json"))
    monkeypatch.setenv("USERS_FILE", str(tmp_path / "users.json"))
    from config import get_settings
    get_settings.cache_clear()
    yield tmp_path
    get_settings.cache_clear()


@pytest.fixture()
def client(tmp_data_dir):
    from main import app
    return TestClient(app)


def test_create_task(client):
    resp = client.post("/tasks", json={
        "title": "Test Task",
        "description": "A test task description",
        "priority": "high",
        "owner": "alice"
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "Test Task"
    assert data["status"] == "pending"
    assert data["priority"] == "high"


def test_list_tasks(client):
    client.post("/tasks", json={"title": "Task One", "priority": "low", "owner": "alice"})
    client.post("/tasks", json={"title": "Task Two", "priority": "high", "owner": "bob"})
    resp = client.get("/tasks")
    assert resp.status_code == 200
    assert len(resp.json()) >= 2


def test_filter_by_status(client):
    client.post("/tasks", json={"title": "Pending Task", "priority": "medium", "owner": "alice"})
    resp = client.get("/tasks?status=pending")
    assert resp.status_code == 200
    for task in resp.json():
        assert task["status"] == "pending"


def test_filter_by_priority(client):
    client.post("/tasks", json={"title": "High Task", "priority": "high", "owner": "alice"})
    resp = client.get("/tasks?priority=high")
    assert resp.status_code == 200
    for task in resp.json():
        assert task["priority"] == "high"


def test_filter_by_owner(client):
    client.post("/tasks", json={"title": "Alice Task", "priority": "low", "owner": "alice"})
    resp = client.get("/tasks?owner=alice")
    assert resp.status_code == 200
    for task in resp.json():
        assert task["owner"] == "alice"


def test_pagination(client):
    for i in range(6):
        client.post("/tasks", json={"title": f"Task {i}", "priority": "low", "owner": "alice"})
    resp = client.get("/tasks?page=1&limit=3")
    assert resp.status_code == 200
    assert len(resp.json()) == 3


def test_pagination_beyond_data(client):
    resp = client.get("/tasks?page=9999&limit=10")
    assert resp.status_code == 200
    assert resp.json() == []


def test_get_task_by_id(client):
    r = client.post("/tasks", json={"title": "Fetch Me", "priority": "low", "owner": "alice"})
    task_id = r.json()["id"]
    resp = client.get(f"/tasks/{task_id}")
    assert resp.status_code == 200
    assert resp.json()["id"] == task_id


def test_get_task_not_found(client):
    resp = client.get("/tasks/9999")
    assert resp.status_code == 404
    assert resp.json()["error"] == "TaskNotFoundError"


def test_full_update_task(client):
    r = client.post("/tasks", json={"title": "Old Title", "priority": "low", "owner": "alice"})
    task_id = r.json()["id"]
    resp = client.put(f"/tasks/{task_id}", json={
        "title": "New Title", "priority": "high", "owner": "bob"
    })
    assert resp.status_code == 200
    assert resp.json()["title"] == "New Title"


def test_partial_update_task(client):
    r = client.post("/tasks", json={"title": "Patch Me", "priority": "low", "owner": "alice"})
    task_id = r.json()["id"]
    resp = client.patch(f"/tasks/{task_id}", json={"status": "completed"})
    assert resp.status_code == 200
    assert resp.json()["status"] == "completed"


def test_delete_task(client):
    r = client.post("/tasks", json={"title": "Delete Me", "priority": "low", "owner": "alice"})
    task_id = r.json()["id"]
    resp = client.delete(f"/tasks/{task_id}")
    assert resp.status_code == 200
    assert client.get(f"/tasks/{task_id}").status_code == 404


def test_invalid_status_enum(client):
    resp = client.get("/tasks?status=invalid_status")
    assert resp.status_code == 422


def test_create_task_short_title(client):
    resp = client.post("/tasks", json={"title": "AB", "priority": "low", "owner": "alice"})
    assert resp.status_code == 422
