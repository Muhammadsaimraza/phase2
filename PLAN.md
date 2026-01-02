# Plan: Todo Full-Stack Application

## Meta
- **Version**: 1.0
- **Status**: Planning
- **Team**: 3 developers
- **Duration**: 8 weeks
- **Constitution**: v2.0.0

---

## 1. Vision

**Mission**: Build a modern, responsive task management application with smooth animations, optimistic UI, and rock-solid authentication.

**Goals**:
- Primary: Enable users to create, organize, and complete tasks efficiently
- Secondary: Deliver a premium UX with fluid animations and instant feedback

**Success**:
- Task completion rate > 80%
- Page load < 2s
- API response < 200ms p95
- User satisfaction > 4.5/5

---

## 2. Scope

### In Scope
- User authentication (Better Auth + JWT)
- Task CRUD operations
- Task status management (pending, in-progress, completed)
- Due date tracking
- Responsive design (mobile-first)
- Optimistic UI updates
- Smooth animations (Framer Motion)
- Toast notifications (Sonner)

### Out of Scope
- Team collaboration / sharing
- Task categories / tags (v2)
- Recurring tasks (v2)
- File attachments (v2)
- Dark mode (v2)
- Drag & drop reordering (v2)
- Push notifications (v2)
- Offline support (v2)

---

## 3. Timeline
```
W1-2: Foundation (Auth + DB + Setup)
W3-4: Backend (APIs + Validation)
W5-6: Frontend (UI + Animations)
W7-8: Polish + Launch
```

| Milestone | Week | Deliverable | Status |
|-----------|------|-------------|--------|
| Foundation | W2 | Auth working, DB schema | Planning |
| Backend | W4 | All APIs complete | Planning |
| Frontend | W6 | UI complete, responsive | Planning |
| Launch | W8 | Production deploy | Planning |

---

## 4. Features

### Phase 1: Foundation (W1-2)
- [ ] Project scaffolding (Next.js + FastAPI monorepo)
- [ ] Neon PostgreSQL setup
- [ ] Database schema + migrations
- [ ] Better Auth configuration
- [ ] JWT middleware (FastAPI)
- [ ] Auth API endpoints
- [ ] Login/Register UI components
- [ ] Protected route wrapper
- [ ] Environment configuration

### Phase 2: Backend (W3-4)
- [ ] Task model + migration
- [ ] Task CRUD endpoints
- [ ] Input validation (Pydantic)
- [ ] Error handling (RFC 7807)
- [ ] User isolation (RLS)
- [ ] Rate limiting
- [ ] API documentation (OpenAPI)
- [ ] Backend unit tests (80%+)
- [ ] Integration tests

### Phase 3: Frontend (W5-6)
- [ ] Design system setup
- [ ] Component library (Button, Input, Card, etc.)
- [ ] Task list view
- [ ] Task create/edit forms
- [ ] Task status updates
- [ ] Loading skeletons
- [ ] Empty states
- [ ] Animations (Framer Motion)
- [ ] Toast notifications (Sonner)
- [ ] Responsive layouts
- [ ] Frontend tests

### Phase 4: Polish + Launch (W7-8)
- [ ] E2E tests (Playwright)
- [ ] Performance optimization
- [ ] Security audit
- [ ] Accessibility audit
- [ ] Error boundary implementation
- [ ] Logging + monitoring setup
- [ ] Staging deployment
- [ ] Production deployment
- [ ] Documentation

---

## 5. Stack
```yaml
Frontend:
  Framework: Next.js 16+ (App Router)
  Styling: Tailwind CSS
  Animation: Framer Motion
  Data: React Query / Server Components
  Toasts: Sonner
  Forms: React Hook Form + Zod

Backend:
  Framework: FastAPI 0.109+
  ORM: SQLModel 0.0.14+
  Validation: Pydantic v2
  Testing: pytest

Database:
  Primary: Neon Serverless PostgreSQL
  Migrations: Alembic

Auth:
  Library: Better Auth
  Method: JWT (HS256)
  Access Token: 24h
  Refresh Token: 7d

DevOps:
  CI/CD: GitHub Actions
  Hosting: Vercel (Frontend) + Railway/Render (Backend)
  Monitoring: TBD
```

---

## 6. Design System

