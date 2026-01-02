"""Todo model for task management."""

from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .user import User


class TodoStatus(str, Enum):
    """Todo status options."""

    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class TodoPriority(str, Enum):
    """Todo priority levels."""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class TodoBase(SQLModel):
    """Base Todo model with shared fields."""

    title: str = Field(
        max_length=200,
        min_length=1,
        description="Todo title (1-200 characters)",
    )
    description: str | None = Field(
        default=None,
        max_length=2000,
        description="Optional detailed description",
    )
    status: TodoStatus = Field(
        default=TodoStatus.PENDING,
        description="Current status",
    )
    priority: TodoPriority = Field(
        default=TodoPriority.MEDIUM,
        description="Priority level",
    )
    due_date: datetime | None = Field(
        default=None,
        description="Optional due date",
    )


class Todo(TodoBase, table=True):
    """Todo database model."""

    __tablename__ = "todos"

    id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        description="Unique todo identifier",
    )
    user_id: UUID = Field(
        foreign_key="users.id",
        index=True,
        description="Owner user ID",
    )
    completed_at: datetime | None = Field(
        default=None,
        description="Completion timestamp",
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Creation timestamp",
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column_kwargs={"onupdate": datetime.utcnow},
        description="Last update timestamp",
    )

    # Relationships
    user: "User" = Relationship(back_populates="todos")


class TodoCreate(SQLModel):
    """Schema for creating a new todo."""

    title: str = Field(
        min_length=1,
        max_length=200,
        description="Todo title",
    )
    description: str | None = Field(
        default=None,
        max_length=2000,
        description="Optional description",
    )
    priority: TodoPriority = Field(
        default=TodoPriority.MEDIUM,
        description="Priority level",
    )
    due_date: datetime | None = Field(
        default=None,
        description="Optional due date",
    )


class TodoUpdate(SQLModel):
    """Schema for updating a todo (partial update)."""

    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=200,
        description="Updated title",
    )
    description: str | None = Field(
        default=None,
        max_length=2000,
        description="Updated description",
    )
    status: TodoStatus | None = Field(
        default=None,
        description="Updated status",
    )
    priority: TodoPriority | None = Field(
        default=None,
        description="Updated priority",
    )
    due_date: datetime | None = Field(
        default=None,
        description="Updated due date",
    )


class TodoRead(TodoBase):
    """Schema for reading todo data."""

    id: UUID
    user_id: UUID
    completed_at: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
