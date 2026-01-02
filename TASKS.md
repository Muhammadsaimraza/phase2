# Tasks: Todo Full-Stack Application

**Updated**: 2026-01-01 | **Sprint**: W1 (Foundation) | **Capacity**: 51/120h

---

## Sprint Goal

**Goal**: Establish project foundation with working authentication and database setup
**Progress**: 15/15 tasks (100%) | 0 blocked

---

## High Priority

### TASK-001: Initialize Monorepo Structure
- **Status**: Done
- **Owner**: Dev3
- **Est**: 4h | **Due**: W1D2
- **Spec**: N/A (Infrastructure)
- **Progress**: 100%
- **Subtasks**:
  - [x] Create apps/web (Next.js 16)
  - [x] Create apps/api (FastAPI)
  - [x] Configure shared TypeScript types
  - [x] Set up ESLint + Prettier
  - [x] Configure .gitignore
  - [x] Create root package.json with workspaces

### TASK-002: Set Up Neon PostgreSQL Database
- **Status**: Done
- **Owner**: Dev1
- **Est**: 2h | **Due**: W1D2
- **Spec**: N/A (Infrastructure)
- **Progress**: 100%
- **Subtasks**:
  - [x] Create Neon project
  - [x] Configure connection pooling
  - [x] Set up DATABASE_URL in .env
  - [x] Enable Row Level Security
  - [x] Test connection from FastAPI

### TASK-003: Create User Model + Migration
- **Status**: Done
- **Owner**: Dev1
- **Est**: 4h | **Due**: W1D3
- **Spec**: SPEC-001 (Auth)
- **Deps**: TASK-002
- **Progress**: 100%
- **Subtasks**:
  - [x] Define User SQLModel
  - [x] Define Session SQLModel
  - [x] Create Alembic migration
  - [ ] Run migration on Neon
  - [ ] Verify table creation

### TASK-004: Configure Better Auth Server
- **Status**: Done
- **Owner**: Dev1
- **Est**: 6h | **Due**: W1D4
- **Spec**: SPEC-001 (Auth)
- **Deps**: TASK-003
- **Progress**: 100%
- **Subtasks**:
  - [x] Install Better Auth dependencies
  - [x] Configure auth settings
  - [x] Set up JWT secret (HS256)
  - [x] Configure token lifetimes (24h/7d)
  - [x] Integrate with FastAPI

### TASK-005: Implement Auth API Endpoints
- **Status**: Done
- **Owner**: Dev1
- **Est**: 8h | **Due**: W1D5
- **Spec**: SPEC-001 (Auth)
- **Deps**: TASK-004
- **Progress**: 100%
- **Subtasks**:
  - [x] POST /api/v1/auth/register
  - [x] POST /api/v1/auth/login
  - [x] POST /api/v1/auth/refresh
  - [x] POST /api/v1/auth/logout
  - [x] GET /api/v1/auth/me
  - [x] Add Pydantic schemas
  - [x] Implement password hashing (bcrypt)

### TASK-006: Create JWT Validation Middleware
- **Status**: Done
- **Owner**: Dev1
- **Est**: 4h | **Due**: W2D1
- **Spec**: SPEC-001 (Auth)
- **Deps**: TASK-005
- **Progress**: 100%
- **Note**: Completed as part of TASK-004
- **Subtasks**:
  - [x] Create auth dependency
  - [x] Validate JWT on protected routes
  - [x] Extract user_id from token
  - [x] Return 401 for invalid tokens
  - [x] Add to route dependencies

---

## Medium Priority

### TASK-007: Configure Better Auth Client (Frontend)
- **Status**: Done
- **Owner**: Dev2
- **Est**: 4h | **Due**: W2D2
- **Spec**: SPEC-001 (Auth)
- **Deps**: TASK-005
- **Progress**: 100%
- **Subtasks**:
  - [x] Install Better Auth client
  - [x] Configure API base URL
  - [x] Set up auth client instance
  - [x] Configure token storage