### Colors
```css
/* Primary */
--primary-50: #eff6ff;
--primary-500: #3b82f6;
--primary-600: #2563eb;
--primary-700: #1d4ed8;

/* Semantic */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;

/* Neutral */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-500: #6b7280;
--gray-900: #111827;
```

### Typography
```css
/* Headings */
--h1: 2.25rem/1.2 font-bold;    /* 36px */
--h2: 1.875rem/1.25 font-bold;  /* 30px */
--h3: 1.5rem/1.3 font-semibold; /* 24px */

/* Body */
--body-lg: 1.125rem/1.6;  /* 18px */
--body: 1rem/1.5;         /* 16px */
--body-sm: 0.875rem/1.5;  /* 14px */
```

### Spacing
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
```

### Shadows
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.1);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
```

### Border Radius
```css
--radius-sm: 0.25rem;  /* 4px */
--radius-md: 0.5rem;   /* 8px */
--radius-lg: 0.75rem;  /* 12px */
--radius-full: 9999px;
```

---

## 7. Animations

### Tailwind Config
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'fade-out': 'fadeOut 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
        'spin-slow': 'spin 1.5s linear infinite',
        'check': 'check 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        check: {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
};
```

### Framer Motion Variants
```typescript
// lib/animations.ts

// Page transitions
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const pageTransition = {
  duration: 0.3,
  ease: 'easeOut',
};

// List stagger
export const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const listItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

// Button interactions
export const buttonTap = { scale: 0.97 };
export const buttonHover = { scale: 1.02 };

// Card hover
export const cardHover = {
  y: -2,
  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  transition: { duration: 0.2 },
};

// Checkbox animation
export const checkboxVariants = {
  unchecked: { scale: 1 },
  checked: {
    scale: [1, 1.2, 1],
    transition: { duration: 0.3 },
  },
};
```

### Usage Examples
```typescript
// Page wrapper
<motion.div
  variants={pageVariants}
  initial="initial"
  animate="animate"
  exit="exit"
  transition={pageTransition}
>
  {children}
</motion.div>

// Task list with stagger
<motion.ul variants={listVariants} initial="hidden" animate="visible">
  {tasks.map((task) => (
    <motion.li key={task.id} variants={listItemVariants}>
      <TaskCard task={task} />
    </motion.li>
  ))}
</motion.ul>

// Interactive button
<motion.button
  whileHover={buttonHover}
  whileTap={buttonTap}
  className="btn-primary"
>
  Create Task
</motion.button>

// Task completion
<motion.div
  initial={{ opacity: 1, height: 'auto' }}
  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
  transition={{ duration: 0.2 }}
>
  <TaskCard />
</motion.div>
```

---

## 8. UI Patterns

### Loading States
```typescript
// Skeleton components
<Skeleton className="h-16 w-full rounded-lg" />
<Skeleton className="h-4 w-3/4" />
<Skeleton className="h-4 w-1/2" />

// Shimmer effect (CSS)
.skeleton {
  @apply bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200;
  @apply bg-[length:1000px_100%] animate-shimmer;
}

// Button loading
<Button isLoading>
  <Spinner className="mr-2" />
  Saving...
</Button>
```

### Empty States
```typescript
<EmptyState
  icon={<ClipboardIcon />}
  title="No tasks yet"
  description="Create your first task to get started"
  action={<Button>Create Task</Button>}
/>
```

### Error Handling
```typescript
// Inline form error
<Input
  label="Title"
  error={errors.title?.message}
  className={errors.title ? 'border-red-500' : ''}
/>

// Toast notifications
toast.success('Task created!');
toast.error('Failed to save. Please try again.');
toast.loading('Saving...');

// Error boundary fallback
<ErrorFallback
  title="Something went wrong"
  action={<Button onClick={retry}>Try Again</Button>}
/>
```

### Micro-interactions
```typescript
// Checkbox with animation
<motion.div
  animate={isChecked ? 'checked' : 'unchecked'}
  variants={checkboxVariants}
>
  <Checkbox checked={isChecked} onChange={toggle} />
</motion.div>

// Success feedback
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  className="text-green-500"
>
  <CheckCircleIcon />
</motion.div>

