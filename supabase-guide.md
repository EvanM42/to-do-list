# Supabase Guide

## Objectives
Use Supabase for authentication and Postgres data storage with strict row-level security.

## Setup Checklist
- Create Supabase project (dev first)
- Save project URL, anon key, service role key
- Enable Auth providers (email/password at minimum)
- Create schema + migrations
- Enable and test RLS on all user data tables

## Environment Variables
Backend:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` (optional depending on flow)
- `SUPABASE_SERVICE_ROLE_KEY` (backend only)
- `SUPABASE_JWT_SECRET` (if required by your JWT verification approach)

Frontend:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Schema (starter)
Tables:
- `lists` (id, owner_id, title, color, created_at, updated_at)
- `list_members` (list_id, user_id, role, created_at)
- `tasks` (id, list_id, creator_id, title, notes, priority, due_at, completed_at, position, created_at, updated_at)
- `task_tags` (task_id, tag)
- `reminders` (id, task_id, remind_at, channel, sent_at)

## RLS Policy Intent
- Users can read/write their own lists
- Shared list members can read/write according to role
- Users can only access tasks tied to authorized lists
- Users can only access reminders tied to authorized tasks

## Migration Workflow
- Keep SQL migrations in version control
- Apply migrations to dev first
- Run policy tests before staging/prod promotion
- Never apply manual production schema changes outside migration history

## Local Development
- Use Supabase hosted project or local Supabase CLI stack
- Seed minimal data for realistic task/list scenarios
- Create a script for deterministic seed resets

## Data Integrity Practices
- Foreign keys with cascade rules where appropriate
- Unique constraints (e.g., list membership uniqueness)
- Indexed fields used in filters (due_at, completed_at, list_id)

## Backup and Recovery
- Enable backups per Supabase plan
- Define restore procedure and test periodically
- Keep migration history complete for rebuild confidence

## Definition of Done (Supabase)
- Schema migrated and versioned
- RLS enforced and tested
- Auth works for sign-up/sign-in/session refresh
- Dev/staging/prod projects separated