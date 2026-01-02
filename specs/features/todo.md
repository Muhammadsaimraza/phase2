# Spec: Todo CRUD

## Meta
- **ID**: SPEC-002
- **Status**: Draft
- **Owner**: TBD
- **Depends On**: SPEC-001 (Authentication)

## 1. Overview
**Purpose**: Implement full CRUD operations for Todo items with user isolation, allowing authenticated users to manage their personal task list.

**User Story**: As an authenticated user, I want to create, read, update, and delete my todo items, so that I can manage my tasks effectively.

**Success**: 99%+ of CRUD operations complete in <200ms; 100% user isolation (users can only access their own todos)

## 2. Requirements

### Functional
- **FR-1**: Users MUST be able to create a new todo
  - Priority: High
  - [ ] Title required (1-200 characters)
  - [ ] Description optional (max 2000 characters)
  - [ ] Due date optional
  - [ ] Priority optional (low, medium, high) - defaults to medium
  - [ ] Status defaults to "pending"

- **FR-2**: Users MUST be able to list their todos
  - Priority: High
  - [ ] Paginated results (default 20 per page)
  - [ ] Filter by status (pending, in_progress, completed)
  - [ ] Filter by priority (low, medium, high)
  - [ ] Sort by created_at, due_date, priority
  - [ ] Only user's own todos returned

- **FR-3**: Users MUST be able to view a single todo
  - Priority: High
  - [ ] Return 404 if not found or not owned by user
  - [ ] Include all todo fields

- **FR-4**: Users MUST be able to update a todo
  - Priority: High
  - [ ] Update title, description, due_date, priority, status
  - [ ] Partial updates supported (PATCH semantics)
  - [ ] Return 404 if not found or not owned by user

- **FR-5**: Users MUST be able to delete a todo
  - Priority: High
  - [ ] Soft delete (mark as deleted) or hard delete
  - [ ] Return 404 if not found or not owned by user

- **FR-6**: Users MUST be able to mark a todo as complete
  - Priority: Medium
  - [ ] Quick action to toggle completion status
  - [ ] Set completed_at timestamp

### Non-Functional
- Performance: All CRUD operations < 200ms p95
- Security: User isolation enforced at database level (user_id filter)
- Availability: 99.9% uptime
- Data integrity: No orphaned todos (cascade delete with user)

### Business Rules
- **BR-1**: User isolation - all todo queries MUST filter by authenticated user_id
- **BR-2**: Todos cannot exist without an owner (user_id required)
- **BR-3**: Completed todos retain their data (no auto-delete)
- **BR-4**: Due date must be in the future when creating (optional validation)

## 3. Design

### Architecture
```
User -> Next.js (Frontend) -> API Client -> FastAPI -> JWT Validation -> Todo Routes -> Neon PostgreSQL
                                                              |
                                                         user_id filter
                                                              |
                                                         Todo Table (RLS)
```

### Data Models
```python
# Database - apps/api/app/models/todo.py
from sqlmodel import SQLModel, Field
from datetime import datetime
from enum import Enum
from uuid import UUID, uuid4

class TodoStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class TodoPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class Todo(SQLModel, table=True):
    __tablename__ = "todos"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=200)
    description: str | None = Field(default=None, max_length=2000)
    status: TodoStatus = Field(default=TodoStatus.PENDING)
    priority: TodoPriority = Field(default=TodoPriority.MEDIUM)
    due_date: datetime | None = Field(default=None)
    completed_at: datetime | None = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# API Schemas - apps/api/app/schemas/todo.py
from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID

class TodoCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str | None = Field(None, max_length=2000)
    priority: TodoPriority = TodoPriority.MEDIUM
    due_date: datetime | None = None

class TodoUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=200)
    description: str | None = Field(None, max_length=2000)
    status: TodoStatus | None = None
    priority: TodoPriority | None = None
    due_date: datetime | None = None

class TodoResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    description: str | None
    status: TodoStatus
    priority: TodoPriority
    due_date: datetime | None
    completed_at: datetime | None
    created_at: datetime
    updated_at: datetime

class TodoListResponse(BaseModel):
    items: list[TodoResponse]
    total: int
    page: int
    per_page: int
    pages: int
```