// Focus ring
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
}
```

---

## 9. UX Principles

### Optimistic UI
```typescript
// Optimistic update pattern
const createTask = useMutation({
  mutationFn: api.createTask,
  onMutate: async (newTask) => {
    // Cancel outgoing queries
    await queryClient.cancelQueries(['tasks']);

    // Snapshot previous value
    const previous = queryClient.getQueryData(['tasks']);

    // Optimistically add to list
    queryClient.setQueryData(['tasks'], (old) => [
      ...old,
      { ...newTask, id: 'temp-' + Date.now() },
    ]);

    return { previous };
  },
  onError: (err, newTask, context) => {
    // Rollback on error
    queryClient.setQueryData(['tasks'], context.previous);
    toast.error('Failed to create task');
  },
  onSuccess: () => {
    toast.success('Task created!');
  },
  onSettled: () => {
    queryClient.invalidateQueries(['tasks']);
  },
});
```

### Feedback Timing
| Action | Feedback | Timing |
|--------|----------|--------|
| Button click | Scale down | Instant |
| Form submit | Loading state | Instant |
| API success | Toast + animation | On response |
| API error | Toast + inline | On response |
| Long operation | Progress indicator | After 300ms |

### Performance Budget
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Input debounce: 300ms
- API timeout: 10s

### Accessibility
- Keyboard navigation for all interactive elements
- ARIA labels on icons and buttons
- Focus management on modals
- Color contrast ratio >= 4.5:1
- Screen reader announcements for dynamic content
- Reduced motion support (`prefers-reduced-motion`)

---

## 10. Components

### Core Components
```typescript
// Button
<Button
  variant="primary" | "secondary" | "ghost" | "danger"
  size="sm" | "md" | "lg"
  isLoading={boolean}
  disabled={boolean}
>
  Label
</Button>

// Input
<Input
  label="Task title"
  placeholder="Enter title..."
  error="Title is required"
  helperText="Max 200 characters"
/>

// Card
<Card
  hover={boolean}
  shadow="none" | "sm" | "md" | "lg"
  padding="sm" | "md" | "lg"
>
  {children}
</Card>

// Checkbox
<Checkbox
  checked={boolean}
  onChange={(checked) => void}
  label="Mark as complete"
/>

// Modal
<Modal
  isOpen={boolean}
  onClose={() => void}
  title="Create Task"
>
  {children}
</Modal>
```

### Task Components
```typescript
// TaskCard
<TaskCard
  task={task}
  onToggle={() => void}
  onEdit={() => void}
  onDelete={() => void}
/>

// TaskForm
<TaskForm
  initialValues={task?}
  onSubmit={(data) => void}
  onCancel={() => void}
/>

// TaskList
<TaskList
  tasks={tasks}
  isLoading={boolean}
  emptyMessage="No tasks"
/>
```

### Feedback Components
```typescript
// Toast (via Sonner)
import { toast } from 'sonner';

toast.success('Task saved!');
toast.error('Something went wrong');
toast.loading('Saving...');
toast.promise(saveTask(), {
  loading: 'Saving...',
  success: 'Saved!',
  error: 'Failed to save',
});

// Skeleton
<Skeleton className="h-16 w-full rounded-lg" />
<TaskSkeleton /> // Pre-built task skeleton

// Spinner
<Spinner size="sm" | "md" | "lg" />

// EmptyState
<EmptyState
  icon={<Icon />}
  title="No results"
  description="Try a different search"
  action={<Button>Clear filters</Button>}
/>
```

---

## 11. Responsive Design

### Breakpoints
```css
/* Mobile First */
sm: 640px   /* Large phones */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### Layout Patterns
```typescript
// Container
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

// Grid
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

// Stack to row
<div className="flex flex-col sm:flex-row sm:items-center gap-4">

// Hide/show
<div className="hidden md:block">Desktop only</div>
<div className="md:hidden">Mobile only</div>
```

### Touch Targets
```css
/* Minimum 44x44px touch targets */
.touch-target {
  @apply min-h-[44px] min-w-[44px];
}

/* Comfortable spacing */
.touch-list > * + * {
  @apply mt-2;
}
```

### Mobile Considerations
- Bottom navigation for key actions
- Pull-to-refresh on task list
- Swipe actions on task cards (future)
- Keyboard avoidance for forms

---

## 12. Team

