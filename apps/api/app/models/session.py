"""Session model for authentication tokens."""

from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .user import User


class SessionBase(SQLModel):
    """Base Session model with shared fields."""

    expires_at: datetime = Field(description="Token expiration timestamp")


class Session(SessionBase, table=True):
    """Session database model for refresh tokens."""

    __tablename__ = "sessions"

    id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        description="Unique session identifier",
    )
    user_id: UUID = Field(
        foreign_key="users.id",
        index=True,
        description="Reference to user",
    )
    refresh_token: str = Field(
        unique=True,
        index=True,
        max_length=512,
        description="Refresh token value",
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Session creation timestamp",
    )
    revoked_at: datetime | None = Field(
        default=None,
        description="Token revocation timestamp (null if active)",
    )

    # Relationships
    user: "User" = Relationship(back_populates="sessions")

    @property
    def is_expired(self) -> bool:
        """Check if the session has expired."""
        return datetime.utcnow() > self.expires_at

    @property
    def is_revoked(self) -> bool:
        """Check if the session has been revoked."""
        return self.revoked_at is not None

    @property
    def is_valid(self) -> bool:
        """Check if the session is still valid."""
        return not self.is_expired and not self.is_revoked


class SessionCreate(SessionBase):
    """Schema for creating a new session."""

    user_id: UUID
    refresh_token: str


class SessionRead(SessionBase):
    """Schema for reading session data."""

    id: UUID
    user_id: UUID
    created_at: datetime
    revoked_at: datetime | None
