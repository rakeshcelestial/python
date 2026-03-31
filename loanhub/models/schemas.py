import re
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator

from models.enums import EmploymentStatus, LoanPurpose, LoanStatus, UserRole


# ─── User Schemas ──────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str
    password: str = Field(..., min_length=8)
    phone: str
    monthly_income: int = Field(..., ge=0)

    @field_validator("username")
    @classmethod
    def username_alphanumeric(cls, v: str) -> str:
        if not re.match(r"^[a-zA-Z0-9_]+$", v):
            raise ValueError("Username must contain only alphanumeric characters and underscores")
        return v

    @field_validator("email")
    @classmethod
    def email_valid(cls, v: str) -> str:
        if "@" not in v or "." not in v.split("@")[-1]:
            raise ValueError("Email must contain @ and . characters")
        return v

    @field_validator("phone")
    @classmethod
    def phone_digits(cls, v: str) -> str:
        if not re.match(r"^\d{10,15}$", v):
            raise ValueError("Phone must be 10-15 digits only")
        return v


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    phone: str
    monthly_income: int
    role: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── Loan Schemas ──────────────────────────────────────────────────────────────

class LoanCreate(BaseModel):
    amount: int = Field(..., gt=0, le=1000000)
    purpose: LoanPurpose
    tenure_months: int = Field(..., ge=6, le=360)
    employment_status: EmploymentStatus


class LoanReview(BaseModel):
    status: LoanStatus
    admin_remarks: str = Field(..., min_length=5, max_length=500)

    @field_validator("status")
    @classmethod
    def status_not_pending(cls, v: LoanStatus) -> LoanStatus:
        if v == LoanStatus.pending:
            raise ValueError("Review status must be 'approved' or 'rejected', not 'pending'")
        return v


class LoanResponse(BaseModel):
    id: int
    user_id: int
    amount: int
    purpose: str
    tenure_months: int
    employment_status: str
    status: str
    admin_remarks: Optional[str] = None
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    applied_at: datetime
    updated_at: datetime
    credit_score: Optional[int] = None

    model_config = {"from_attributes": True}


# ─── Auth Response ─────────────────────────────────────────────────────────────

class LoginResponse(BaseModel):
    message: str
    user_id: int
    username: str
    role: str


# ─── Analytics ─────────────────────────────────────────────────────────────────

class AnalyticsSummary(BaseModel):
    total_users: int
    total_loans: int
    pending_loans: int
    approved_loans: int
    rejected_loans: int
    total_disbursed_amount: int
    loans_by_purpose: dict
    loans_by_employment: dict
    avg_loan_amount: float


# ─── Bulk Check ────────────────────────────────────────────────────────────────

class BulkCheckRequest(BaseModel):
    loan_ids: list[int]

# Add this class to schemas.py alongside the existing ones

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    username: str
    role: str

class UserUpdate(BaseModel):
    # role: UserRole
    email: Optional[str] = None
    phone: Optional[str] = None
    monthly_income: Optional[int] = None
    password: Optional[str] = None

    @field_validator("email")
    @classmethod
    def email_valid(cls, v):
        if v is not None:
            if "@" not in v or "." not in v.split("@")[-1]:
                raise ValueError("Email must contain @ and . characters")
        return v

    @field_validator("phone")
    @classmethod
    def phone_digits(cls, v):
        if v is not None:
            if not re.match(r"^\d{10,15}$", v):
                raise ValueError("Phone must be 10-15 digits only")
        return v

    @field_validator("password")
    @classmethod
    def password_length(cls, v):
        if v is not None and len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v

    @field_validator("monthly_income")
    @classmethod
    def income_positive(cls, v):
        if v is not None and v < 0:
            raise ValueError("Monthly income must be >= 0")
        return v

    # @field_validator("role")
    # @classmethod
    # def role_must_be_valid(cls, v):
    #     if v not in (UserRole.user, UserRole.admin):
    #         raise ValueError("Role must be 'user' or 'admin'")
    #     return v




class UserRoleUpdate(BaseModel):
    role: UserRole
 
    @field_validator("role")
    @classmethod
    def role_must_be_valid(cls, v: UserRole) -> UserRole:
        if v not in (UserRole.user, UserRole.admin):
            raise ValueError("Role must be 'user' or 'admin'")
        return v