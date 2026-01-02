# Schemas package
from .auth import (
    ErrorDetail,
    MessageResponse,
    RefreshTokenRequest,
    TokenResponse,
    UserLogin,
    UserRegister,
    UserResponse,
)
from .todo import (
    TodoCreate,
    TodoUpdate,
    TodoResponse,
    TodoListResponse,
)

__all__ = [
    # Auth
    "ErrorDetail",
    "MessageResponse",
    "RefreshTokenRequest",
    "TokenResponse",
    "UserLogin",
    "UserRegister",
    "UserResponse",
    # Todo
    "TodoCreate",
    "TodoUpdate",
    "TodoResponse",
    "TodoListResponse",
]
