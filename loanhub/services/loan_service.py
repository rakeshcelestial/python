import logging
from datetime import datetime, timezone
from typing import List, Optional

from sqlalchemy.orm import Session

from decorators.timer import timer
from exceptions.custom_exceptions import (
    ForbiddenError,
    InvalidLoanReviewError,
    LoanNotFoundError,
    MaxPendingLoansError,
)
from models.db_models import Loan, User
from models.enums import LoanStatus, UserRole
from models.schemas import LoanCreate, LoanReview
from repositories.sqlalchemy_repository import SQLAlchemyRepository

logger = logging.getLogger(__name__)

MAX_PENDING_LOANS = 3


class LoanService:
    """Handles all loan business logic (SRP). Depends on BaseRepository (DIP)."""

    def __init__(self, db: Session):
        self._repo: SQLAlchemyRepository = SQLAlchemyRepository(Loan, db)

    @timer
    def apply_loan(self, data: LoanCreate, current_user: User) -> Loan:
        if current_user.role == UserRole.admin:
            raise ForbiddenError("Admins cannot apply for loans")

        pending_count = self._repo.count_by(
            user_id=current_user.id, status=LoanStatus.pending
        )
        if pending_count >= MAX_PENDING_LOANS:
            logger.warning(f"Max pending loans reached for user: {current_user.username}")
            raise MaxPendingLoansError()

        loan = Loan(
            user_id=current_user.id,
            amount=data.amount,
            purpose=data.purpose,
            tenure_months=data.tenure_months,
            employment_status=data.employment_status,
            status=LoanStatus.pending,
        )
        saved = self._repo.save(loan)
        logger.info(
            f"Loan applied: id={saved.id}, user={current_user.username}, "
            f"amount={saved.amount}, purpose={saved.purpose}"
        )
        return saved

    def get_my_loans(
        self,
        current_user: User,
        status: Optional[str] = None,
        page: int = 1,
        limit: int = 10,
    ) -> List[Loan]:
        filters = {"user_id": current_user.id}
        if status:
            filters["status"] = LoanStatus(status)
        return self._repo.find_all_filtered(filters, page=page, limit=limit)

    def get_my_loan(self, loan_id: int, current_user: User) -> Loan:
        loan = self._repo.find(loan_id)
        if not loan or loan.user_id != current_user.id:
            raise LoanNotFoundError(f"Loan #{loan_id} not found")
        return loan

    def get_all_loans(
        self,
        status: Optional[str] = None,
        user_id: Optional[int] = None,
        purpose: Optional[str] = None,
        employment_status: Optional[str] = None,
        page: int = 1,
        limit: int = 10,
        sort_by: str = "applied_at",
        order: str = "desc",
    ) -> List[Loan]:
        filters = {}
        if status:
            filters["status"] = LoanStatus(status)
        if user_id:
            filters["user_id"] = user_id
        if purpose:
            from models.enums import LoanPurpose
            filters["purpose"] = LoanPurpose(purpose)
        if employment_status:
            from models.enums import EmploymentStatus
            filters["employment_status"] = EmploymentStatus(employment_status)
        return self._repo.find_all_filtered(
            filters, page=page, limit=limit, sort_by=sort_by, order=order
        )

    def get_loan_by_id(self, loan_id: int) -> Loan:
        loan = self._repo.find(loan_id)
        if not loan:
            raise LoanNotFoundError(f"Loan #{loan_id} not found")
        return loan

    @timer
    def review_loan(
        self, loan_id: int, data: LoanReview, admin: User
    ) -> Loan:
        loan = self._repo.find(loan_id)
        if not loan:
            raise LoanNotFoundError(f"Loan #{loan_id} not found")
        if loan.status != LoanStatus.pending:
            logger.warning(
                f"Re-review attempt on loan #{loan_id} (status={loan.status})"
            )
            raise InvalidLoanReviewError(
                f"Loan #{loan_id} has already been {loan.status}. Only pending loans can be reviewed."
            )

        loan.status = data.status
        loan.admin_remarks = data.admin_remarks
        loan.reviewed_by = admin.username
        loan.reviewed_at = datetime.now(timezone.utc)
        loan.updated_at = datetime.now(timezone.utc)

        try:
            updated = self._repo.update(loan)
            logger.info(
                f"Loan #{loan_id} {data.status} by admin '{admin.username}'"
            )
            return updated
        except Exception as exc:
            self._repo._db.rollback()
            logger.error(f"Failed to review loan #{loan_id}: {exc}")
            raise

    def get_loans_for_bulk_check(self, loan_ids: List[int]) -> List[Loan]:
        loans = [self._repo.find(lid) for lid in loan_ids]
        return [l for l in loans if l is not None]
