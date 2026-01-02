"""Security utilities for authentication."""

from datetime import datetime, timedelta
from typing import Any
from uuid import UUID, uuid4

import bcrypt
from jose import JWTError, jwt

from .config import settings

# Token types
ACCESS_TOKEN_TYPE = "access"
REFRESH_TOKEN_TYPE = "refresh"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8"),
    )


def hash_password(password: str) -> str:
    """Hash a password for storage."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def create_access_token(
    user_id: UUID,
    expires_delta: timedelta | None = None,
) -> str:
    """Create a JWT access token."""
    if expires_delta is None:
        expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    expire = datetime.utcnow() + expires_delta

    payload = {
        "sub": str(user_id),
        "exp": expire,
        "iat": datetime.utcnow(),
        "jti": str(uuid4()),  # Unique token ID for each token
        "type": ACCESS_TOKEN_TYPE,
    }

    return jwt.encode(
        payload,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )


def create_refresh_token(
    user_id: UUID,
    expires_delta: timedelta | None = None,
) -> str:
    """Create a JWT refresh token."""
    if expires_delta is None:
        expires_delta = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    expire = datetime.utcnow() + expires_delta

    payload = {
        "sub": str(user_id),
        "exp": expire,
        "iat": datetime.utcnow(),
        "jti": str(uuid4()),  # Unique token ID for each token
        "type": REFRESH_TOKEN_TYPE,
    }

    return jwt.encode(
        payload,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )


def decode_token(token: str) -> dict[str, Any] | None:
    """Decode and validate a JWT token."""
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
        )
        return payload
    except JWTError:
        return None


def verify_access_token(token: str) -> UUID | None:
    """Verify an access token and return the user ID."""
    payload = decode_token(token)
    if payload is None:
        return None

    # Check token type
    if payload.get("type") != ACCESS_TOKEN_TYPE:
        return None

    # Get user ID
    user_id = payload.get("sub")
    if user_id is None:
        return None

    try:
        return UUID(user_id)
    except ValueError:
        return None


def verify_refresh_token(token: str) -> UUID | None:
    """Verify a refresh token and return the user ID."""
    payload = decode_token(token)
    if payload is None:
        return None

    # Check token type
    if payload.get("type") != REFRESH_TOKEN_TYPE:
        return None

    # Get user ID
    user_id = payload.get("sub")
    if user_id is None:
        return None

    try:
        return UUID(user_id)
    except ValueError:
        return None


def get_token_expiry(token: str) -> datetime | None:
    """Get the expiry time of a token."""
    payload = decode_token(token)
    if payload is None:
        return None

    exp = payload.get("exp")
    if exp is None:
        return None

    return datetime.fromtimestamp(exp)
