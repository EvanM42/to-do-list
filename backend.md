# Backend Guide

## Objectives
Provide a secure, reliable API that supports Reminders-style task workflows and enforces user-level access control.

## Recommended Stack
- Node.js + TypeScript
- Fastify or Express
- Zod for request validation
- Supabase Postgres as primary DB
- Supabase Auth JWT validation middleware

## Responsibilities
- Authenticate requests
- Authorize list/task access
- Expose task/list/reminder endpoints
- Handle reminder scheduling hooks (phase 2)
- Provide health and readiness endpoints for Railway

## API Modules
- `auth` - session/user identity
- `lists` - list CRUD + memberships
- `tasks` - task CRUD + completion
- `reminders` - due/reminder times
- `search` - task search/filter

## Endpoint Set (starter)
- `GET /health`
- `GET /me`
- `GET /lists`
- `POST /lists`
- `PATCH /lists/:id`
- `DELETE /lists/:id`
- `GET /tasks`
- `POST /tasks`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`
- `POST /tasks/:id/complete`

## Validation + Error Handling
- Validate all body/query params with schema
- Return consistent error shape:
  - `code`
  - `message`
  - `details` (optional)
- Distinguish auth errors (401), forbidden (403), not found (404), validation (422)

## Security Requirements
- Verify Supabase JWT on every protected route
- Enforce ownership or membership checks before reads/writes
- Apply least privilege in SQL and service roles
- Avoid exposing service-role key to frontend

## Observability
- Structured JSON logs
- Request ID propagation
- Error tracking (Sentry or equivalent)
- Basic metrics: latency, error rate, throughput

## Suggested Backend Layout
- `src/server.ts`
- `src/plugins/auth.ts`
- `src/modules/lists/*`
- `src/modules/tasks/*`
- `src/modules/reminders/*`
- `src/lib/db.ts`
- `src/lib/logger.ts`
- `src/lib/errors.ts`

## Definition of Done (Backend)
- Authenticated user can only access authorized lists/tasks
- Endpoints have validation + integration tests
- Railway deploy includes health checks and env var validation