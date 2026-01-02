<!--
═══════════════════════════════════════════════════════════════════════════════
SYNC IMPACT REPORT
═══════════════════════════════════════════════════════════════════════════════

Version Change: Initial → 2.0.0
Type: MAJOR (Initial constitution establishment for Todo Full-Stack Application)

Modified Principles:
- Added: Core Principles section (Spec-Driven Development, Agentic-First Workflow, Zero Trust Security)
- Added: Technical Stack section (Frontend, Backend, Database, Authentication)
- Added: API Standards section
- Added: Project Structure section
- Added: Development Workflow section
- Added: Security Requirements section
- Added: Testing Standards section
- Added: Error Handling section
- Added: Monitoring & Observability section
- Added: Deployment section
- Added: Amendment Process section

New Sections Added:
1. Core Principles (1.1 - 1.3)
2. Technical Stack (2.1 - 2.2)
3. Project Structure (3)
4. Development Workflow (4.1 - 4.3)
5. Security Requirements (5.1 - 5.3)
6. Testing Standards (6.1 - 6.2)
7. Error Handling (7.1 - 7.2)
8. Monitoring & Observability (8)
9. Deployment (9.1 - 9.2)
10. Amendment Process (10)

Removed Sections: None (initial creation)

Templates Requiring Updates:
✅ plan-template.md - Constitution Check section already references constitution file
✅ spec-template.md - Already aligned with spec-driven development requirements
✅ tasks-template.md - Already aligned with user story approach and testing standards
✅ CLAUDE.md - Already references constitution.md for code standards

Follow-up TODOs:
- Ensure .env file is created with required environment variables (BETTER_AUTH_SECRET, DATABASE_URL, JWT_SECRET, CORS_ORIGINS)
- Set up Neon Serverless PostgreSQL database
- Configure Better Auth for JWT authentication
- Establish CI/CD pipeline with staging approval gate
- Initialize test infrastructure (pytest for backend, testing framework for frontend)

Ratification Date: 2025-12-31
Last Amended: 2025-12-31

═══════════════════════════════════════════════════════════════════════════════
-->

# Todo Full-Stack Application v2.0 Constitution

## 1. Core Principles

### 1.1 Spec-Driven Development
**Rule**: No code shall be written without a corresponding specification in `/specs`

**Rationale**: Specifications ensure clarity of requirements, enable review before implementation, and provide documentation for future maintenance. This principle prevents scope creep and ensures all stakeholders align on requirements before development begins.