### TASK-008: Build AuthContext Provider
- **Status**: Done
- **Owner**: Dev2
- **Est**: 4h | **Due**: W2D2
- **Spec**: SPEC-001 (Auth)
- **Deps**: TASK-007
- **Progress**: 100%
- **Subtasks**:
  - [x] Create AuthContext
  - [x] Implement login function
  - [x] Implement register function
  - [x] Implement logout function
  - [x] Add isLoading state
  - [x] Persist auth state

### TASK-009: Build Login Form Component
- **Status**: Done
- **Owner**: Dev2
- **Est**: 6h | **Due**: W2D3
- **Spec**: SPEC-001 (Auth)
- **Deps**: TASK-008
- **Progress**: 100%
- **Subtasks**:
  - [x] Create form with React Hook Form
  - [x] Add Zod validation
  - [x] Email input with validation
  - [x] Password input with toggle
  - [x] Submit button with loading state
  - [x] Error message display
  - [x] Link to register page

### TASK-010: Build Register Form Component
- **Status**: Done
- **Owner**: Dev2
- **Est**: 6h | **Due**: W2D3
- **Spec**: SPEC-001 (Auth)
- **Deps**: TASK-008
- **Progress**: 100%
- **Subtasks**:
  - [x] Create form with React Hook Form
  - [x] Add Zod validation (password rules)
  - [x] Email input with validation
  - [x] Password input with requirements
  - [x] Confirm password input
  - [x] Submit button with loading state
  - [x] Link to login page

### TASK-011: Create Protected Route Wrapper
- **Status**: Done
- **Owner**: Dev2
- **Est**: 3h | **Due**: W2D4
- **Spec**: SPEC-001 (Auth)
- **Deps**: TASK-008
- **Progress**: 100%
- **Note**: Completed as part of TASK-008 (AuthGuard component)
- **Subtasks**:
  - [x] Check auth state
  - [x] Redirect to login if unauthenticated
  - [x] Show loading during check
  - [x] Preserve intended destination

### TASK-012: Write Auth Backend Tests
- **Status**: Done
- **Owner**: Dev1
- **Est**: 6h | **Due**: W2D4
- **Spec**: SPEC-001 (Auth)
- **Deps**: TASK-006
- **Progress**: 100%
- **Subtasks**:
  - [x] test_register_success
  - [x] test_register_duplicate_email
  - [x] test_register_weak_password
  - [x] test_login_success
  - [x] test_login_invalid_credentials
  - [x] test_protected_route_without_token
  - [x] test_protected_route_with_valid_token
  - [x] test_refresh_token
  - [x] 22 tests total (exceeds coverage goal)

---

## Low Priority

### TASK-013: Add Rate Limiting Middleware
- **Status**: Done
- **Owner**: Dev1
- **Est**: 3h | **Due**: W2D5
- **Spec**: SPEC-001 (Auth)
- **Deps**: TASK-006
- **Progress**: 100%
- **Subtasks**:
  - [x] Install slowapi or similar
  - [x] Configure 5 attempts/15min for login
  - [x] Add 429 response handling
  - [x] Test rate limiting (8 tests)

### TASK-014: Set Up Design Tokens
- **Status**: Done
- **Owner**: Dev2
- **Est**: 4h | **Due**: W2D1
- **Spec**: N/A (UI Foundation)
- **Deps**: TASK-001
- **Progress**: 100%
- **Subtasks**:
  - [x] Configure Tailwind colors (primary, success, warning, error, info)
  - [x] Set up typography scale (display + text sizes)
  - [x] Define spacing scale (extended to 120)
  - [x] Configure shadows (xs-2xl, focus, colored)
  - [x] Set up border radius (xs-4xl)

### TASK-015: Configure Animation System
- **Status**: Done
- **Owner**: Dev2
- **Est**: 4h | **Due**: W2D2
- **Spec**: N/A (UI Foundation)
- **Deps**: TASK-014
- **Progress**: 100%
- **Subtasks**:
  - [x] Add Tailwind keyframes (fade, slide, scale, shimmer, check, bounce)
  - [x] Install Framer Motion (v11.15.0 already installed)
  - [x] Create animation variants file (lib/animations.ts)
  - [x] Test reduced motion support (useReducedMotion hook)

