"""User model for authentication."""

from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .session import Session
    from .todo import Todo


class UserBase(SQLModel):
    """Base User model with shared fields."""

    email: str = Field(
        unique=True,
        index=True,
        max_length=255,
        description="User email address",
    )


class User(UserBase, table=True):
    """User database model."""

    __tablename__ = "users"

    id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        description="Unique user identifier",
    )
    password_hash: str = Field(
        max_length=255,
        description="Bcrypt hashed password",
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Account creation timestamp",
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column_kwargs={"onupdate": datetime.utcnow},
        description="Last update timestamp",
    )

    # Relationships
    sessions: list["Session"] = Relationship(back_populates="user")
    todos: list["Todo"] = Relationship(back_populates="user")


class UserCreate(UserBase):
    """Schema for creating a new user."""

    password: str = Field(
        min_length=8,
        description="User password (min 8 chars, 1 uppercase, 1 number)",
    )


class UserRead(UserBase):
    """Schema for reading user data (public)."""

    id: UUID
    created_at: datetime


class UserUpdate(SQLModel):
    """Schema for updating user data."""

    email: str | None = None
    password: str | None = None
