"""Rate limiting middleware using slowapi."""

from fastapi import Request, Response
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from starlette.responses import JSONResponse

from app.core import settings


def get_client_ip(request: Request) -> str:
    """
    Get client IP address from request.

    Handles X-Forwarded-For header for proxied requests.
    """
    # Check for forwarded header (common in production behind proxy/load balancer)
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        # X-Forwarded-For can contain multiple IPs; the first is the client
        return forwarded.split(",")[0].strip()

    # Fall back to direct connection IP
    return get_remote_address(request)


# Create limiter instance with IP-based key
limiter = Limiter(key_func=get_client_ip)


def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> Response:
    """
    Custom handler for rate limit exceeded errors.

    Returns RFC 7807 compliant error response with Retry-After header.
    """
    # Parse the limit string to get window information
    # Format is typically "5 per 15 minutes" or similar
    retry_after = settings.LOGIN_RATE_LIMIT_WINDOW  # Default to login window

    response = JSONResponse(
        status_code=429,
        content={
            "type": "about:blank",
            "title": "Too Many Requests",
            "status": 429,
            "detail": f"Rate limit exceeded: {exc.detail}",
            "instance": str(request.url),
        },
    )

    # Add Retry-After header (in seconds)
    response.headers["Retry-After"] = str(retry_after)
    response.headers["X-RateLimit-Limit"] = str(settings.LOGIN_RATE_LIMIT)

    return response


# Rate limit strings for different endpoints
GENERAL_RATE_LIMIT = f"{settings.RATE_LIMIT_PER_MINUTE}/minute"
LOGIN_RATE_LIMIT = f"{settings.LOGIN_RATE_LIMIT}/{settings.LOGIN_RATE_LIMIT_WINDOW} seconds"
REGISTER_RATE_LIMIT = "10/hour"  # Generous limit for registration
