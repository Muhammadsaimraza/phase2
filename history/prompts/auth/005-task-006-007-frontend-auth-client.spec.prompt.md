---
id: 005
title: TASK-006/007 Frontend Auth Client
stage: spec
date: 2026-01-01
surface: agent
model: claude-opus-4-5
feature: auth
branch: master
user: user
command: sp.implement
labels: ["implementation", "auth", "frontend", "client", "task-006", "task-007"]
links:
  spec: specs/features/auth.md
  ticket: TASK-006, TASK-007
  adr: null
  pr: null
files:
  - apps/web/src/lib/api-client.ts (created)
  - apps/web/src/lib/auth.ts (created)
  - apps/web/src/lib/index.ts (created)
  - apps/web/.env.local (created)
  - TASKS.md (modified)
tests:
  - none (client utilities)
---

## Prompt

continue with TASK-007

## Response snapshot

Completed TASK-006 (JWT Middleware - already done in TASK-004) and TASK-007 (Frontend Auth Client):

**API Client** (`src/lib/api-client.ts`):
- Typed fetch wrapper with error handling
- Automatic Authorization header injection
- ApiError class for typed error handling
- Methods: get, post, put, patch, delete

**Auth Client** (`src/lib/auth.ts`):
- Token storage utilities (localStorage)
  - getAccessToken, getRefreshToken, setTokens, clearTokens
  - isTokenExpired (with 1-minute buffer)
- Auth API methods:
  - register(data) → User
  - login(data) → TokenResponse (stores tokens)
  - refresh() → TokenResponse (token rotation)
  - logout() → void (clears tokens)
  - getMe() → User
- Helper methods:
  - isAuthenticated(): boolean
  - ensureValidToken(): Promise<boolean>
- Event system: onAuthEvent, emitAuthEvent

**Environment Configuration**:
- `.env.local` with NEXT_PUBLIC_API_URL

**Lib Index** (`src/lib/index.ts`):
- Exports all utilities (cn, animations, api, auth)

## Outcome

- Impact: Frontend ready for AuthContext (unblocks TASK-008)
- Tests: None (client utilities)
- Files: 4 files created
- Next prompts: TASK-008 (AuthContext Provider)
- Reflection: Token refresh with 1-min buffer prevents edge cases; event system enables reactive UI

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): Standard implementation
- Next experiment: Build AuthContext and test full auth flow
