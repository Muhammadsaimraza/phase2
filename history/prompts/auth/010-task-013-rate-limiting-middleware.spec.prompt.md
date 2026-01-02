---
id: 010
title: TASK-013 Rate Limiting Middleware
stage: spec
date: 2026-01-01
surface: agent
model: claude-opus-4-5
feature: auth
branch: master
user: user
command: sp.implement
labels: ["implementation", "auth", "backend", "security", "rate-limiting", "task-013"]
links:
  spec: specs/features/auth.md
  ticket: TASK-013
  adr: null
  pr: null
files:
  - apps/api/app/middleware/ratelimit.py (created)
  - apps/api/app/middleware/__init__.py (modified)
  - apps/api/app/main.py (modified)
  - apps/api/app/routes/v1/auth.py (modified)
  - apps/api/tests/test_ratelimit.py (created)
  - apps/api/tests/conftest.py (modified)
  - apps/api/pyproject.toml (modified)
  - TASKS.md (modified)
tests:
  - apps/api/tests/test_ratelimit.py (8 tests - all passing)
---

## Prompt

continue with TASK-013

## Response snapshot

Completed TASK-013: Add Rate Limiting Middleware using slowapi

**Rate Limiting Module** (`middleware/ratelimit.py`):
- IP-based rate limiting with X-Forwarded-For support
- Custom 429 response handler (RFC 7807 format)
- Configurable limits from settings:
  - Login: 5 attempts per 15 minutes
  - Register: 10 per hour
  - General: 100 per minute

**Main.py Updates**:
- Integrated slowapi limiter with app state
- Added RateLimitExceeded exception handler

**Auth Routes Updates**:
- Added `@limiter.limit()` decorator to login endpoint
- Added `@limiter.limit()` decorator to register endpoint
- Added `request: Request` parameter for IP extraction

**Test Suite** (`tests/test_ratelimit.py` - 8 tests):
1. TestLoginRateLimit:
   - test_login_under_rate_limit
   - test_login_exceeds_rate_limit
   - test_rate_limit_response_format
   - test_rate_limit_retry_after_header

2. TestRegisterRateLimit:
   - test_register_under_rate_limit
   - test_register_multiple_attempts

3. TestRateLimitHeaders:
   - test_rate_limit_header_present

4. TestRateLimitByIP:
   - test_different_endpoints_separate_limits

**Conftest Updates**:
- Added `limiter.reset()` to clear rate limit state between tests

## Outcome

- Impact: Auth endpoints protected against brute force attacks
- Tests: 30 total tests passing (22 auth + 8 rate limit)
- Files: 8 files created/modified
- Next prompts: TASK-014 (Design Tokens), TASK-015 (Animation System)
- Reflection: Resetting rate limiter between tests is crucial for test isolation

## Evaluation notes (flywheel)

- Failure modes observed: Rate limiter state persisted across tests (fixed with limiter.reset())
- Graders run and results (PASS/FAIL): 30/30 PASS
- Prompt variant (if applicable): Standard implementation
- Next experiment: Add per-user rate limiting in addition to IP-based
