import hashlib
import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

os.environ["DATABASE_URL"] = "sqlite:///./test_loanhub.db"
os.environ["SECRET_KEY"] = "test-secret-key"
os.environ["ADMIN_USERNAME"] = "admin"
os.environ["ADMIN_PASSWORD"] = "admin1234"
os.environ["ADMIN_EMAIL"] = "admin@loanhub.com"

from database import Base, get_db
from main import app
from models.db_models import Loan, User
from models.enums import EmploymentStatus, LoanPurpose, LoanStatus, UserRole
from utils.jwt_utils import create_access_token

SQLALCHEMY_TEST_URL = "sqlite:///./test_loanhub.db"
engine_test = create_engine(SQLALCHEMY_TEST_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)


def _hash(pw: str) -> str:
    return hashlib.sha256(pw.encode()).hexdigest()


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function", autouse=True)
def setup_db():
    Base.metadata.drop_all(bind=engine_test)
    Base.metadata.create_all(bind=engine_test)
    app.dependency_overrides[get_db] = override_get_db
    yield
    Base.metadata.drop_all(bind=engine_test)
    app.dependency_overrides.clear()


@pytest.fixture
def client():
    return TestClient(app, raise_server_exceptions=False)


@pytest.fixture
def db():
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def regular_user(db):
    user = User(username="testuser", email="testuser@mail.com",
                password=_hash("password123"), phone="9876543210",
                monthly_income=50000, role=UserRole.user)
    db.add(user); db.commit(); db.refresh(user)
    return user


@pytest.fixture
def admin_user(db):
    admin = User(username="admin", email="admin@loanhub.com",
                 password=_hash("admin1234"), phone="0000000000",
                 monthly_income=0, role=UserRole.admin)
    db.add(admin); db.commit(); db.refresh(admin)
    return admin


@pytest.fixture
def user_token(regular_user):
    """JWT token for the regular user fixture."""
    return create_access_token({"sub": str(regular_user.id), "role": "user"})


@pytest.fixture
def admin_token(admin_user):
    """JWT token for the admin user fixture."""
    return create_access_token({"sub": str(admin_user.id), "role": "admin"})


@pytest.fixture
def pending_loan(db, regular_user):
    loan = Loan(user_id=regular_user.id, amount=200000, purpose=LoanPurpose.home,
                tenure_months=120, employment_status=EmploymentStatus.employed,
                status=LoanStatus.pending)
    db.add(loan); db.commit(); db.refresh(loan)
    return loan