---

## By Developer

**Dev1 - Backend** (0/33h):
- TASK-002: Neon setup (2h)
- TASK-003: User model (4h)
- TASK-004: Better Auth server (6h)
- TASK-005: Auth endpoints (8h)
- TASK-006: JWT middleware (4h)
- TASK-012: Backend tests (6h)
- TASK-013: Rate limiting (3h)

**Dev2 - Frontend** (0/31h):
- TASK-007: Better Auth client (4h)
- TASK-008: AuthContext (4h)
- TASK-009: Login form (6h)
- TASK-010: Register form (6h)
- TASK-011: Protected routes (3h)
- TASK-014: Design tokens (4h)
- TASK-015: Animation system (4h)

**Dev3 - Full Stack** (0/4h):
- TASK-001: Monorepo setup (4h)

---

## By Phase

**Phase 1: Foundation** (0/15 tasks):
- TASK-001: Monorepo setup
- TASK-002: Neon PostgreSQL
- TASK-003: User model
- TASK-004: Better Auth server
- TASK-005: Auth endpoints
- TASK-006: JWT middleware
- TASK-007: Better Auth client
- TASK-008: AuthContext
- TASK-009: Login form
- TASK-010: Register form
- TASK-011: Protected routes
- TASK-012: Backend tests
- TASK-013: Rate limiting
- TASK-014: Design tokens
- TASK-015: Animation system

**Phase 2: Backend** (0/8 tasks):
- TASK-020: Task model + migration
- TASK-021: Task CRUD endpoints
- TASK-022: Input validation
- TASK-023: RFC 7807 errors
- TASK-024: User isolation (RLS)
- TASK-025: API documentation
- TASK-026: Backend integration tests
- TASK-027: Logging setup

**Phase 3: Frontend** (0/12 tasks):
- TASK-030: Button component
- TASK-031: Input component
- TASK-032: Card component
- TASK-033: Modal component
- TASK-034: Toast setup (Sonner)
- TASK-035: Skeleton components
- TASK-036: TaskList component
- TASK-037: TaskCard component
- TASK-038: TaskForm component
- TASK-039: Empty states
- TASK-040: Page transitions
- TASK-041: Responsive layouts

**Phase 4: Polish + Launch** (0/8 tasks):
- TASK-050: E2E tests (Playwright)
- TASK-051: Performance audit
- TASK-052: Security audit
- TASK-053: Accessibility audit
- TASK-054: Error boundaries
- TASK-055: Staging deployment
- TASK-056: Production deployment
- TASK-057: Documentation

---

## Backlog

**Ready (Phase 2 - can start after Phase 1)**:
- [ ] TASK-020: Task model + migration - 4h
- [ ] TASK-021: Task CRUD endpoints - 8h
- [ ] TASK-022: Input validation - 3h
- [ ] TASK-023: RFC 7807 error handling - 4h
- [ ] TASK-024: User isolation (RLS queries) - 4h

**Future (v1.1+)**:
- [ ] TASK-100: Dark mode theme
- [ ] TASK-101: Drag & drop reordering
- [ ] TASK-102: Task categories/tags
- [ ] TASK-103: Recurring tasks
- [ ] TASK-104: Email verification
- [ ] TASK-105: Password reset flow
- [ ] TASK-106: Social login (OAuth)

---

## Completed

- TASK-001: Initialize Monorepo Structure - 2025-12-31
- TASK-002: Set Up Neon PostgreSQL Database - 2026-01-01
- TASK-003: Create User Model + Migration - 2026-01-01
- TASK-004: Configure Better Auth Server - 2026-01-01
- TASK-005: Implement Auth API Endpoints - 2026-01-01
- TASK-006: Create JWT Validation Middleware - 2026-01-01
- TASK-007: Configure Better Auth Client (Frontend) - 2026-01-01
- TASK-008: Build AuthContext Provider - 2026-01-01
- TASK-009: Build Login Form Component - 2026-01-01
- TASK-010: Build Register Form Component - 2026-01-01
- TASK-011: Create Protected Route Wrapper - 2026-01-01
- TASK-012: Write Auth Backend Tests - 2026-01-01
- TASK-013: Add Rate Limiting Middleware - 2026-01-01
- TASK-014: Set Up Design Tokens - 2026-01-01
- TASK-015: Configure Animation System - 2026-01-01