### API
```yaml
# All endpoints require JWT authentication
# Base path: /api/v1/todos

POST /api/v1/todos
  Auth: JWT Bearer
  Description: Create a new todo
  Request: {"title": "Buy groceries", "description": "Milk, eggs, bread", "priority": "high", "due_date": "2024-01-15T10:00:00Z"}
  Response (201): {"id": "uuid", "user_id": "uuid", "title": "Buy groceries", ...}
  Errors:
    - 400: Validation error (title too long, invalid priority, etc.)
    - 401: Not authenticated

GET /api/v1/todos
  Auth: JWT Bearer
  Description: List user's todos with filtering and pagination
  Query Params:
    - page (int, default=1)
    - per_page (int, default=20, max=100)
    - status (string, optional): pending|in_progress|completed
    - priority (string, optional): low|medium|high
    - sort_by (string, default=created_at): created_at|due_date|priority
    - sort_order (string, default=desc): asc|desc
  Response (200): {"items": [...], "total": 50, "page": 1, "per_page": 20, "pages": 3}
  Errors:
    - 401: Not authenticated

GET /api/v1/todos/{todo_id}
  Auth: JWT Bearer
  Description: Get a single todo by ID
  Response (200): {"id": "uuid", "title": "...", ...}
  Errors:
    - 401: Not authenticated
    - 404: Todo not found or not owned by user

PATCH /api/v1/todos/{todo_id}
  Auth: JWT Bearer
  Description: Update a todo (partial update)
  Request: {"title": "Updated title", "status": "completed"}
  Response (200): {"id": "uuid", "title": "Updated title", ...}
  Errors:
    - 400: Validation error
    - 401: Not authenticated
    - 404: Todo not found or not owned by user

DELETE /api/v1/todos/{todo_id}
  Auth: JWT Bearer
  Description: Delete a todo
  Response (204): No content
  Errors:
    - 401: Not authenticated
    - 404: Todo not found or not owned by user

POST /api/v1/todos/{todo_id}/complete
  Auth: JWT Bearer
  Description: Mark a todo as complete (convenience endpoint)
  Response (200): {"id": "uuid", "status": "completed", "completed_at": "...", ...}
  Errors:
    - 401: Not authenticated
    - 404: Todo not found or not owned by user
```

### Frontend
```typescript
// Todo Types - packages/shared/src/types/todo.ts
interface Todo {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Todo API Client - apps/web/src/lib/todo-client.ts
interface TodoClient {
  list(params?: TodoListParams): Promise<TodoListResponse>;
  get(id: string): Promise<Todo>;
  create(data: TodoCreate): Promise<Todo>;
  update(id: string, data: TodoUpdate): Promise<Todo>;
  delete(id: string): Promise<void>;
  complete(id: string): Promise<Todo>;
}

// Components - apps/web/src/components/todo/
- TodoList.tsx       // List of todos with filtering
- TodoItem.tsx       // Single todo card/row
- TodoForm.tsx       // Create/Edit form
- TodoFilters.tsx    // Status/priority filters
- TodoEmptyState.tsx // Empty state display

// Pages - apps/web/src/app/
- /dashboard         // Main todo list view
- /todos/new         // Create new todo
- /todos/[id]        // View/edit single todo
```

## 4. Security
- JWT Bearer token required on all endpoints
- User ID extracted from validated JWT only
- All queries include user_id filter (defense in depth)
- Row-level security (RLS) on todos table
- Input validation on all fields
- SQL injection prevention via parameterized queries (SQLModel)

## 5. Testing
```python
# Backend Tests - apps/api/tests/test_todo.py

def test_create_todo_success():
    response = auth_client.post("/api/v1/todos", json={
        "title": "Test todo",
        "priority": "high"
    })
    assert response.status_code == 201
    assert response.json()["title"] == "Test todo"
    assert response.json()["user_id"] == current_user_id

def test_create_todo_unauthorized():
    response = client.post("/api/v1/todos", json={"title": "Test"})
    assert response.status_code == 401

def test_list_todos_only_own():
    # Create todos for user A
    # Create todos for user B
    # User A should only see their todos
    response = user_a_client.get("/api/v1/todos")
    assert all(t["user_id"] == user_a_id for t in response.json()["items"])

def test_get_todo_not_found():
    response = auth_client.get("/api/v1/todos/nonexistent-uuid")
    assert response.status_code == 404

def test_get_todo_other_user():
    # Try to access user B's todo as user A
    response = user_a_client.get(f"/api/v1/todos/{user_b_todo_id}")
    assert response.status_code == 404  # Not 403, to prevent enumeration

def test_update_todo_success():
    response = auth_client.patch(f"/api/v1/todos/{todo_id}", json={
        "title": "Updated",
        "status": "completed"
    })
    assert response.status_code == 200
    assert response.json()["title"] == "Updated"
    assert response.json()["status"] == "completed"

def test_delete_todo_success():
    response = auth_client.delete(f"/api/v1/todos/{todo_id}")
    assert response.status_code == 204
    # Verify deleted
    response = auth_client.get(f"/api/v1/todos/{todo_id}")
    assert response.status_code == 404

def test_complete_todo():
    response = auth_client.post(f"/api/v1/todos/{todo_id}/complete")
    assert response.status_code == 200
    assert response.json()["status"] == "completed"
    assert response.json()["completed_at"] is not None
```

