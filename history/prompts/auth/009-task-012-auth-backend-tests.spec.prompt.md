---
id: 009
title: TASK-012 Auth Backend Tests
stage: spec
date: 2026-01-01
surface: agent
model: claude-opus-4-5
feature: auth
branch: master
user: user
command: sp.implement
labels: ["implementation", "auth", "backend", "testing", "pytest", "task-012"]
links:
  spec: specs/features/auth.md
  ticket: TASK-012
  adr: null
  pr: null
files:
  - apps/api/tests/test_auth.py (created)
  - apps/api/tests/conftest.py (modified)
  - apps/api/app/core/security.py (modified - jti for unique tokens)
  - apps/api/app/core/config.py (modified - extra=ignore for env vars)
  - TASKS.md (modified)
tests:
  - apps/api/tests/test_auth.py (22 tests - all passing)
---

## Prompt

continue with TASK-012

## Response snapshot

Completed TASK-012: Write Auth Backend Tests with 22 comprehensive tests

**Test Classes Created** (`tests/test_auth.py`):

1. **TestRegistration** (6 tests):
   - test_register_success
   - test_register_duplicate_email
   - test_register_weak_password_no_uppercase
   - test_register_weak_password_no_number
   - test_register_password_too_short
   - test_register_invalid_email

2. **TestLogin** (4 tests):
   - test_login_success
   - test_login_invalid_email
   - test_login_wrong_password
   - test_login_case_sensitive_email

3. **TestProtectedRoutes** (4 tests):
   - test_get_me_without_token
   - test_get_me_with_valid_token
   - test_get_me_with_invalid_token
   - test_get_me_with_malformed_header

4. **TestTokenRefresh** (3 tests):
   - test_refresh_token_success
   - test_refresh_token_invalid
   - test_refresh_token_reuse_after_rotation

5. **TestLogout** (3 tests):
   - test_logout_success
   - test_logout_without_token
   - test_logout_invalidates_refresh_tokens

6. **TestAuthIntegration** (2 tests):
   - test_full_auth_flow (complete register → login → access → refresh → logout)
   - test_multiple_sessions

**Fixtures Created** (`tests/conftest.py`):
- setup_database: Creates/drops tables per test
- client: TestClient with session override
- test_user_data: Standard user credentials
- registered_user: Pre-registered user
- auth_tokens: Login tokens for authenticated tests
- auth_headers: Bearer token headers

**Bug Fixes During Implementation**:
1. Replaced passlib with direct bcrypt (compatibility issue)
2. Added `extra="ignore"` to Settings Config (env var validation)
3. Added `jti` (JWT ID) to tokens for uniqueness (same-second token collision)

## Outcome

- Impact: Auth backend fully tested with 22 passing tests
- Tests: 22 tests - all passing in 9.41s
- Files: 5 files created/modified
- Next prompts: TASK-013 (Rate Limiting), TASK-014 (Design Tokens)
- Reflection: Adding jti to JWTs ensures unique tokens even when created rapidly

## Evaluation notes (flywheel)

- Failure modes observed: Token collision when created in same second (fixed with jti)
- Graders run and results (PASS/FAIL): 22/22 PASS
- Prompt variant (if applicable): Standard implementation with debugging
- Next experiment: Run full E2E test including frontend integration
