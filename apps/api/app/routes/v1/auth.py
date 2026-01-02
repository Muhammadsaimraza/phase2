"""Authentication API endpoints."""

from datetime import datetime, timedelta
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import (
    create_access_token,
    create_refresh_token,
    get_token_expiry,
    hash_password,
    settings,
    verify_password,
    verify_refresh_token,
)
from app.core.database import get_session
from app.middleware import (
    CurrentUser,
    CurrentUserId,
    LOGIN_RATE_LIMIT,
    REGISTER_RATE_LIMIT,
    limiter,
)
from app.models import Session, User
from app.schemas import (
    MessageResponse,
    RefreshTokenRequest,
    TokenResponse,
    UserLogin,
    UserRegister,
    UserResponse,
)

router = APIRouter()


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    responses={
        201: {"description": "User created successfully"},
        400: {"description": "Invalid email or weak password"},
        409: {"description": "Email already registered"},
        429: {"description": "Too many registration attempts"},
    },
)
@limiter.limit(REGISTER_RATE_LIMIT)
async def register(
    request: Request,
    data: UserRegister,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> User:
    """
    Register a new user account.

    - **email**: Valid email address (must be unique)
    - **password**: Min 8 characters, 1 uppercase, 1 number
    """
    # Check if email already exists
    result = await session.execute(select(User).where(User.email == data.email))
    existing_user = result.scalar_one_or_none()

    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    # Create new user
    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
    )

    session.add(user)
    await session.commit()
    await session.refresh(user)

    return user


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Authenticate user",
    responses={
        200: {"description": "Login successful"},
        401: {"description": "Invalid credentials"},
        429: {"description": "Too many login attempts"},
    },
)
@limiter.limit(LOGIN_RATE_LIMIT)
async def login(
    request: Request,
    data: UserLogin,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> TokenResponse:
    """
    Authenticate user and issue JWT tokens.

    - **email**: Registered email address
    - **password**: Account password

    Returns access token (24h) and refresh token (7d).
    """
    # Find user by email
    result = await session.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    if user is None or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    # Create tokens
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    # Calculate expiry for refresh token
    refresh_expires = datetime.utcnow() + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )

    # Store refresh token in database
    db_session = Session(
        user_id=user.id,
        refresh_token=refresh_token,
        expires_at=refresh_expires,
    )
    session.add(db_session)
    await session.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="Refresh access token",
    responses={
        200: {"description": "Token refreshed successfully"},
        401: {"description": "Invalid or expired refresh token"},
    },
)
async def refresh(
    data: RefreshTokenRequest,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> TokenResponse:
    """
    Refresh an expired access token using a valid refresh token.

    - **refresh_token**: Valid, non-expired refresh token

    Returns new access token and optionally rotates refresh token.
    """
    # Verify the refresh token JWT
    user_id = verify_refresh_token(data.refresh_token)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    # Check if refresh token exists in database and is not revoked
    result = await session.execute(
        select(Session).where(
            Session.refresh_token == data.refresh_token,
            Session.revoked_at.is_(None),
        )
    )
    db_session = result.scalar_one_or_none()

    if db_session is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token not found or revoked",
        )

    # Check if session is expired
    if db_session.is_expired:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token expired",
        )

    # Verify user still exists
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    # Revoke old refresh token (token rotation)
    db_session.revoked_at = datetime.utcnow()

    # Create new tokens
    new_access_token = create_access_token(user.id)
    new_refresh_token = create_refresh_token(user.id)

    # Calculate expiry for new refresh token
    refresh_expires = datetime.utcnow() + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )

    # Store new refresh token
    new_db_session = Session(
        user_id=user.id,
        refresh_token=new_refresh_token,
        expires_at=refresh_expires,
    )
    session.add(new_db_session)
    await session.commit()

    return TokenResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Logout user",
    responses={
        200: {"description": "Logged out successfully"},
        401: {"description": "Not authenticated"},
    },
)
async def logout(
    user_id: CurrentUserId,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> MessageResponse:
    """
    Logout the current user by revoking all their sessions.

    Requires valid JWT access token in Authorization header.
    """
    # Revoke all active sessions for this user
    result = await session.execute(
        select(Session).where(
            Session.user_id == user_id,
            Session.revoked_at.is_(None),
        )
    )
    active_sessions = result.scalars().all()

    for db_session in active_sessions:
        db_session.revoked_at = datetime.utcnow()

    await session.commit()

    return MessageResponse(message="Logged out successfully")


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user",
    responses={
        200: {"description": "Current user profile"},
        401: {"description": "Not authenticated"},
    },
)
async def get_me(user: CurrentUser) -> User:
    """
    Get the current authenticated user's profile.

    Requires valid JWT access token in Authorization header.
    """
    return user
