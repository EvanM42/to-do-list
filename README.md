# To-Do List App

An Apple Reminders-inspired task management app built with React, Fastify, and Supabase.

## Stack

| Layer    | Technology                                      |
|----------|-------------------------------------------------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS     |
| Backend  | Node.js + Fastify + TypeScript + Zod            |
| Database | Supabase (Postgres + Auth + RLS)                |
| Deploy   | Railway (backend + frontend) or Vercel/Railway  |

---

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. In the SQL editor, run `supabase/migrations/001_initial_schema.sql`
3. Enable **Email/Password** auth under Authentication → Providers

### 2. Backend

```bash
cd backend
cp .env.example .env          # fill in your values
npm install
npm run dev                   # runs on http://localhost:3000
```

**Required env vars** (`.env`):
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env          # fill in your values
npm install
npm run dev                   # runs on http://localhost:5173
```

**Required env vars** (`.env`):
```
VITE_API_BASE_URL=http://localhost:3000
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

---

## Features (MVP)

- **Auth** — Email/password sign up & sign in via Supabase
- **Views** — Inbox, Today, Scheduled, All, Completed
- **Custom Lists** — Create, rename, delete colour-coded lists
- **Tasks** — Create, edit, complete, delete with optimistic UI
- **Due dates** — Date + time picker with overdue highlighting
- **Priority** — None / Low / Medium / High with colour indicators
- **Tags** — Free-form tags per task
- **Notes** — Inline notes field
- **Search** — Client-side search within the active view
- **Task detail** — Slide-in drawer for full editing
- **Responsive** — Sidebar toggles on mobile

---

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── plugins/auth.ts
│   │   ├── modules/lists/    (router, schema, service)
│   │   ├── modules/tasks/    (router, schema, service)
│   │   └── lib/              (db, errors)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/App.tsx
│   │   ├── features/
│   │   │   ├── auth/         (store, AuthPage)
│   │   │   ├── tasks/hooks/  (useTasks, mutations)
│   │   │   └── lists/hooks/  (useLists, mutations)
│   │   ├── components/       (AppShell, SidebarNav, TaskView, …)
│   │   ├── lib/              (supabase, api client, types)
│   │   └── store/ui.ts
│   ├── package.json
│   └── vite.config.ts
│
└── supabase/
    └── migrations/001_initial_schema.sql
```

---

## Deploy (Railway)

1. Push repo to GitHub
2. Create a Railway project, add **two services**: `frontend` and `backend`
3. Set build/start commands:
   - Backend: build `npm run build`, start `npm start`
   - Frontend: build `npm run build`, start (static serve) or use a Nixpacks preset
4. Add environment variables per service (see `.env.example` files)
5. Enable health checks pointing to `GET /health` for the backend

---

## Phase 2 Roadmap

- [ ] Shared lists + collaboration (list_members table ready)
- [ ] Subtasks
- [ ] Recurring reminders
- [ ] Push / email notifications
- [ ] Natural language date parsing ("tomorrow at 9am")
- [ ] Offline support with sync recovery
- [ ] Drag-and-drop task reordering
