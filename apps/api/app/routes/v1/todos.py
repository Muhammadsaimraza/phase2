"""Todo CRUD API endpoints."""

from datetime import datetime
from math import ceil
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.middleware import CurrentUserId
from app.models.todo import Todo, TodoPriority, TodoStatus
from app.schemas.todo import (
    TodoCreate,
    TodoListResponse,
    TodoResponse,
    TodoUpdate,
)

router = APIRouter()


@router.post(
    "",
    response_model=TodoResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new todo",
    responses={
        201: {"description": "Todo created successfully"},
        400: {"description": "Validation error"},
        401: {"description": "Not authenticated"},
    },
)
async def create_todo(
    data: TodoCreate,
    user_id: CurrentUserId,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> Todo:
    """
    Create a new todo item.

    - **title**: Required (1-200 characters)
    - **description**: Optional (max 2000 characters)
    - **priority**: low, medium (default), or high
    - **due_date**: Optional due date
    """
    todo = Todo(
        user_id=user_id,
        title=data.title,
        description=data.description,
        priority=data.priority,
        due_date=data.due_date,
    )

    session.add(todo)
    await session.commit()
    await session.refresh(todo)

    return todo


@router.get(
    "",
    response_model=TodoListResponse,
    summary="List todos",
    responses={
        200: {"description": "List of todos"},
        401: {"description": "Not authenticated"},
    },
)
async def list_todos(
    user_id: CurrentUserId,
    session: Annotated[AsyncSession, Depends(get_session)],
    page: Annotated[int, Query(ge=1, description="Page number")] = 1,
    per_page: Annotated[
        int, Query(ge=1, le=100, description="Items per page")
    ] = 20,
    status_filter: Annotated[
        TodoStatus | None,
        Query(alias="status", description="Filter by status"),
    ] = None,
    priority_filter: Annotated[
        TodoPriority | None,
        Query(alias="priority", description="Filter by priority"),
    ] = None,
    sort_by: Annotated[
        str,
        Query(
            description="Sort field",
            pattern="^(created_at|due_date|priority|title)$",
        ),
    ] = "created_at",
    sort_order: Annotated[
        str,
        Query(description="Sort order", pattern="^(asc|desc)$"),
    ] = "desc",
) -> TodoListResponse:
    """
    List todos for the authenticated user with filtering and pagination.

    - **page**: Page number (default 1)
    - **per_page**: Items per page (default 20, max 100)
    - **status**: Filter by status (pending, in_progress, completed)
    - **priority**: Filter by priority (low, medium, high)
    - **sort_by**: Sort field (created_at, due_date, priority, title)
    - **sort_order**: Sort direction (asc, desc)
    """
    # Base query - only user's todos
    query = select(Todo).where(Todo.user_id == user_id)

    # Apply filters
    if status_filter is not None:
        query = query.where(Todo.status == status_filter)
    if priority_filter is not None:
        query = query.where(Todo.priority == priority_filter)

    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await session.execute(count_query)
    total = total_result.scalar_one()

    # Apply sorting
    sort_column = getattr(Todo, sort_by)
    if sort_order == "desc":
        sort_column = sort_column.desc()
    else:
        sort_column = sort_column.asc()
    query = query.order_by(sort_column)

    # Apply pagination
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)

    # Execute query
    result = await session.execute(query)
    todos = result.scalars().all()

    return TodoListResponse(
        items=[TodoResponse.model_validate(t) for t in todos],
        total=total,
        page=page,
        per_page=per_page,
        pages=ceil(total / per_page) if total > 0 else 1,
    )


@router.get(
    "/{todo_id}",
    response_model=TodoResponse,
    summary="Get a todo",
    responses={
        200: {"description": "Todo details"},
        401: {"description": "Not authenticated"},
        404: {"description": "Todo not found"},
    },
)
async def get_todo(
    todo_id: UUID,
    user_id: CurrentUserId,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> Todo:
    """
    Get a single todo by ID.

    Returns 404 if the todo doesn't exist or belongs to another user.
    """
    result = await session.execute(
        select(Todo).where(Todo.id == todo_id, Todo.user_id == user_id)
    )
    todo = result.scalar_one_or_none()

    if todo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found",
        )

    return todo


@router.patch(
    "/{todo_id}",
    response_model=TodoResponse,
    summary="Update a todo",
    responses={
        200: {"description": "Todo updated successfully"},
        400: {"description": "Validation error"},
        401: {"description": "Not authenticated"},
        404: {"description": "Todo not found"},
    },
)
async def update_todo(
    todo_id: UUID,
    data: TodoUpdate,
    user_id: CurrentUserId,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> Todo:
    """
    Update a todo (partial update).

    Only the fields provided will be updated.
    Returns 404 if the todo doesn't exist or belongs to another user.
    """
    result = await session.execute(
        select(Todo).where(Todo.id == todo_id, Todo.user_id == user_id)
    )
    todo = result.scalar_one_or_none()

    if todo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found",
        )

    # Update only provided fields
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(todo, field, value)

    # If status changed to completed, set completed_at
    if data.status == TodoStatus.COMPLETED and todo.completed_at is None:
        todo.completed_at = datetime.utcnow()
    # If status changed from completed, clear completed_at
    elif data.status is not None and data.status != TodoStatus.COMPLETED:
        todo.completed_at = None

    todo.updated_at = datetime.utcnow()

    await session.commit()
    await session.refresh(todo)

    return todo


@router.delete(
    "/{todo_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a todo",
    responses={
        204: {"description": "Todo deleted successfully"},
        401: {"description": "Not authenticated"},
        404: {"description": "Todo not found"},
    },
)
async def delete_todo(
    todo_id: UUID,
    user_id: CurrentUserId,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> None:
    """
    Delete a todo.

    Returns 404 if the todo doesn't exist or belongs to another user.
    """
    result = await session.execute(
        select(Todo).where(Todo.id == todo_id, Todo.user_id == user_id)
    )
    todo = result.scalar_one_or_none()

    if todo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found",
        )

    await session.delete(todo)
    await session.commit()


@router.post(
    "/{todo_id}/complete",
    response_model=TodoResponse,
    summary="Mark todo as complete",
    responses={
        200: {"description": "Todo marked as complete"},
        401: {"description": "Not authenticated"},
        404: {"description": "Todo not found"},
    },
)
async def complete_todo(
    todo_id: UUID,
    user_id: CurrentUserId,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> Todo:
    """
    Mark a todo as complete (convenience endpoint).

    Sets status to 'completed' and records the completion timestamp.
    """
    result = await session.execute(
        select(Todo).where(Todo.id == todo_id, Todo.user_id == user_id)
    )
    todo = result.scalar_one_or_none()

    if todo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found",
        )

    todo.status = TodoStatus.COMPLETED
    todo.completed_at = datetime.utcnow()
    todo.updated_at = datetime.utcnow()

    await session.commit()
    await session.refresh(todo)

    return todo