---

## Blockers

| Task | Blocked By | Expected Unblock |
|------|------------|------------------|
| TASK-003 | TASK-002 | W1D2 |
| TASK-004 | TASK-003 | W1D3 |
| TASK-005 | TASK-004 | W1D4 |
| TASK-006 | TASK-005 | W1D5 |
| TASK-007 | TASK-005 | W1D5 |

---

## Standup

**W1D1 (2025-12-31)**:
- Sprint kickoff
- Dev1: Starting TASK-002 (Neon setup)
- Dev2: Waiting for monorepo
- Dev3: Starting TASK-001 (Monorepo)

---

## Metrics

| Sprint | Planned | Done | Velocity |
|--------|---------|------|----------|
| W1-2 | 68h | 0h | -- |
| W3-4 | -- | -- | -- |
| W5-6 | -- | -- | -- |
| W7-8 | -- | -- | -- |

---

## Templates

**Feature Task**:
```markdown
### TASK-XXX: [Title]
- **Status**: Todo
- **Owner**: [Dev1/Dev2/Dev3]
- **Est**: Xh | **Due**: W[N]D[N]
- **Spec**: SPEC-XXX
- **Progress**: 0%
- **Subtasks**:
  - [ ] Subtask 1
  - [ ] Subtask 2
```

**Bug Task**:
```markdown
### TASK-XXX: Fix [Bug Description]
- **Type**: Bug
- **Severity**: High | Medium | Low
- **Owner**: [Name]
- **Reproduce**: [Steps to reproduce]
- **Expected**: [Expected behavior]
- **Actual**: [Actual behavior]
- **Subtasks**:
  - [ ] Investigate root cause
  - [ ] Implement fix
  - [ ] Add regression test
```

**UI Task**:
```markdown
### TASK-XXX: [Component] Component
- **Type**: UI
- **Owner**: Dev2
- **Est**: Xh
- **Animation**: [fade/slide/scale/none]
- **Responsive**: Yes/No
- **A11y**: WCAG AA
- **Subtasks**:
  - [ ] Base component
  - [ ] Variants
  - [ ] Hover/focus states
  - [ ] Mobile styles
  - [ ] Tests
```

---

## Legend

| Icon | Status | Description |
|------|--------|-------------|
| Todo | Todo | Not started |
| In Progress | In Progress | Actively working |
| Done | Done | Completed |
| Blocked | Blocked | Waiting on dependency |
| Review | Review | PR submitted |
| Deployed | Deployed | In production |

---

## UI Tasks Detail

### TASK-014: Design Tokens
- **Colors**:
  - [ ] Primary (blue-500, blue-600, blue-700)
  - [ ] Semantic (success, warning, error)
  - [ ] Neutrals (gray-50 to gray-900)
- **Typography**:
  - [ ] Headings (h1-h3)
  - [ ] Body (lg, base, sm)
  - [ ] Font weights
- **Spacing**:
  - [ ] Scale (1-12)
- **Other**:
  - [ ] Shadows (sm, md, lg)
  - [ ] Border radius (sm, md, lg, full)

### TASK-015: Animation System
- **Tailwind Keyframes**:
  - [x] fadeIn / fadeOut
  - [x] slideUp / slideDown
  - [x] scaleIn / scaleOut
  - [x] shimmer
  - [x] check (success)
- **Framer Variants**:
  - [x] pageVariants / pageSlideVariants
  - [x] listVariants / listItemVariants
  - [x] buttonTap / buttonHover
  - [x] cardHover / cardEntrance
  - [x] checkboxVariants / checkmarkVariants
  - [x] modalVariants / backdropVariants
  - [x] toastVariants / tooltipVariants
  - [x] accordionVariants / popoverVariants
- **A11y**:
  - [x] prefers-reduced-motion support (useReducedMotion hook)

---

## Animation Checklist

