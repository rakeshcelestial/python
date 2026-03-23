import pytest
from fastapi.testclient import TestClient

import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import json, tempfile, shutil

@pytest.fixture()
def tmp_data_dir(tmp_path, monkeypatch):
    """Redirect data files to a temp directory for test isolation."""
    tasks_file = str(tmp_path / "tasks.json")
    users_file = str(tmp_path / "users.json")
    monkeypatch.setenv("TASKS_FILE", tasks_file)
    monkeypatch.setenv("USERS_FILE", users_file)
    # Reset lru_cache so settings re-read env
    from config import get_settings
    get_settings.cache_clear()
    yield tmp_path
    get_settings.cache_clear()


@pytest.fixture()
def client(tmp_data_dir):
    from main import app
    return TestClient(app)


def test_register_user(client):
    resp = client.post("/users/register", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123"
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["username"] == "testuser"
    assert "password" not in data


def test_register_duplicate_user(client):
    payload = {"username": "dupeuser", "email": "dupe@example.com", "password": "password123"}
    client.post("/users/register", json=payload)
    resp = client.post("/users/register", json=payload)
    assert resp.status_code == 409
    assert resp.json()["error"] == "DuplicateUserError"


def test_login_success(client):
    client.post("/users/register", json={
        "username": "loginuser", "email": "login@example.com", "password": "mypassword"
    })
    resp = client.post("/users/login", json={"username": "loginuser", "password": "mypassword"})
    assert resp.status_code == 200
    assert "password" not in resp.json()


def test_login_bad_credentials(client):
    resp = client.post("/users/login", json={"username": "nobody", "password": "wrong"})
    assert resp.status_code == 401
    assert resp.json()["error"] == "InvalidCredentialsError"


def test_list_users(client):
    client.post("/users/register", json={
        "username": "listme", "email": "list@example.com", "password": "password123"
    })
    resp = client.get("/users")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


def test_delete_user(client):
    r = client.post("/users/register", json={
        "username": "todelete", "email": "del@example.com", "password": "password123"
    })
    user_id = r.json()["id"]
    resp = client.delete(f"/users/{user_id}")
    assert resp.status_code == 200


def test_delete_nonexistent_user(client):
    resp = client.delete("/users/9999")
    assert resp.status_code == 404


def test_register_invalid_email(client):
    resp = client.post("/users/register", json={
        "username": "badmail", "email": "not-an-email", "password": "password123"
    })
    assert resp.status_code == 422


def test_register_short_password(client):
    resp = client.post("/users/register", json={
        "username": "shortpass", "email": "s@example.com", "password": "123"
    })
    assert resp.status_code == 422
