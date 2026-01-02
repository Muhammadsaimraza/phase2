---
id: 001
title: Initial Constitution Creation
stage: constitution
date: 2025-12-31
surface: agent
model: claude-sonnet-4-5
feature: none
branch: master
user: Muhammad Saim Raza
command: /sp.constitution
labels: ["constitution", "governance", "initial-setup", "todo-app"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - None (documentation only)
---

## Prompt

# Project Constitution: Todo Full-Stack Application v2.0

## 1. Core Principles

### 1.1 Spec-Driven Development
- **Rule**: No code shall be written without a corresponding specification in `/specs`
- **Exception**: Critical security patches (must be spec'd within 24h)
- **Enforcement**: PR checks verify spec existence before merge

### 1.2 Agentic-First Workflow
- Primary development through Claude Code + Spec-Kit Plus
- Manual coding allowed for:
  - Emergency hotfixes (documented post-facto)
  - Complex algorithmic optimization
  - Performance-critical sections

### 1.3 Zero Trust Security
- All endpoints require authentication (except `/health`, `/docs`)
- JWT validation on every request
- User isolation enforced at database query level

## 2. Technical Stack

### 2.1 Mandatory Technologies
```yaml
Frontend:
  Framework: Next.js 16+
  Router: App Router
  Styling: Tailwind CSS
  State: React Context + Server Components

Backend:
  Framework: FastAPI 0.109+
  ORM: SQLModel 0.0.14+
  Validation: Pydantic v2

Database:
  Primary: Neon Serverless PostgreSQL
  Migrations: Alembic

Authentication:
  Library: Better Auth
  Method: JWT (HS256)
  Token Lifetime: 24h (access), 7d (refresh)
```

### 2.2 API Standards
- Base path: `/api/v1/`
- Versioning: URL-based (`/api/v2/` for breaking changes)
- Format: JSON (REST)
- Error responses: RFC 7807 Problem Details

## 3. Project Structure
```
/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # FastAPI backend
├── specs/
│   ├── features/     # Feature specifications
│   ├── api/          # API contracts
│   └── architecture/ # System design docs
├── CLAUDE.md         # Root AI context
└── constitution.md   # This file
```

## 4. Development Workflow

### 4.1 Context Hierarchy
1. Read `/CLAUDE.md` (project overview)
2. Read feature spec (e.g., `/specs/features/task-crud.md`)
3. Read component `CLAUDE.md` if exists

### 4.2 Implementation Process
```
Spec Creation → Spec Review → Implementation → Testing → PR → Merge
```

### 4.3 PR Requirements
- [ ] Linked to spec file
- [ ] Tests passing (80%+ coverage)
- [ ] No security warnings
- [ ] Documentation updated

## 5. Security Requirements

### 5.1 Authentication Flow
```
Client → Better Auth → JWT Token → FastAPI → Verify → Allow/Deny
```

### 5.2 Data Isolation
- All queries include `user_id` filter
- Row-level security (RLS) enabled on Neon
- No cross-user data exposure in responses

### 5.3 Environment Variables
```bash
# Required in .env (never commit)
BETTER_AUTH_SECRET=<random-256-bit>
DATABASE_URL=postgresql://...
JWT_SECRET=<separate-secret>
CORS_ORIGINS=http://localhost:3000
```

## 6. Testing Standards

### 6.1 Coverage Requirements
- Unit tests: 80% minimum
- Integration tests: Critical paths covered
- E2E tests: User flows validated

### 6.2 Test Structure
```python
# Backend
tests/
  ├── unit/
  ├── integration/
  └── e2e/

# Frontend
__tests__/
  ├── components/
  └── integration/
```

## 7. Error Handling

### 7.1 Backend Errors
```python
{
  "type": "https://api.todo.app/errors/not-found",
  "title": "Task Not Found",
  "status": 404,
  "detail": "Task with ID 123 does not exist",
  "instance": "/api/v1/tasks/123"
}
```

### 7.2 Frontend Errors
- Toast notifications for user errors
- Error boundaries for component failures
- Logging to monitoring service

## 8. Monitoring & Observability

- Logging: Structured JSON logs
- Metrics: Response times, error rates
- Tracing: OpenTelemetry (future)

## 9. Deployment

### 9.1 Environments
- Development: `localhost`
- Staging: `staging.todo.app`
- Production: `todo.app`

### 9.2 CI/CD Pipeline
```
Commit → Tests → Build → Deploy to Staging → Manual Approval → Production
```

## 10. Amendment Process

This constitution can be updated via:
1. Proposal in `/specs/amendments/`
2. Team review
3. Approval by 2+ maintainers
4. Version bump

---

**Version**: 2.0
**Last Updated**: 2025-12-31
**Next Review**: 2026-03-31

## Response snapshot

Constitution successfully created and validated with comprehensive governance structure for the Todo Full-Stack Application. The constitution establishes 10 major sections covering core principles, technical stack, project structure, development workflow, security requirements, testing standards, error handling, monitoring, deployment, and amendment process.

**Key Deliverables**:
1. Created `.specify/memory/constitution.md` with fully populated constitution (version 2.0.0)
2. Added Sync Impact Report documenting all changes and template validation
3. Established 3 core principles: Spec-Driven Development, Agentic-First Workflow, Zero Trust Security
4. Defined mandatory technical stack: Next.js 16+, FastAPI 0.109+, Neon PostgreSQL, Better Auth
5. Specified non-negotiable rules for security (JWT validation, RLS, user isolation)
6. Established testing requirements (80% coverage, integration tests, E2E tests)
7. Defined RFC 7807 error handling format
8. Created 3-environment deployment pipeline (dev → staging → production)
9. Established semantic versioning for constitution amendments

**Template Consistency Validation**:
- ✅ plan-template.md: Constitution Check section already references constitution
- ✅ spec-template.md: Aligned with spec-driven development requirements
- ✅ tasks-template.md: Aligned with user story approach and testing standards
- ✅ CLAUDE.md: References constitution.md for code standards

**Version Decision**: 2.0.0 (MAJOR)
- **Rationale**: Initial constitution establishment for the project, setting fundamental governance structure

## Outcome

- ✅ Impact: Project constitution established with comprehensive governance covering 10 major areas (principles, stack, security, testing, deployment). All templates validated for consistency.
- 🧪 Tests: None required (documentation artifact)
- 📁 Files: Created .specify/memory/constitution.md (367 lines)
- 🔁 Next prompts: Set up .env file with required secrets, initialize Neon database, configure Better Auth, establish CI/CD pipeline, create first feature spec
- 🧠 Reflection: Constitution provides clear, testable governance with rationale for each principle. MUST-level requirements enable objective compliance checking. Follow-up TODOs documented for infrastructure setup.

## Evaluation notes (flywheel)

- Failure modes observed: None. Constitution successfully created with all placeholders filled.
- Graders run and results (PASS/FAIL):
  - PASS: No unresolved placeholders
  - PASS: Version matches sync report (2.0.0)
  - PASS: All dates in ISO format (2025-12-31)
  - PASS: All principles declarative with clear rationale
  - PASS: Template consistency validated
- Prompt variant (if applicable): N/A (initial creation)
- Next experiment (smallest change to try): Monitor first feature development to validate constitution principles are practical and enforceable. Consider adding specific metrics for measuring compliance (e.g., % of PRs with linked specs).
