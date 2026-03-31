"""create users and loans tables

Revision ID: 001_initial
Revises:
Create Date: 2026-03-25 10:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "001_initial"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("username", sa.String(length=50), nullable=False),
        sa.Column("email", sa.String(length=120), nullable=False),
        sa.Column("password", sa.String(length=255), nullable=False),
        sa.Column("phone", sa.String(length=15), nullable=False),
        sa.Column("monthly_income", sa.Integer(), nullable=False),
        sa.Column(
            "role",
            sa.Enum("user", "admin", name="userrole"),
            nullable=False,
            server_default="user",
        ),
        sa.Column("is_active", sa.Boolean(), nullable=True, server_default="true"),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)
    op.create_index(op.f("ix_users_username"), "users", ["username"], unique=True)
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)

    op.create_table(
        "loans",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("amount", sa.Integer(), nullable=False),
        sa.Column(
            "purpose",
            sa.Enum("personal", "education", "home", "vehicle", "business", name="loanpurpose"),
            nullable=False,
        ),
        sa.Column("tenure_months", sa.Integer(), nullable=False),
        sa.Column(
            "employment_status",
            sa.Enum("employed", "self_employed", "unemployed", "student", name="employmentstatus"),
            nullable=False,
        ),
        sa.Column(
            "status",
            sa.Enum("pending", "approved", "rejected", name="loanstatus"),
            nullable=False,
            server_default="pending",
        ),
        sa.Column("admin_remarks", sa.Text(), nullable=True),
        sa.Column("reviewed_by", sa.String(length=50), nullable=True),
        sa.Column("reviewed_at", sa.DateTime(), nullable=True),
        sa.Column("applied_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_loans_id"), "loans", ["id"], unique=False)
    op.create_index(op.f("ix_loans_user_id"), "loans", ["user_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_loans_user_id"), table_name="loans")
    op.drop_index(op.f("ix_loans_id"), table_name="loans")
    op.drop_table("loans")
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_index(op.f("ix_users_username"), table_name="users")
    op.drop_index(op.f("ix_users_id"), table_name="users")
    op.drop_table("users")
    # Drop enums explicitly for PostgreSQL
    op.execute("DROP TYPE IF EXISTS loanstatus")
    op.execute("DROP TYPE IF EXISTS employmentstatus")
    op.execute("DROP TYPE IF EXISTS loanpurpose")
    op.execute("DROP TYPE IF EXISTS userrole")
