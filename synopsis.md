# Synopsis

A full-stack task management web app inspired by Apple Reminders. Users sign in, manage personal task lists, set due dates and priorities, and complete tasks across devices with real-time persistence.

---

## Tech Stack

| Layer    | Tech                                                  |
|----------|-------------------------------------------------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS              |
| State    | TanStack Query (server), Zustand (UI)                 |
| Backend  | Node.js, Fastify, TypeScript, Zod                     |
| Database | Supabase (Postgres + Auth + Row Level Security)       |
| Deploy   | Railway (backend + frontend)                          |

---

## Architecture

```
Browser
  └── React SPA (Vite)
        ├── Supabase Auth (sign in/up → JWT)
        └── Fetch + JWT → Fastify API
                          └── Supabase Postgres (service role)
```

Auth flow: the frontend signs users in directly via Supabase Auth and attaches the session JWT as a `Bearer` token on every API request. The backend verifies the JWT before touching any data.

---

## Features (MVP)

- Email/password sign up and sign in
- Five built-in views: **Inbox, Today, Scheduled, All, Completed**
- Custom colour-coded lists
- Tasks with title, notes, due date/time, priority, and tags
- One-tap complete with optimistic UI and rollback
- Inline task detail drawer for editing
- Client-side search within any view
- Skeleton loading and empty states
- Responsive layout with collapsible sidebar

---

## Data Model

| Table          | Key Columns                                                    |
|----------------|----------------------------------------------------------------|
| `lists`        | id, owner_id, title, color                                     |
| `list_members` | list_id, user_id, role (viewer/editor) — collaboration ready  |
| `tasks`        | id, list_id, creator_id, title, notes, priority, due_at, completed_at |
| `task_tags`    | task_id, tag                                                   |
| `reminders`    | task_id, remind_at, channel, sent_at — phase 2                |

Row Level Security enforces that users can only read and write their own data.

---

## Project Layout

```
.
├── backend/          Fastify API
│   └── src/
│       ├── server.ts
│       ├── plugins/auth.ts
│       ├── modules/lists/
│       ├── modules/tasks/
│       └── lib/
│
├── frontend/         React SPA
│   └── src/
│       ├── app/App.tsx
│       ├── components/   (AppShell, Sidebar, TaskView, TaskItem…)
│       ├── features/     (auth, tasks, lists — hooks + stores)
│       └── lib/          (supabase client, API client, types)
│
└── supabase/
    └── migrations/001_initial_schema.sql
```

---

## Phase 2 Roadmap

- Shared lists and multi-user collaboration
- Subtasks
- Recurring reminders
- Push / email notifications
- Natural language date input ("tomorrow at 9am")
- Offline support with sync on reconnect
- Drag-and-drop task reordering