**Coverage**:
- [ ] Unit tests (80%+)
- [ ] Integration tests (CRUD flow end-to-end)
- [ ] User isolation tests

## 6. Implementation

**Backend**:
- [ ] Create Todo model (apps/api/app/models/todo.py)
- [ ] Create Alembic migration for todos table
- [ ] Create Todo schemas (apps/api/app/schemas/todo.py)
- [ ] Implement POST /todos endpoint
- [ ] Implement GET /todos (list) endpoint
- [ ] Implement GET /todos/{id} endpoint
- [ ] Implement PATCH /todos/{id} endpoint
- [ ] Implement DELETE /todos/{id} endpoint
- [ ] Implement POST /todos/{id}/complete endpoint
- [ ] Write unit tests
- [ ] Write integration tests

**Frontend**:
- [ ] Add Todo types to shared package
- [ ] Create Todo API client
- [ ] Create TodoList component
- [ ] Create TodoItem component
- [ ] Create TodoForm component
- [ ] Create TodoFilters component
- [ ] Create dashboard page
- [ ] Create new todo page
- [ ] Create todo detail/edit page
- [ ] Write component tests

**Files**:
```
New:
  apps/api/app/models/todo.py
  apps/api/app/schemas/todo.py
  apps/api/app/routes/v1/todos.py
  apps/api/alembic/versions/002_create_todos.py
  apps/api/tests/test_todo.py
  packages/shared/src/types/todo.ts
  apps/web/src/lib/todo-client.ts
  apps/web/src/components/todo/TodoList.tsx
  apps/web/src/components/todo/TodoItem.tsx
  apps/web/src/components/todo/TodoForm.tsx
  apps/web/src/components/todo/TodoFilters.tsx
  apps/web/src/components/todo/TodoEmptyState.tsx
  apps/web/src/components/todo/index.ts
  apps/web/src/app/dashboard/page.tsx
  apps/web/src/app/todos/new/page.tsx
  apps/web/src/app/todos/[id]/page.tsx
Modified:
  apps/api/app/models/__init__.py
  apps/api/app/schemas/__init__.py
  apps/api/app/routes/v1/__init__.py
  packages/shared/src/types/index.ts (if exists)
```

## 7. Errors

| Code | Type | Message | Action |
|------|------|---------|--------|
| 400 | validation_error | "Title is required" | Show form error |
| 400 | validation_error | "Title too long (max 200 chars)" | Show form error |
| 401 | authentication_error | "Not authenticated" | Redirect to login |
| 404 | not_found | "Todo not found" | Show not found page |
| 500 | server_error | "Internal server error" | Show error toast |

## 8. Migration
```sql
-- Migration: 002_create_todos.sql

-- Up
CREATE TABLE todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    priority VARCHAR(10) NOT NULL DEFAULT 'medium',
    due_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT todos_status_check CHECK (status IN ('pending', 'in_progress', 'completed')),
    CONSTRAINT todos_priority_check CHECK (priority IN ('low', 'medium', 'high'))
);

CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_status ON todos(status);
CREATE INDEX idx_todos_priority ON todos(priority);
CREATE INDEX idx_todos_due_date ON todos(due_date);
CREATE INDEX idx_todos_created_at ON todos(created_at);

-- Enable Row Level Security
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Down
DROP TABLE IF EXISTS todos;
```

## 9. Acceptance

- [ ] All FRs implemented and verified
- [ ] 80%+ test coverage on todo module
- [ ] All CRUD operations < 200ms p95
- [ ] User isolation enforced (users can only see their own todos)
- [ ] Protected routes require valid JWT
- [ ] Input validation working
- [ ] Error handling follows RFC 7807
- [ ] Frontend components render correctly
- [ ] Create/edit forms work properly

## 10. Questions

- [x] Q1: Should todos have categories/tags? - Deferred to v2
- [x] Q2: Should we support recurring todos? - Deferred to v2
- [x] Q3: Soft delete or hard delete? - Hard delete for v1
- [x] Q4: Should completed todos auto-archive? - No, keep visible with filter

---

**Changelog**
| Date | Ver | Change |
|------|-----|--------|
| 2025-01-02 | 0.1 | Initial draft |
