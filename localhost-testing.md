# Localhost Testing — What Was Done

## Summary

Full end-to-end API testing was run against both the frontend dev server and backend API running locally. 97 tests passed. One bug was found and fixed.

---

## Servers Started

| Service | Command | Port |
|---|---|---|
| Backend (Fastify) | `cd backend && npm run dev` | http://localhost:3000 |
| Frontend (Vite) | `cd frontend && npm run dev` | http://localhost:5173 |

The backend uses `tsx watch src/server.ts` for hot-reload. The frontend uses Vite's HMR dev server. Both servers were stopped after testing was complete.

---

## Bug Found and Fixed

### `POST /tasks/:id/complete` and `POST /tasks/:id/uncomplete` → 500

**Root cause:** `frontend/src/lib/api/client.ts` always sent the `Content-Type: application/json` header on every request, including bodyless POST calls (complete/uncomplete send no body). Fastify's strict JSON body parser rejects this combination with `FST_ERR_CTP_EMPTY_JSON_BODY`.

**Fix applied** in `frontend/src/lib/api/client.ts`:
```ts
// Before (broken)
headers: {
  'Content-Type': 'application/json',   // always sent
  ...
}

// After (fixed)
headers: {
  ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
  ...
}
```

`Content-Type: application/json` is now only sent when a body is actually present.

---

## Test Coverage (97/97 PASSED)

### Health & Auth
- `GET /health` returns `{ status: "ok" }`
- `GET /me` returns authenticated user
- No token → 401 with `UNAUTHORIZED` code
- Bad/expired token → 401 with `UNAUTHORIZED` code
- CORS: `Access-Control-Allow-Origin: http://localhost:5173` confirmed

### Lists CRUD
- `POST /lists` creates list with auto-generated color
- `POST /lists` with custom color persists it
- `GET /lists` returns all user lists
- `GET /lists/:id` returns correct list
- `PATCH /lists/:id` updates title and color
- Empty title → 422
- Missing title → 422
- Non-existent list → 404

### Tasks CRUD
- `POST /tasks` minimal (title only) — default priority `none`, null `completed_at`, null `list_id`
- `POST /tasks` with all fields (title, notes, priority, due_at, tags, list_id) — all fields persisted
- Tags saved correctly as `task_tags` array
- `GET /tasks/:id` returns task with tags joined
- Non-existent task → 404

### View Filtering
| View | Behaviour confirmed |
|---|---|
| `inbox` | Tasks with no `list_id`, `completed_at = null` |
| `today` | Tasks with `due_at ≤ end of today`, `completed_at = null` (includes overdue) |
| `scheduled` | All tasks with a `due_at`, `completed_at = null` |
| `all` | All incomplete tasks regardless of list or due date |
| `completed` | Tasks with `completed_at` set |
| `?list_id=` | Tasks belonging to a specific list |

### Search
- Case-insensitive partial match on title
- No match returns empty array

### Update Task
- PATCH title, notes, priority individually
- PATCH replaces tags (full replace, not append)
- PATCH clears tags with `tags: []`
- PATCH clears `due_at` with `due_at: null`
- PATCH moves task to a different list
- PATCH moves task to inbox with `list_id: null`

### Complete / Uncomplete
- `POST /tasks/:id/complete` → sets `completed_at`, 200
- Task disappears from `inbox`, `all`, `today`, `scheduled` views
- Task appears in `completed` view
- `POST /tasks/:id/uncomplete` → clears `completed_at`, 200
- Task reappears in `inbox` view

### Validation
- Empty title → 422
- Missing title → 422
- Invalid priority value → 422
- Non-UUID `list_id` → 422
- Invalid `due_at` format → 422
- Empty PATCH title → 422
- Invalid `view` query param → 422
- Title over 500 chars → 422

### Delete
- `DELETE /tasks/:id` → 204
- Accessing deleted task → 404
- `DELETE /lists/:id` → 204
- Accessing deleted list → 404
- Deleting non-existent resource → 404

---

## TypeScript
Both `frontend/` and `backend/` pass `tsc --noEmit` with zero errors.
