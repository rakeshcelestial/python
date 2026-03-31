from typing import List, Optional
from concurrent.futures import ThreadPoolExecutor
import time

from fastapi import APIRouter, BackgroundTasks, Depends, Query
from sqlalchemy.orm import Session

from database import get_db
from decorators.timer import timer
from dependencies.auth import get_current_admin      # NEW
from models.db_models import Loan, User
from models.schemas import BulkCheckRequest, LoanResponse, LoanReview
from services.loan_service import LoanService
from services.user_service import UserService
from utils.notifications import notify_loan_reviewed
from models.schemas import BulkCheckRequest, LoanResponse, LoanReview, UserResponse, UserRoleUpdate

router = APIRouter(prefix="/admin", tags=["Admin - Loans"])


@router.get("/loans", response_model=List[LoanResponse])
def list_all_loans(
    status: Optional[str] = Query(None),
    user_id: Optional[int] = Query(None),
    purpose: Optional[str] = Query(None),
    employment_status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    sort_by: str = Query("applied_at"),
    order: str = Query("desc"),
    admin: User = Depends(get_current_admin),        # NEW
    db: Session = Depends(get_db),
):
    return LoanService(db).get_all_loans(
        status=status, user_id=user_id, purpose=purpose,
        employment_status=employment_status,
        page=page, limit=limit, sort_by=sort_by, order=order,
    )


@router.get("/loans/{loan_id}", response_model=LoanResponse)
def get_loan(
    loan_id: int,
    admin: User = Depends(get_current_admin),        # NEW
    db: Session = Depends(get_db),
):
    return LoanService(db).get_loan_by_id(loan_id)


@router.patch("/loans/{loan_id}/review", response_model=LoanResponse)
def review_loan(
    loan_id: int,
    data: LoanReview,
    background_tasks: BackgroundTasks,
    admin: User = Depends(get_current_admin),        # NEW
    db: Session = Depends(get_db),
):
    loan = LoanService(db).review_loan(loan_id, data, admin)
    applicant = UserService(db).get_by_id(loan.user_id)
    background_tasks.add_task(
        notify_loan_reviewed, loan.id, applicant.username, loan.status.value
    )
    return loan


@router.post("/loans/bulk-check")
def bulk_eligibility_check(
    payload: BulkCheckRequest,
    admin: User = Depends(get_current_admin),        # NEW
    db: Session = Depends(get_db),
):
    loans = LoanService(db).get_loans_for_bulk_check(payload.loan_ids)
    start = time.perf_counter()
    with ThreadPoolExecutor(max_workers=min(10, len(loans) or 1)) as executor:
        def score(loan):
            time.sleep(0.01)
            s = round(loan.user.monthly_income / loan.amount * 100, 2) if loan.amount else 0
            return {"loan_id": loan.id, "amount": loan.amount, "eligibility_score": s, "eligible": s >= 5}
        results = list(executor.map(score, loans))
    return {"results": results, "processed": len(results), "elapsed_seconds": round(time.perf_counter() - start, 4)}

@router.patch("/users/{user_id}/role", response_model=UserResponse)
def change_user_role(
    user_id: int,
    data: UserRoleUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """
    Admin-only: change any user's role to 'user' or 'admin'.
    """
    return UserService(db).change_user_role(user_id, data.role)