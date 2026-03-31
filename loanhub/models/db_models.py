from datetime import datetime, timezone

from sqlalchemy import (
    Boolean, Column, DateTime, Enum, ForeignKey,
    Integer, String, Text
)
from sqlalchemy.orm import relationship

from database import Base
from models.enums import EmploymentStatus, LoanPurpose, LoanStatus, UserRole


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(120), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    phone = Column(String(15), nullable=False)
    monthly_income = Column(Integer, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.user)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    loans = relationship("Loan", back_populates="user")

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', role='{self.role}')>"


class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    amount = Column(Integer, nullable=False)
    purpose = Column(Enum(LoanPurpose), nullable=False)
    tenure_months = Column(Integer, nullable=False)
    employment_status = Column(Enum(EmploymentStatus), nullable=False)
    status = Column(Enum(LoanStatus), nullable=False, default=LoanStatus.pending)
    admin_remarks = Column(Text, nullable=True)
    reviewed_by = Column(String(50), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    applied_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc))
    credit_score = Column(Integer, nullable=True)

    user = relationship("User", back_populates="loans")

    def __repr__(self):
        return (
            f"<Loan(id={self.id}, user_id={self.user_id}, "
            f"amount={self.amount}, status='{self.status}')>"
        )
