---
id: 005
title: TASK-002 Neon PostgreSQL Setup
stage: general
date: 2026-01-01
surface: agent
model: claude-opus-4-5
feature: none
branch: master
user: user
command: sp.implement
labels: ["implementation", "database", "infrastructure", "neon", "task-002"]
links:
  spec: null
  ticket: TASK-002
  adr: null
  pr: null
files:
  - apps/api/app/core/database.py (modified)
  - apps/api/.env (created)
  - apps/api/sql/rls_setup.sql (created)
  - apps/api/scripts/test_connection.py (created)
  - apps/api/app/main.py (modified)
  - TASKS.md (modified)
tests:
  - scripts/test_connection.py (manual test script)
  - /health/db endpoint (health check)
---

## Prompt

continue with TASK-002

## Response snapshot

Completed TASK-002: Set Up Neon PostgreSQL Database

**Database Configuration**:
- Updated `database.py` with Neon-optimized settings:
  - NullPool (Neon handles pooling server-side)
  - SSL required
  - Auto-conversion of postgresql:// to postgresql+asyncpg://
  - 30-second command timeout

**Environment Setup**:
- Created `.env` file with DATABASE_URL pointing to Neon pooler endpoint
- Configured JWT secrets and CORS origins

**Row Level Security**:
- Created `sql/rls_setup.sql` with RLS policies for:
  - Users table (select/update own record)
  - Tasks table (full CRUD on own tasks)
  - Sessions table (select/delete own sessions)
  - Helper function `set_current_user_id()` for setting context

**Health Check Endpoints**:
- `/health` - Basic health check
- `/health/db` - Database connection test

**Test Script**:
- Created `scripts/test_connection.py` for testing Neon connectivity
- Tests: basic query, version, permissions, SSL status

## Outcome

- Impact: Database layer ready for User/Task models (unblocks TASK-003)
- Tests: Connection test script + health endpoint created
- Files: 5 files created/modified
- Next prompts: TASK-003 (User Model + Migration)
- Reflection: NullPool important for Neon serverless; RLS provides defense-in-depth

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Manual verification needed (run test_connection.py)
- Prompt variant (if applicable): Standard implementation
- Next experiment: Run test_connection.py to verify database connectivity
