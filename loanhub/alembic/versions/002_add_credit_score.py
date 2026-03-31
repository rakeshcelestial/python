"""add credit_score to loans

Revision ID: 002_add_credit_score
Revises: 001_initial
Create Date: 2026-03-25 11:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "002_add_credit_score"
down_revision: Union[str, None] = "001_initial"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "loans",
        sa.Column("credit_score", sa.Integer(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("loans", "credit_score")
