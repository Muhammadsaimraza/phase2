---
id: 002
title: TASK-003 User Session Models
stage: spec
date: 2026-01-01
surface: agent
model: claude-opus-4-5
feature: auth
branch: master
user: user
command: sp.implement
labels: ["implementation", "models", "database", "auth", "task-003"]
links:
  spec: specs/features/auth.md
  ticket: TASK-003
  adr: null
  pr: null
files:
  - apps/api/app/models/user.py (created)
  - apps/api/app/models/session.py (created)
  - apps/api/app/models/__init__.py (modified)
  - apps/api/alembic/env.py (modified)
  - apps/api/alembic/versions/001_create_users_sessions.py (created)
  - packages/shared/src/index.ts (modified)
  - TASKS.md (modified)
tests:
  - none (models only, no logic to test)
---

## Prompt

continue with TASK-003

## Response snapshot

Completed TASK-003: Create User Model + Migration

**User Model** (`apps/api/app/models/user.py`):
- UUID primary key (better for distributed systems)
- email: unique, indexed
- password_hash: bcrypt hash storage
- created_at/updated_at: timestamps
- Relationship to sessions

**Session Model** (`apps/api/app/models/session.py`):
- UUID primary key
- user_id: foreign key to users (CASCADE delete)
- refresh_token: unique, indexed
- expires_at: expiration timestamp
- revoked_at: nullable (for token revocation)
- Helper properties: is_expired, is_revoked, is_valid

**Alembic Migration** (`001_create_users_sessions.py`):
- Creates users and sessions tables
- Indexes on email, refresh_token, user_id
- Row Level Security (RLS) enabled on both tables
- RLS policies for user isolation
- Helper function `set_current_user_id(uuid)`

**Shared Types Updated**:
- Changed User.id and Task.id/userId from number to string (UUID)

## Outcome

- Impact: Database models ready for auth implementation (unblocks TASK-004)
- Tests: No tests needed (pure model definitions)
- Files: 6 files created/modified
- Next prompts: TASK-004 (Configure Better Auth Server)
- Reflection: UUIDs provide better security than auto-increment IDs; RLS in migration ensures consistent setup

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A (run migration to verify)
- Prompt variant (if applicable): Standard implementation
- Next experiment: Run `alembic upgrade head` to apply migration