| Role | Focus Area | Weeks |
|------|------------|-------|
| Dev 1 (Backend) | Auth, APIs, DB, Tests | W1-4 |
| Dev 2 (Frontend) | Components, UI, Animations | W3-6 |
| Dev 3 (Full Stack) | Integration, E2E, DevOps | W5-8 |

### Responsibilities
**Dev 1 - Backend**:
- Database schema design
- Alembic migrations
- FastAPI endpoints
- Better Auth integration
- pytest unit/integration tests
- API documentation

**Dev 2 - Frontend**:
- Design system implementation
- React components
- Framer Motion animations
- Responsive layouts
- Component tests

**Dev 3 - Full Stack**:
- Frontend-backend integration
- E2E tests (Playwright)
- CI/CD pipeline
- Deployment configuration
- Monitoring setup

---

## 13. Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Better Auth learning curve | Medium | High | Start W1, allow buffer |
| Animation performance | Low | Medium | Test on low-end devices, use CSS |
| Scope creep | High | High | Strict spec adherence, say no |
| Integration issues | Medium | Medium | Early integration, shared types |
| Database performance | Low | High | Indexes, query optimization, RLS |

### Contingencies
- If auth takes longer: Defer refresh token rotation to v1.1
- If animations lag: Fall back to CSS-only transitions
- If behind schedule: Cut polish items, ship MVP

---

## 14. Quality Gates

### Code Quality
- TypeScript strict mode
- ESLint + Prettier
- No `any` types
- All functions documented

### Testing
| Type | Coverage | Pass Rate |
|------|----------|-----------|
| Unit | >= 80% | 100% |
| Integration | All critical paths | 100% |
| E2E | All user flows | 100% |

### Performance
| Metric | Target |
|--------|--------|
| API p95 | < 200ms |
| Page load | < 2s |
| Lighthouse | > 90 |
| Animation FPS | 60fps |
| Bundle size | < 200KB (gzipped) |

### Security
- [ ] No secrets in code
- [ ] JWT validation on all routes
- [ ] User isolation verified
- [ ] Rate limiting active
- [ ] OWASP Top 10 checked

---

## 15. Launch Checklist

### Pre-Launch
- [ ] All features implemented per specs
- [ ] Test coverage >= 80%
- [ ] E2E tests passing
- [ ] Security audit complete
- [ ] Performance benchmarks met
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Error monitoring configured
- [ ] Staging environment tested
- [ ] Rollback plan documented

### Launch Day
- [ ] Database backup verified
- [ ] Deploy to production
- [ ] Smoke tests passing
- [ ] Monitoring dashboards live
- [ ] On-call rotation set

### Post-Launch (Week 1)
- [ ] Monitor error rates (< 1%)
- [ ] Track user signups
- [ ] Gather feedback
- [ ] Address critical bugs
- [ ] Document lessons learned

---

## 16. Budget

### Time Investment
| Phase | Hours |
|-------|-------|
| Foundation | 60h |
| Backend | 50h |
| Frontend | 60h |
| Polish | 30h |
| **Total** | **200h** |

### Infrastructure (Monthly)
| Service | Cost |
|---------|------|
| Neon PostgreSQL | $0-19 |
| Vercel (Frontend) | $0-20 |
| Railway (Backend) | $0-20 |
| Domain | ~$1 |
| **Total** | **~$50/mo** |

---

## 17. Next Steps

### This Week (W1)
- [ ] Initialize monorepo structure
- [ ] Set up Neon database
- [ ] Configure Better Auth
- [ ] Create User model + migration
- [ ] Implement /auth/register endpoint

### Next Week (W2)
- [ ] Complete auth endpoints
- [ ] Build Login/Register forms
- [ ] Implement JWT middleware
- [ ] Set up design tokens
- [ ] Create Button, Input components

### Post v1.0 Roadmap
- Dark mode theme
- Task categories/tags
- Drag & drop reordering
- Recurring tasks
- Team collaboration
- Mobile app (React Native)

---

## 18. Specs Reference

| Feature | Spec Location | Status |
|---------|---------------|--------|
| Auth | `/specs/features/auth.md` | Draft |
| Task CRUD | `/specs/features/task-crud.md` | Pending |
| UI Components | `/specs/features/ui-components.md` | Pending |

---

**Changelog**
| Date | Ver | Change |
|------|-----|--------|
| 2025-12-31 | 1.0 | Initial plan |
