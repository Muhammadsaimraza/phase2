"""Create todos table.

Revision ID: 002
Revises: 001
Create Date: 2026-01-02

"""

from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create todos table
    op.create_table(
        "todos",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column(
            "status",
            sa.String(20),
            nullable=False,
            server_default="pending",
        ),
        sa.Column(
            "priority",
            sa.String(10),
            nullable=False,
            server_default="medium",
        ),
        sa.Column("due_date", sa.DateTime(timezone=True), nullable=True),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
            onupdate=sa.func.now(),
        ),
        # Constraints
        sa.CheckConstraint(
            "status IN ('pending', 'in_progress', 'completed')",
            name="todos_status_check",
        ),
        sa.CheckConstraint(
            "priority IN ('low', 'medium', 'high')",
            name="todos_priority_check",
        ),
    )

    # Create indexes for common queries
    op.create_index("ix_todos_user_id", "todos", ["user_id"])
    op.create_index("ix_todos_status", "todos", ["status"])
    op.create_index("ix_todos_priority", "todos", ["priority"])
    op.create_index("ix_todos_due_date", "todos", ["due_date"])
    op.create_index("ix_todos_created_at", "todos", ["created_at"])

    # Composite index for common filter + sort queries
    op.create_index(
        "ix_todos_user_status_created",
        "todos",
        ["user_id", "status", "created_at"],
    )

    # Enable Row Level Security
    op.execute("ALTER TABLE todos ENABLE ROW LEVEL SECURITY")

    # Create RLS policies for todos table
    op.execute(
        """
        CREATE POLICY todos_select_own ON todos
            FOR SELECT
            USING (user_id = current_setting('app.current_user_id', true)::uuid)
        """
    )
    op.execute(
        """
        CREATE POLICY todos_insert_own ON todos
            FOR INSERT
            WITH CHECK (user_id = current_setting('app.current_user_id', true)::uuid)
        """
    )
    op.execute(
        """
        CREATE POLICY todos_update_own ON todos
            FOR UPDATE
            USING (user_id = current_setting('app.current_user_id', true)::uuid)
        """
    )
    op.execute(
        """
        CREATE POLICY todos_delete_own ON todos
            FOR DELETE
            USING (user_id = current_setting('app.current_user_id', true)::uuid)
        """
    )


def downgrade() -> None:
    # Drop RLS policies
    op.execute("DROP POLICY IF EXISTS todos_delete_own ON todos")
    op.execute("DROP POLICY IF EXISTS todos_update_own ON todos")
    op.execute("DROP POLICY IF EXISTS todos_insert_own ON todos")
    op.execute("DROP POLICY IF EXISTS todos_select_own ON todos")

    # Drop indexes
    op.drop_index("ix_todos_user_status_created")
    op.drop_index("ix_todos_created_at")
    op.drop_index("ix_todos_due_date")
    op.drop_index("ix_todos_priority")
    op.drop_index("ix_todos_status")
    op.drop_index("ix_todos_user_id")

    # Drop table
    op.drop_table("todos")
