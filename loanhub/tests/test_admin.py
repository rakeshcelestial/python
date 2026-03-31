"""
test_admin.py — 5 tests covering admin loan management and access control.
"""
import pytest
from fastapi.testclient import TestClient

from models.db_models import Loan, User
from models.enums import EmploymentStatus, LoanPurpose, LoanStatus

ADMIN_LOANS_URL = "/admin/loans"

APPROVE_PAYLOAD = {
    "status": "approved",
    "admin_remarks": "Good income-to-loan ratio. Approved for tenure.",
}

REJECT_PAYLOAD = {
    "status": "rejected",
    "admin_remarks": "Insufficient monthly income for requested amount.",
}


def test_admin_views_all_loans(client, admin_user, admin_token, pending_loan):
    resp = client.get(
        "/admin/loans",
        headers={"Authorization": f"Bearer {admin_token}"},  # NEW
    )
    assert resp.status_code == 200

    body = resp.json()
    assert isinstance(body, list)
    assert len(body) >= 1
    assert body[0]["id"] == pending_loan.id


def test_admin_approves_loan(
    client: TestClient,
    admin_user: User,
    pending_loan: Loan,
):
    """Admin PATCH approve → 200 with status=approved and admin_remarks."""
    resp = client.patch(
        f"{ADMIN_LOANS_URL}/{pending_loan.id}/review",
        json=APPROVE_PAYLOAD,
        params={"user_id": admin_user.id},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "approved"
    assert body["admin_remarks"] == APPROVE_PAYLOAD["admin_remarks"]
    assert body["reviewed_by"] == admin_user.username
    assert body["reviewed_at"] is not None


def test_admin_rejects_loan_with_reason(
    client: TestClient,
    admin_user: User,
    pending_loan: Loan,
):
    """Admin PATCH reject → 200 with status=rejected and reason."""
    resp = client.patch(
        f"{ADMIN_LOANS_URL}/{pending_loan.id}/review",
        json=REJECT_PAYLOAD,
        params={"user_id": admin_user.id},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "rejected"
    assert body["admin_remarks"] == REJECT_PAYLOAD["admin_remarks"]


def test_admin_cannot_re_review_loan(
    client: TestClient,
    admin_user: User,
    pending_loan: Loan,
):
    """Admin trying to re-review an already reviewed loan → 422."""
    # First review
    client.patch(
        f"{ADMIN_LOANS_URL}/{pending_loan.id}/review",
        json=APPROVE_PAYLOAD,
        params={"user_id": admin_user.id},
    )
    # Attempt second review
    resp = client.patch(
        f"{ADMIN_LOANS_URL}/{pending_loan.id}/review",
        json=REJECT_PAYLOAD,
        params={"user_id": admin_user.id},
    )
    assert resp.status_code == 422
    body = resp.json()
    assert body["error"] == "InvalidLoanReviewError"


def test_non_admin_cannot_access_admin_endpoint(
    client: TestClient,
    regular_user: User,
    pending_loan: Loan,
):
    """Regular user trying to access admin endpoint → 403 ForbiddenError."""
    resp = client.get(
        ADMIN_LOANS_URL,
        params={"user_id": regular_user.id},
    )
    assert resp.status_code == 403
    body = resp.json()
    assert body["error"] == "ForbiddenError"
