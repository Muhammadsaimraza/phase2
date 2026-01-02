# Middleware package
from .auth import (
    CurrentUser,
    CurrentUserId,
    bearer_scheme,
    get_current_user,
    get_current_user_id,
)
from .ratelimit import (
    GENERAL_RATE_LIMIT,
    LOGIN_RATE_LIMIT,
    REGISTER_RATE_LIMIT,
    limiter,
    rate_limit_exceeded_handler,
)

__all__ = [
    # Auth middleware
    "CurrentUser",
    "CurrentUserId",
    "bearer_scheme",
    "get_current_user",
    "get_current_user_id",
    # Rate limiting
    "limiter",
    "rate_limit_exceeded_handler",
    "GENERAL_RATE_LIMIT",
    "LOGIN_RATE_LIMIT",
    "REGISTER_RATE_LIMIT",
]
