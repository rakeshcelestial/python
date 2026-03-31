from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from dependencies.auth import get_current_admin      # NEW
from models.db_models import User
from models.schemas import AnalyticsSummary
from services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/summary", response_model=AnalyticsSummary)
def get_summary(
    admin: User = Depends(get_current_admin),        # NEW
    db: Session = Depends(get_db),
):
    return AnalyticsService(db).get_summary()