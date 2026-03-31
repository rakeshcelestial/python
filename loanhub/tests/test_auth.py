"""
test_auth.py — 5 tests covering registration and login flows.
"""
import pytest
from fastapi.testclient import TestClient


REGISTER_URL = "/auth/register"
LOGIN_URL = "/auth/login"

VALID_USER = {
    "username": "rahul",
    "email": "rahul@mail.com",
    "password": "secure1234",
    "phone": "9876543210",
    "monthly_income": 55000,
}


def test_register_new_user_success(client: TestClient):
    """Register a new user successfully → 201."""
    resp = client.post(REGISTER_URL, json=VALID_USER)
    assert resp.status_code == 201
    body = resp.json()
    assert body["username"] == "rahul"
    assert body["email"] == "rahul@mail.com"
    assert body["role"] == "user"
    assert body["is_active"] is True
    assert "password" not in body, "Password must never appear in the response"


def test_register_duplicate_username(client: TestClient):
    """Register with duplicate username → 409 DuplicateUserError."""
    client.post(REGISTER_URL, json=VALID_USER)  # first registration
    resp = client.post(REGISTER_URL, json=VALID_USER)  # duplicate
    assert resp.status_code == 409
    body = resp.json()
    assert body["error"] == "DuplicateUserError"
    assert "already" in body["message"].lower()


def test_register_invalid_email(client: TestClient):
    """Register with invalid email format → 422 ValidationError."""
    bad_payload = {**VALID_USER, "email": "not-an-email"}
    resp = client.post(REGISTER_URL, json=bad_payload)
    assert resp.status_code == 422


def test_login_correct_credentials(client: TestClient):
    """Login with correct credentials → 200 with user_id, username, role."""
    client.post(REGISTER_URL, json=VALID_USER)
    resp = client.post(LOGIN_URL, json={"username": "rahul", "password": "secure1234"})
    assert resp.status_code == 200
    body = resp.json()
    assert body["message"] == "Login successful"
    assert body["username"] == "rahul"
    assert body["role"] == "user"
    assert "user_id" in body


def test_login_wrong_password(client: TestClient):
    """Login with wrong password → 401 InvalidCredentialsError."""
    client.post(REGISTER_URL, json=VALID_USER)
    resp = client.post(LOGIN_URL, json={"username": "rahul", "password": "wrongpass"})
    assert resp.status_code == 401
    body = resp.json()
    assert body["error"] == "InvalidCredentialsError"
