"""Todo schemas for request/response validation."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.todo import TodoPriority, TodoStatus


class TodoCreate(BaseModel):
    """Schema for creating a new todo."""

    title: str = Field(
        min_length=1,
        max_length=200,
        description="Todo title (required)",
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


class TodoUpdate(BaseModel):
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


class TodoResponse(BaseModel):
    """Schema for todo response."""

    id: UUID = Field(description="Todo unique identifier")
    user_id: UUID = Field(description="Owner user ID")
    title: str = Field(description="Todo title")
    description: str | None = Field(description="Optional description")
    status: TodoStatus = Field(description="Current status")
    priority: TodoPriority = Field(description="Priority level")
    due_date: datetime | None = Field(description="Due date")
    completed_at: datetime | None = Field(description="Completion timestamp")
    created_at: datetime = Field(description="Creation timestamp")
    updated_at: datetime = Field(description="Last update timestamp")

    model_config = {"from_attributes": True}


class TodoListResponse(BaseModel):
    """Schema for paginated todo list response."""

    items: list[TodoResponse] = Field(description="List of todos")
    total: int = Field(description="Total number of todos")
    page: int = Field(description="Current page number")
    per_page: int = Field(description="Items per page")
    pages: int = Field(description="Total number of pages")
