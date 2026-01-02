from fastapi import APIRouter

from .auth import router as auth_router
from .todos import router as todos_router

api_router = APIRouter()

# Auth routes
api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])

# Todo routes
api_router.include_router(todos_router, prefix="/todos", tags=["Todos"])
