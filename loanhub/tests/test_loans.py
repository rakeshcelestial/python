"""
test_loans.py — 5 tests covering user loan application and retrieval flows.
"""
import pytest
from fastapi.testclient import TestClient

from models.db_models import Loan, User
from models.enums import EmploymentStatus, LoanPurpose, LoanStatus

LOANS_URL = "/loans"

VALID_LOAN = {
    "amount": 500000,
    "purpose": "home",
    "tenure_months": 240,
    "employment_status": "employed",
}


def test_apply_loan_success(client: TestClient, regular_user: User):
    """Apply for a loan successfully → 201."""
    resp = client.post(
        "/loans",
        json=VALID_LOAN,
        headers={"Authorization": f"Bearer {user_token}"},   # NEW
    )
    assert resp.status_code == 201
    body = resp.json()
    assert body["user_id"] == regular_user.id
    assert body["amount"] == 500000
    assert body["purpose"] == "home"
    assert body["status"] == "pending"
    assert body["admin_remarks"] is None


def test_apply_loan_amount_too_high(client: TestClient, regular_user: User):
    """Apply with amount > 10,00,000 → 422 ValidationError."""
    bad_payload = {**VALID_LOAN, "amount": 1500000}
    resp = client.post(
        LOANS_URL,
        json=bad_payload,
        params={"user_id": regular_user.id},
    )
    assert resp.status_code == 422


def test_apply_loan_max_pending_exceeded(
    client: TestClient, regular_user: User, db
):
    """Apply when already at 3 pending loans → 422 MaxPendingLoansError."""
    # Pre-seed 3 pending loans
    for _ in range(3):
        loan = Loan(
            user_id=regular_user.id,
            amount=100000,
            purpose=LoanPurpose.personal,
            tenure_months=12,
            employment_status=EmploymentStatus.employed,
            status=LoanStatus.pending,
        )
        db.add(loan)
    db.commit()

    resp = client.post(
        LOANS_URL,
        json=VALID_LOAN,
        params={"user_id": regular_user.id},
    )
    assert resp.status_code == 422
    body = resp.json()
    assert body["error"] == "MaxPendingLoansError"


def test_get_my_loans(client: TestClient, regular_user: User, pending_loan: Loan):
    """GET /loans/my returns the user's loan list → 200."""
    resp = client.get(
        f"{LOANS_URL}/my",
        params={"user_id": regular_user.id},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert isinstance(body, list)
    assert len(body) >= 1
    assert body[0]["user_id"] == regular_user.id


def test_get_single_loan_detail(
    client: TestClient, regular_user: User, pending_loan: Loan
):
    """GET /loans/my/{loan_id} returns full detail → 200."""
    resp = client.get(
        f"{LOANS_URL}/my/{pending_loan.id}",
        params={"user_id": regular_user.id},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["id"] == pending_loan.id
    assert body["amount"] == pending_loan.amount
    assert body["status"] == "pending"
