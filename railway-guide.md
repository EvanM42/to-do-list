# Railway Guide

## Objectives
Deploy the app from GitHub to Railway with predictable environments and secure secret management.

## Project Structure Strategy
Option A:
- Frontend and backend as separate Railway services

Option B:
- Backend on Railway, frontend on another host (Vercel/Netlify)

Use Option A if you want one deployment platform for both components.

## Railway Setup Checklist
- Connect GitHub repo to Railway
- Create services (`frontend`, `backend`)
- Configure build/start commands for each service
- Add environment variables per service
- Configure domains and HTTPS

## Required Backend Env Vars
- `NODE_ENV`
- `PORT`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY` (if needed)
- `JWT_AUDIENCE` / `JWT_ISSUER` (if used)

## Required Frontend Env Vars
- `VITE_API_BASE_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Deployment Workflow
- Use `main` for production deploys
- Use `develop` (or PR previews) for staging
- Require passing tests before merge
- Monitor deploy logs and health checks after rollout

## Health Checks
Backend should expose:
- `GET /health` for liveness
- `GET /ready` (optional) for dependency readiness

Railway should target the health endpoint to detect bad deploys quickly.

## Secrets Management
- Store all secrets in Railway variables, never in repo
- Rotate Supabase service key on exposure risk
- Keep separate secrets for each environment

## Rollback Strategy
- Keep previous successful deployment IDs documented
- On severe regression, rollback immediately then investigate
- Track incident notes and fixes in repo docs/issues

## Definition of Done (Railway)
- GitHub-connected auto-deploy configured
- Environment variables validated at startup
- Health checks operational
- Staging and production environments separated