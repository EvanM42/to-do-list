# Frontend Guide

## Objectives
Create a fast, clean Reminders-like interface optimized for quick capture and daily review.

## Recommended Stack
- React + TypeScript
- Vite for build tooling
- React Router for views
- TanStack Query for server state
- Zustand or Redux Toolkit for local UI state
- Tailwind CSS or CSS Modules for styling

## UX Structure
Primary views:
- Inbox
- Today
- Scheduled
- All
- Completed
- Custom Lists

Task interactions:
- Quick add input
- Inline edit (title, notes, due date, priority, tags)
- One-tap complete
- Drag and drop ordering (optional phase 2)

## Component Architecture
Suggested component tree:
- `AppShell`
- `SidebarNav`
- `TaskView`
- `TaskList`
- `TaskItem`
- `TaskComposer`
- `TaskDetailDrawer`
- `DateTimePicker`
- `PrioritySelector`

## State Design
- Server state: tasks/lists/reminders from backend API
- Local state: open panels, filters, sort mode, temporary input state
- Optimistic updates for complete/edit actions with rollback on failure

## API Contract Expectations
Frontend should call backend endpoints such as:
- `GET /lists`
- `POST /lists`
- `GET /tasks?view=today`
- `POST /tasks`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`
- `POST /tasks/:id/complete`

## Authentication Flow
- Sign in/up via Supabase Auth (through backend-validated JWT flow)
- Store session securely (httpOnly cookie preferred via backend)
- On load, request current session user and hydrate app state

## Error/Loading/Empty States
- Skeleton loading for task list
- Inline errors for failed writes
- Empty-state prompts for new users (e.g., "Add your first reminder")

## Accessibility Requirements
- Keyboard-first task input and navigation
- Visible focus states
- Screen-reader labels for task actions
- Sufficient contrast in all themes

## Frontend Project Layout (example)
- `src/app`
- `src/features/tasks`
- `src/features/lists`
- `src/features/auth`
- `src/components`
- `src/lib/api`
- `src/lib/types`
- `src/styles`

## Definition of Done (Frontend)
- All core task flows are responsive and accessible
- API errors are handled gracefully
- No blocking console errors/warnings in production build