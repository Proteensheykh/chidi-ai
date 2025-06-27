"""Add settings column to user_contexts

Revision ID: 002
Revises: 001
Create Date: 2025-06-27

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add settings column to user_contexts table
    op.add_column(
        'user_contexts',
        sa.Column('settings', sa.JSON(), nullable=False, server_default='{}')
    )


def downgrade() -> None:
    # Remove settings column from user_contexts table
    op.drop_column('user_contexts', 'settings')
