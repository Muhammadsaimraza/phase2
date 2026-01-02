"""Create users and sessions tables.

Revision ID: 001
Revises:
Create Date: 2026-01-01

"""

from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(255), unique=True, nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.func.now(),
            onupdate=sa.func.now(),
        ),
    )

    # Create index on email for faster lookups
    op.create_index("ix_users_email", "users", ["email"])

    # Create sessions table
    op.create_table(
        "sessions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("refresh_token", sa.String(512), unique=True, nullable=False),
        sa.Column("expires_at", sa.DateTime(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column("revoked_at", sa.DateTime(), nullable=True),
    )

    # Create indexes on sessions
    op.create_index("ix_sessions_refresh_token", "sessions", ["refresh_token"])
    op.create_index("ix_sessions_user_id", "sessions", ["user_id"])

    # Enable Row Level Security on both tables
    op.execute("ALTER TABLE users ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE sessions ENABLE ROW LEVEL SECURITY")

    # Create RLS policies for users table
    op.execute(
        """
        CREATE POLICY users_select_own ON users
            FOR SELECT
            USING (id = current_setting('app.current_user_id', true)::uuid)
        """
    )
    op.execute(
        """
        CREATE POLICY users_update_own ON users
            FOR UPDATE
            USING (id = current_setting('app.current_user_id', true)::uuid)
        """
    )

    # Create RLS policies for sessions table
    op.execute(
        """
        CREATE POLICY sessions_select_own ON sessions
            FOR SELECT
            USING (user_id = current_setting('app.current_user_id', true)::uuid)
        """
    )
    op.execute(
        """
        CREATE POLICY sessions_delete_own ON sessions
            FOR DELETE
            USING (user_id = current_setting('app.current_user_id', true)::uuid)
        """
    )

    # Create helper function to set current user context
    op.execute(
        """
        CREATE OR REPLACE FUNCTION set_current_user_id(user_uuid uuid)
        RETURNS void AS $$
        BEGIN
            PERFORM set_config('app.current_user_id', user_uuid::text, true);
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER
        """
    )


def downgrade() -> None:
    # Drop helper function
    op.execute("DROP FUNCTION IF EXISTS set_current_user_id(uuid)")

    # Drop RLS policies
    op.execute("DROP POLICY IF EXISTS sessions_delete_own ON sessions")
    op.execute("DROP POLICY IF EXISTS sessions_select_own ON sessions")
    op.execute("DROP POLICY IF EXISTS users_update_own ON users")
    op.execute("DROP POLICY IF EXISTS users_select_own ON users")

    # Drop tables (cascades will handle foreign keys)
    op.drop_table("sessions")
    op.drop_table("users")