**Non-Negotiable Rules**:
- All features MUST have a corresponding spec in `/specs` before implementation
- Specs MUST be reviewed and approved before code is written
- Exception: Critical security patches (MUST be spec'd within 24h post-deployment)

**Enforcement**: PR checks verify spec existence before merge

### 1.2 Agentic-First Workflow
**Rule**: Primary development through Claude Code + Spec-Kit Plus

**Rationale**: Agentic workflows ensure consistency, reduce human error, maintain documentation standards, and leverage AI capabilities for rapid, high-quality development. This approach enables faster iteration while maintaining code quality.

**Permitted Manual Coding**:
- Emergency hotfixes (documented post-facto)
- Complex algorithmic optimization requiring deep domain expertise
- Performance-critical sections requiring manual fine-tuning

**Non-Negotiable Rules**:
- All agentic development MUST follow the Spec-Kit Plus workflow
- Manual code MUST be documented and justified
- Manual changes MUST be reviewed with extra scrutiny

### 1.3 Zero Trust Security
**Rule**: All endpoints require authentication; user isolation enforced at database level

**Rationale**: Security breaches are costly and damage user trust. Zero trust architecture minimizes attack surface and ensures defense in depth. User data isolation prevents unauthorized access even if authentication is compromised.

**Non-Negotiable Rules**:
- All endpoints MUST require authentication (except `/health`, `/docs`)
- JWT validation MUST occur on every request
- User isolation MUST be enforced at database query level (every query includes `user_id` filter)
- Row-level security (RLS) MUST be enabled on Neon PostgreSQL

## 2. Technical Stack

### 2.1 Mandatory Technologies

**Frontend**:
- Framework: Next.js 16+
- Router: App Router (no Pages Router)
- Styling: Tailwind CSS (no CSS-in-JS)
- State Management: React Context + Server Components
- Rationale: Next.js App Router provides optimal performance with Server Components, Tailwind ensures consistent styling with minimal bundle size

**Backend**:
- Framework: FastAPI 0.109+
- ORM: SQLModel 0.0.14+
- Validation: Pydantic v2
- Rationale: FastAPI provides excellent performance, automatic API documentation, and strong typing; SQLModel combines SQLAlchemy and Pydantic for type-safe database operations

**Database**:
- Primary: Neon Serverless PostgreSQL
- Migrations: Alembic
- Rationale: Neon provides serverless PostgreSQL with excellent performance, automatic scaling, and built-in branching for development workflows

**Authentication**:
- Library: Better Auth
- Method: JWT (HS256)
- Token Lifetime: 24h (access), 7d (refresh)
- Rationale: Better Auth provides secure, standards-compliant authentication with minimal configuration; JWT enables stateless authentication

### 2.2 API Standards

**Non-Negotiable API Rules**:
- Base path: `/api/v1/` for all endpoints
- Versioning: URL-based (`/api/v2/` for breaking changes)
- Format: JSON (REST)
- Error responses: RFC 7807 Problem Details format

**Rationale**: Consistent API structure enables API versioning without breaking existing clients, JSON is universally supported, RFC 7807 provides machine-readable error details

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
├── history/
│   ├── prompts/      # Prompt History Records
│   └── adr/          # Architecture Decision Records
├── .specify/
│   ├── memory/       # Constitution and project memory
│   ├── templates/    # Spec-Kit Plus templates
│   └── scripts/      # Automation scripts
├── CLAUDE.md         # Root AI context
└── constitution.md   # This file (symlinked to .specify/memory/constitution.md)
```

**Rationale**: Clear separation of concerns (apps vs specs vs history), monorepo structure enables shared tooling and dependencies

## 4. Development Workflow

### 4.1 Context Hierarchy

**Required Reading Order**:
1. Read `/CLAUDE.md` (project overview and AI guidance)
2. Read feature spec (e.g., `/specs/features/task-crud.md`)
3. Read component `CLAUDE.md` if exists (component-specific guidance)

**Rationale**: Hierarchical context ensures developers and AI agents understand project-level constraints before diving into feature-specific details

### 4.2 Implementation Process

```
Spec Creation → Spec Review → Implementation → Testing → PR → Merge
```

**Non-Negotiable Rules**:
- Specs MUST be created before implementation
- Specs MUST be reviewed and approved
- Implementation MUST follow spec exactly
- Tests MUST pass before PR creation
- PRs MUST be reviewed before merge

### 4.3 PR Requirements

**All PRs MUST include**:
- [ ] Link to spec file in PR description
- [ ] Tests passing (80%+ coverage minimum)
- [ ] No security warnings from linters/scanners
- [ ] Documentation updated (if applicable)
- [ ] Changelog entry (for user-facing changes)

**Rationale**: PR requirements ensure code quality, prevent security issues, and maintain documentation currency

## 5. Security Requirements

### 5.1 Authentication Flow

```
Client → Better Auth → JWT Token → FastAPI → Verify → Allow/Deny
```

**Non-Negotiable Rules**:
- All authenticated requests MUST include JWT in Authorization header
- JWTs MUST be validated on every request
- Expired tokens MUST be rejected (no grace period)
- Token refresh MUST use secure refresh token flow

### 5.2 Data Isolation

**Non-Negotiable Rules**:
- All database queries MUST include `user_id` filter
- Row-level security (RLS) MUST be enabled on Neon
- No cross-user data exposure in API responses
- User IDs MUST be extracted from validated JWT, never from request body

**Rationale**: Defense in depth - even if application-level filtering fails, RLS provides database-level protection

### 5.3 Environment Variables

**Required in `.env` (NEVER commit)**:
```bash
BETTER_AUTH_SECRET=<random-256-bit-string>
DATABASE_URL=postgresql://user:pass@host/db
JWT_SECRET=<separate-random-256-bit-string>
CORS_ORIGINS=http://localhost:3000
```

**Non-Negotiable Rules**:
- Secrets MUST be stored in `.env` (never in code)
- `.env` MUST be in `.gitignore`
- Production secrets MUST be managed via secure secret management service
- Secrets MUST be rotated regularly (quarterly minimum)

## 6. Testing Standards

### 6.1 Coverage Requirements

**Non-Negotiable Rules**:
- Unit tests: 80% minimum coverage
- Integration tests: All critical user paths MUST be covered
- E2E tests: All primary user flows MUST be validated

**Rationale**: High test coverage prevents regressions, integration tests catch interaction bugs, E2E tests validate real user experience

### 6.2 Test Structure

**Backend**:
```
tests/
├── unit/          # Fast, isolated unit tests
├── integration/   # Tests of component interactions
└── e2e/           # End-to-end user flow tests
```

**Frontend**:
```
__tests__/
├── components/    # Component unit tests
└── integration/   # User interaction tests
```

**Non-Negotiable Rules**:
- Unit tests MUST run in <5 seconds total
- Integration tests MUST use test database (never production)
- E2E tests MUST clean up test data after execution
- All tests MUST be deterministic (no flaky tests)

## 7. Error Handling

### 7.1 Backend Errors

**RFC 7807 Problem Details Format**:
```json
{
  "type": "https://api.todo.app/errors/not-found",
  "title": "Task Not Found",
  "status": 404,
  "detail": "Task with ID 123 does not exist",
  "instance": "/api/v1/tasks/123"
}
```

**Non-Negotiable Rules**:
- All API errors MUST use RFC 7807 format
- Error types MUST be documented in API spec
- Sensitive information MUST NOT be exposed in error messages
- Stack traces MUST only be included in development environment

### 7.2 Frontend Errors

**Error Display Strategy**:
- Toast notifications for user errors (invalid input, not found, etc.)
- Error boundaries for component failures
- Logging to monitoring service for debugging

**Non-Negotiable Rules**:
- User-facing errors MUST be friendly and actionable
- Technical errors MUST be logged for debugging
- Error boundaries MUST prevent entire app crashes
- Errors MUST NOT expose sensitive system information

## 8. Monitoring & Observability

**Requirements**:
- Logging: Structured JSON logs with consistent schema
- Metrics: Response times (p50, p95, p99), error rates, request counts
- Tracing: OpenTelemetry integration (planned for future)

**Non-Negotiable Rules**:
- All API requests MUST be logged (request ID, method, path, status, duration, user ID)
- All errors MUST be logged with stack traces
- Logs MUST NOT contain sensitive data (passwords, tokens, PII)
- Metrics MUST be collected for all endpoints

## 9. Deployment

### 9.1 Environments

- **Development**: `localhost` (local development)
- **Staging**: `staging.todo.app` (pre-production testing)
- **Production**: `todo.app` (live environment)

**Non-Negotiable Rules**:
- All changes MUST be tested in staging before production
- Production deployments MUST require manual approval
- Rollback plan MUST be documented for all deployments
- Database migrations MUST be tested in staging

### 9.2 CI/CD Pipeline

```
Commit → Tests → Build → Deploy to Staging → Manual Approval → Production
```

**Non-Negotiable Rules**:
- All tests MUST pass before deployment
- Builds MUST succeed before deployment
- Staging MUST be validated before production deployment
- Production deployments MUST require 2+ approver signoff

## 10. Amendment Process

**This constitution can be updated via**:
1. Create amendment proposal in `/specs/amendments/`
2. Team review and discussion
3. Approval by 2+ maintainers
4. Version bump according to semantic versioning
5. Update dependent templates and documentation

**Version Bump Rules**:
- **MAJOR**: Backward incompatible governance changes, principle removals/redefinitions
- **MINOR**: New principle/section added, materially expanded guidance
- **PATCH**: Clarifications, wording improvements, typo fixes

**Non-Negotiable Rules**:
- All amendments MUST be documented in `/specs/amendments/`
- All amendments MUST be reviewed by 2+ maintainers
- Version MUST be bumped for every change
- Dependent artifacts MUST be updated to maintain consistency

---

**Version**: 2.0.0
**Ratified**: 2025-12-31
**Last Amended**: 2025-12-31
**Next Review**: 2026-03-31
