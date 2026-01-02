# Spec: Authentication (Better Auth)

## Meta
- **ID**: SPEC-001
- **Status**: Draft
- **Owner**: TBD

## 1. Overview
**Purpose**: Implement secure user authentication using Better Auth with JWT tokens for the Todo application.

**User Story**: As a user, I want to securely sign in with email and password, so that my tasks are protected and only accessible to me.

**Success**: 95%+ of login attempts complete in <500ms; 0 unauthorized data access incidents

## 2. Requirements

### Functional
- **FR-1**: Users MUST be able to register with email and password
  - Priority: High
  - [ ] Email format validation (RFC 5322)
  - [ ] Password minimum 8 characters, 1 uppercase, 1 number
  - [ ] Duplicate email prevention

- **FR-2**: Users MUST be able to login with credentials
  - Priority: High
  - [ ] Email/password authentication
  - [ ] JWT access token issued (24h lifetime)
  - [ ] JWT refresh token issued (7d lifetime)

- **FR-3**: Users MUST be able to logout
  - Priority: High
  - [ ] Clear tokens client-side
  - [ ] Optional: Server-side token invalidation

- **FR-4**: System MUST protect all authenticated routes
  - Priority: High
  - [ ] JWT validation middleware on FastAPI
  - [ ] 401 response for missing/invalid tokens
  - [ ] User ID extracted from JWT for data isolation

- **FR-5**: Users MUST be able to refresh expired access tokens
  - Priority: Medium
  - [ ] Refresh token endpoint
  - [ ] New access token issued
  - [ ] Old refresh token rotated (optional)

### Non-Functional
- Performance: Login API < 500ms p95
- Security: HS256 JWT signing, secrets from env vars only
- Availability: Auth service 99.9% uptime

### Business Rules
- **BR-1**: User isolation - all queries MUST filter by authenticated user_id
- **BR-2**: Rate limiting - max 5 failed login attempts per 15 minutes per IP
- **BR-3**: Session management - refresh tokens invalidated on password change

## 3. Design

### Architecture
```
User -> Next.js (Frontend) -> Better Auth Client -> FastAPI -> Better Auth Server -> Neon PostgreSQL
                                                         |
                                                    JWT Validation
                                                         |
                                                   Protected Routes
```

### Data Models
```python
# Database - apps/api/models/user.py
from sqlmodel import SQLModel, Field
from datetime import datetime

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Session(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    token: str = Field(unique=True, index=True)
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)

# API Schemas - apps/api/schemas/auth.py
from pydantic import BaseModel, EmailStr

class UserRegister(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 86400  # 24h

class UserResponse(BaseModel):
    id: int
    email: str
    created_at: datetime
```

### API
```yaml
# Public Endpoints (no auth required)
POST /api/v1/auth/register
  Description: Create new user account
  Request: {"email": "user@example.com", "password": "SecurePass1"}
  Response (201): {"id": 1, "email": "user@example.com", "created_at": "..."}
  Errors:
    - 400: Invalid email format or weak password
    - 409: Email already registered

POST /api/v1/auth/login
  Description: Authenticate user and issue tokens
  Request: {"email": "user@example.com", "password": "SecurePass1"}
  Response (200): {"access_token": "...", "refresh_token": "...", "token_type": "bearer", "expires_in": 86400}
  Errors:
    - 401: Invalid credentials
    - 429: Too many login attempts

POST /api/v1/auth/refresh
  Description: Refresh access token
  Request: {"refresh_token": "..."}
  Response (200): {"access_token": "...", "refresh_token": "...", "token_type": "bearer", "expires_in": 86400}
  Errors:
    - 401: Invalid or expired refresh token

# Protected Endpoints (auth required)
POST /api/v1/auth/logout
  Auth: JWT Bearer
  Description: Invalidate current session
  Response (200): {"message": "Logged out successfully"}
  Errors:
    - 401: Not authenticated

GET /api/v1/auth/me
  Auth: JWT Bearer
  Description: Get current user profile
  Response (200): {"id": 1, "email": "user@example.com", "created_at": "..."}
  Errors:
    - 401: Not authenticated
```

### Frontend
```typescript
// Better Auth Client Configuration - apps/web/lib/auth.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Auth Context - apps/web/contexts/AuthContext.tsx
interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Login Form Component - apps/web/components/auth/LoginForm.tsx
interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

// Register Form Component - apps/web/components/auth/RegisterForm.tsx
interface RegisterFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}
```

## 4. Security
- JWT Bearer token in Authorization header
- HS256 signing with 256-bit secret from environment
- Password hashing with bcrypt (cost factor 12)
- User ID extracted from validated JWT only (never from request body)
- CORS restricted to allowed origins
- Rate limit: 5 login attempts per 15 min per IP
- HTTPS only in production
- Secure, HttpOnly cookies for refresh tokens (optional)

