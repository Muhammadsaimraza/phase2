---
id: 003
title: TASK-004 JWT Auth Configuration
stage: spec
date: 2026-01-01
surface: agent
model: claude-opus-4-5
feature: auth
branch: master
user: user
command: sp.implement
labels: ["implementation", "auth", "jwt", "security", "task-004"]
links:
  spec: specs/features/auth.md
  ticket: TASK-004
  adr: null
  pr: null
files:
  - apps/api/app/core/security.py (created)
  - apps/api/app/schemas/auth.py (created)
  - apps/api/app/schemas/__init__.py (modified)
  - apps/api/app/middleware/auth.py (created)
  - apps/api/app/middleware/__init__.py (modified)
  - apps/api/app/core/__init__.py (modified)
  - apps/api/.env (modified)
  - TASKS.md (modified)
tests:
  - none (utilities, requires endpoint tests)
---

## Prompt

continue with TASK-004

## Response snapshot

Completed TASK-004: Configure Better Auth Server (JWT Authentication)

**Security Module** (`app/core/security.py`):
- Password hashing with bcrypt (via passlib)
- JWT token creation (access + refresh)
- Token verification and decoding
- Token type validation (access vs refresh)
- Token expiry extraction

**Auth Schemas** (`app/schemas/auth.py`):
- UserRegister: email + password with validation
  - Password: min 8 chars, 1 uppercase, 1 number
- UserLogin: email + password
- TokenResponse: access_token, refresh_token, expires_in
- RefreshTokenRequest: refresh_token
- UserResponse: id, email, created_at
- ErrorDetail: RFC 7807 Problem Details

**Auth Middleware** (`app/middleware/auth.py`):
- HTTPBearer security scheme
- get_current_user_id: Extract user ID from JWT
- get_current_user: Fetch full user from database
- Type aliases: CurrentUserId, CurrentUser

**Configuration**:
- JWT_SECRET: 256-bit hex secret
- ACCESS_TOKEN_EXPIRE_MINUTES: 1440 (24h)
- REFRESH_TOKEN_EXPIRE_DAYS: 7
- Algorithm: HS256

## Outcome

- Impact: Auth infrastructure ready for endpoints (unblocks TASK-005)
- Tests: No tests yet (utilities only)
- Files: 7 files created/modified
- Next prompts: TASK-005 (Implement Auth API Endpoints)
- Reflection: Clean separation between security utils and FastAPI dependencies

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): Standard implementation
- Next experiment: Implement auth endpoints to test the full flow
