# To-Do List App Overview

## Product Goal
Build a task management app inspired by Apple Reminders, with shared lists, reminders, due dates, recurring tasks, and priority organization. The app should feel fast and simple on mobile and desktop while supporting real-time sync and secure authentication.

## Core Features (MVP)
- User authentication (email/password + magic link or OAuth)
- Personal task lists (Inbox, Today, Scheduled, Completed)
- CRUD for tasks
- Due dates and reminders (date/time)
- Priority levels and tags
- Completion tracking and archive
- Search and filtering
- Responsive UI

## Phase 2 Features
- Shared lists and collaboration
- Subtasks
- Recurring reminders
- Push/email reminders
- Natural language date parsing (e.g., "tomorrow at 9am")
- Offline support with sync recovery

## System Architecture
- Frontend: modern SPA (React + TypeScript recommended)
- Backend API: Node.js service (Express/Fastify/Nest)
- Database/Auth/Storage: Supabase (Postgres, Auth, RLS)
- Deployment: Railway for backend and frontend (or frontend on Vercel and backend on Railway)

## Data Model (high-level)
- users (managed by Supabase Auth)
- lists
- tasks
- task_tags
- reminders
- list_members (for collaboration)

## Non-Functional Requirements
- Secure by default (RLS + JWT validation)
- Fast perceived performance (<200ms for common interactions)
- Strong observability (logs, error reporting, uptime checks)
- Clear CI/CD and environment separation (dev/staging/prod)

## Environment Strategy
- Local development: local frontend + backend, hosted Supabase project
- Staging: separate Railway service + staging Supabase project
- Production: separate Railway service + production Supabase project

## Documentation Map
- `overview.md` - this file
- `frontend.md` - UI/UX and client architecture
- `backend.md` - API/service design
- `supabase-guide.md` - schema, RLS, auth, migrations
- `railway-guide.md` - deploy and runtime config
- `general-testing.md` - test strategy and release checks

## Success Criteria
- User can sign in, create tasks, assign due dates/reminders, and complete tasks across devices with persisted state.
- App deploys reliably from GitHub to Railway.
- Supabase schema and policies prevent unauthorized data access.