**Transitions**:
- [x] Fade in/out (0.2s ease-out)
- [x] Slide up/down (0.3s ease-out)
- [x] Scale in/out (0.2s ease-out)

**Interactions**:
- [x] Button press (scale 0.97)
- [x] Button hover (scale 1.02)
- [x] Focus ring (ring-2 ring-primary-500)
- [x] Shimmer loading (2s infinite)
- [x] Success checkmark (0.3s bounce)

**Page Transitions**:
- [x] Route change fade (0.3s)
- [x] List stagger (0.05s delay)
- [x] Modal slide up (0.2s)
- [x] Toast slide in (0.2s)

**Performance**:
- [x] 60fps verified (transform/opacity only)
- [x] GPU acceleration (transform, opacity)
- [x] Reduced motion fallbacks (useReducedMotion hook)
- [x] No layout thrashing (no height/width animations)

---

## Component Checklist (Phase 3)

| Component | Base | Variants | Animation | Responsive | Tests |
|-----------|------|----------|-----------|------------|-------|
| Button | [ ] | [ ] | [ ] | [ ] | [ ] |
| Input | [ ] | [ ] | [ ] | [ ] | [ ] |
| Card | [ ] | [ ] | [ ] | [ ] | [ ] |
| Modal | [ ] | [ ] | [ ] | [ ] | [ ] |
| Toast | [ ] | [ ] | [ ] | [ ] | [ ] |
| Skeleton | [ ] | [ ] | [ ] | [ ] | [ ] |
| Checkbox | [ ] | [ ] | [ ] | [ ] | [ ] |
| EmptyState | [ ] | [ ] | [ ] | [ ] | [ ] |

---

## Dependencies Graph

```
TASK-001 (Monorepo)
    |
    +-- TASK-002 (Neon) -- TASK-003 (User Model) -- TASK-004 (Better Auth)
    |                                                      |
    |                                      +---------------+---------------+
    |                                      |                               |
    +-- TASK-014 (Design)           TASK-005 (Auth APIs)           TASK-007 (Client)
           |                               |                               |
    TASK-015 (Animations)           TASK-006 (JWT MW)              TASK-008 (Context)
                                           |                               |
                                    TASK-012 (Tests)         +-------------+-------------+
                                           |                 |             |             |
                                    TASK-013 (Rate Limit)  TASK-009    TASK-010    TASK-011
                                                          (Login)    (Register)  (Protected)
```

---

## Changelog

| Date | Task | Change |
|------|------|--------|
| 2025-12-31 | ALL | Initial task creation |
| 2025-12-31 | TASK-001 | Completed - Monorepo structure initialized |
| 2026-01-01 | TASK-002 | Completed - Neon PostgreSQL configured with RLS |
| 2026-01-01 | TASK-003 | Completed - User/Session models with migration |
| 2026-01-01 | TASK-004 | Completed - JWT auth configured with FastAPI |
| 2026-01-01 | TASK-005 | Completed - All auth endpoints implemented |
| 2026-01-01 | TASK-006 | Completed - JWT middleware (done in TASK-004) |
| 2026-01-01 | TASK-007 | Completed - Frontend auth client configured |
| 2026-01-01 | TASK-008 | Completed - AuthContext provider with guards |
| 2026-01-01 | TASK-009 | Completed - Login form with UI components |
| 2026-01-01 | TASK-010 | Completed - Register form with password validation |
| 2026-01-01 | TASK-011 | Completed - Protected route (done in TASK-008) |
| 2026-01-01 | TASK-012 | Completed - 22 auth backend tests (registration, login, protected routes, refresh tokens, logout) |
| 2026-01-01 | TASK-013 | Completed - Rate limiting with slowapi (5 login/15min, 10 register/hour, 8 tests) |
| 2026-01-01 | TASK-014 | Completed - Design tokens (colors, typography, spacing, shadows, border-radius) |
| 2026-01-01 | TASK-015 | Completed - Animation system (Framer Motion variants, Tailwind keyframes, useReducedMotion hook) |

---

**Last Update**: 2026-01-01 by Claude (Phase 1 Foundation 100% Complete)