## 5. Testing
```python
# Backend Unit Tests - apps/api/tests/unit/test_auth.py
def test_register_success():
    response = client.post("/api/v1/auth/register", json={
        "email": "test@example.com",
        "password": "SecurePass1"
    })
    assert response.status_code == 201
    assert "id" in response.json()

def test_register_duplicate_email():
    # First registration
    client.post("/api/v1/auth/register", json={
        "email": "dupe@example.com",
        "password": "SecurePass1"
    })
    # Duplicate attempt
    response = client.post("/api/v1/auth/register", json={
        "email": "dupe@example.com",
        "password": "SecurePass1"
    })
    assert response.status_code == 409

def test_login_success():
    response = client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "SecurePass1"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_invalid_credentials():
    response = client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401

def test_protected_route_without_token():
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401

def test_protected_route_with_valid_token():
    # Login first
    login_response = client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "SecurePass1"
    })
    token = login_response.json()["access_token"]

    response = client.get("/api/v1/auth/me", headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 200
```

```typescript
// Frontend Tests - apps/web/__tests__/components/auth/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/auth/LoginForm';

test('renders login form', () => {
  render(<LoginForm />);
  expect(screen.getByLabelText('Email')).toBeInTheDocument();
  expect(screen.getByLabelText('Password')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});

test('shows validation errors for empty fields', async () => {
  render(<LoginForm />);
  fireEvent.click(screen.getByRole('button', { name: /login/i }));
  await waitFor(() => {
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });
});

test('calls onSuccess after successful login', async () => {
  const onSuccess = jest.fn();
  render(<LoginForm onSuccess={onSuccess} />);

  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'test@example.com' }
  });
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: 'SecurePass1' }
  });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(onSuccess).toHaveBeenCalled();
  });
});
```

**Coverage**:
- [ ] Unit tests (80%+)
- [ ] Integration tests (auth flow end-to-end)
- [ ] E2E tests (login/register user journeys)

## 6. Implementation

**Backend**:
- [ ] Set up Better Auth on FastAPI
- [ ] Create User and Session SQLModel models
- [ ] Create database migration with Alembic
- [ ] Implement /auth/register endpoint
- [ ] Implement /auth/login endpoint
- [ ] Implement /auth/refresh endpoint
- [ ] Implement /auth/logout endpoint
- [ ] Implement /auth/me endpoint
- [ ] Create JWT validation middleware
- [ ] Add rate limiting middleware
- [ ] Write unit tests
- [ ] Write integration tests

**Frontend**:
- [ ] Configure Better Auth client
- [ ] Create AuthContext provider
- [ ] Build LoginForm component
- [ ] Build RegisterForm component
- [ ] Create protected route wrapper
- [ ] Implement token refresh logic
- [ ] Add auth state persistence
- [ ] Write component tests
- [ ] Write E2E tests

**Files**:
```
New:
  apps/api/models/user.py
  apps/api/schemas/auth.py
  apps/api/routes/v1/auth.py
  apps/api/middleware/auth.py
  apps/api/middleware/rate_limit.py
  apps/api/tests/unit/test_auth.py
  apps/api/tests/integration/test_auth_flow.py
  apps/web/lib/auth.ts
  apps/web/contexts/AuthContext.tsx
  apps/web/components/auth/LoginForm.tsx
  apps/web/components/auth/RegisterForm.tsx
  apps/web/components/auth/ProtectedRoute.tsx
  apps/web/__tests__/components/auth/LoginForm.test.tsx
  apps/web/__tests__/components/auth/RegisterForm.test.tsx
Modified:
  apps/api/main.py (add auth routes)
  apps/api/database.py (add User, Session models)
```

## 7. Errors

| Code | Type | Message | Action |
|------|------|---------|--------|
| 400 | validation_error | "Invalid email format" | Show form error |
| 400 | validation_error | "Password too weak" | Show requirements |
| 401 | authentication_error | "Invalid credentials" | Show error message |
| 401 | authentication_error | "Token expired" | Trigger refresh |
| 401 | authentication_error | "Invalid token" | Redirect to login |
| 409 | conflict | "Email already registered" | Suggest login |
| 429 | rate_limit | "Too many attempts" | Show cooldown timer |

## 8. Migration
```sql
-- Migration: 001_create_users_sessions.sql

-- Up
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(512) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Down
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;
```

## 9. Acceptance

- [ ] All FRs implemented and verified
- [ ] 80%+ test coverage on auth module
- [ ] Login/register API < 500ms p95
- [ ] Security review completed
- [ ] No secrets in codebase
- [ ] Rate limiting functional
- [ ] Protected routes require valid JWT
- [ ] User isolation enforced
- [ ] Documentation updated

## 10. Questions

- [ ] Q1: Should we implement "Remember Me" functionality? - Owner: TBD
- [ ] Q2: Do we need email verification for registration? - Owner: TBD
- [ ] Q3: Should we support social login (OAuth) in v1? - Owner: TBD
- [ ] Q4: What is the password reset flow? - Owner: TBD

---

**Changelog**
| Date | Ver | Change |
|------|-----|--------|
| 2025-12-31 | 0.1 | Initial draft |
