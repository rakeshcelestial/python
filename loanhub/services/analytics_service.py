import logging

from sqlalchemy.orm import Session

from decorators.timer import timer
from models.db_models import Loan, User
from models.enums import LoanStatus
from models.schemas import AnalyticsSummary
from repositories.sqlalchemy_repository import SQLAlchemyRepository

logger = logging.getLogger(__name__)


class AnalyticsService:
    """Aggregates loan statistics using comprehensions (SRP)."""

    def __init__(self, db: Session):
        self._loan_repo: SQLAlchemyRepository = SQLAlchemyRepository(Loan, db)
        self._user_repo: SQLAlchemyRepository = SQLAlchemyRepository(User, db)

    @timer
    def get_summary(self) -> AnalyticsSummary:
        all_loans = self._loan_repo.find_all_raw()
        total_users = self._user_repo.count_by()

        # Status breakdown via dict comprehension
        status_counts = {
            status.value: len([l for l in all_loans if l.status == status])
            for status in LoanStatus
        }

        # Loans by purpose via dict comprehension
        loans_by_purpose = {
            purpose: len([l for l in all_loans if l.purpose.value == purpose])
            for purpose in set(l.purpose.value for l in all_loans)
        }

        # Loans by employment via dict comprehension
        loans_by_employment = {
            emp: len([l for l in all_loans if l.employment_status.value == emp])
            for emp in set(l.employment_status.value for l in all_loans)
        }

        # Average loan amount via list comprehension
        amounts = [l.amount for l in all_loans]
        avg_loan_amount = sum(amounts) / len(amounts) if amounts else 0.0

        # Total disbursed (approved only) via list comprehension with filter
        total_disbursed = sum(
            l.amount for l in all_loans if l.status == LoanStatus.approved
        )

        logger.info("Analytics summary computed")

        return AnalyticsSummary(
            total_users=total_users,
            total_loans=len(all_loans),
            pending_loans=status_counts.get("pending", 0),
            approved_loans=status_counts.get("approved", 0),
            rejected_loans=status_counts.get("rejected", 0),
            total_disbursed_amount=total_disbursed,
            loans_by_purpose=loans_by_purpose,
            loans_by_employment=loans_by_employment,
            avg_loan_amount=round(avg_loan_amount, 2),
        )
