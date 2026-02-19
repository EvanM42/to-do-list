# Railway Deployment Guide

## Architecture

Two separate Railway services, one per directory:

| Service | Directory | Build command | Start command | Port |
|---|---|---|---|---|
| Backend | `backend/` | `npm run build` | `npm run start` | auto (`$PORT`) |
| Frontend | `frontend/` | `npm run build` | `npm run start` | 8080 |

---

## Step 1 — Create a Railway Project

1. Go to [railway.app](https://railway.app) and create a new project.
2. Add two services: one for the backend, one for the frontend.
3. Connect your GitHub repo to each service and set the **Root Directory** to `backend/` and `frontend/` respectively.

---

## Step 2 — Backend Service

### Build & Start
Railway auto-detects Node. Set if not auto-detected:
- **Build command:** `npm run build`
- **Start command:** `npm run start`

### Environment Variables
Set these in Railway → Backend Service → Variables:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `SUPABASE_URL` | `https://your-project.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | *(your service role key from Supabase → Settings → API)* |
| `FRONTEND_URL` | *(your Railway frontend public URL, e.g. `https://your-app.up.railway.app`)* |

> `PORT` is injected by Railway automatically — do not set it manually. The backend reads `process.env.PORT` at startup.

### Port
No manual port setting needed. Railway injects `$PORT` and the backend binds to it.

---

## Step 3 — Frontend Service

### Build & Start
- **Build command:** `npm run build`
- **Start command:** `npm run start`

The start script runs `serve -s dist -p 8080`.

### Port
Set Railway → Frontend Service → Settings → **Networking → Port** to **`8080`**.

### Environment Variables
Set these in Railway → Frontend Service → Variables:

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | *(your anon/public key from Supabase → Settings → API)* |
| `VITE_API_BASE_URL` | *(your Railway backend public URL, e.g. `https://your-backend.up.railway.app`)* |

> `VITE_*` variables are embedded at **build time**. They must be set in Railway before the build runs. If you change them, trigger a redeploy.

---

## Step 4 — Connect Frontend → Backend (CORS)

After both services are deployed and have public URLs:

1. Copy the **frontend** Railway URL (e.g. `https://your-app.up.railway.app`).
2. Set `FRONTEND_URL` on the **backend** service to that URL.
3. Redeploy the backend.

This updates the CORS `origin` setting so the backend accepts requests from the deployed frontend.

---

## Step 5 — Supabase Auth Redirect URL

Supabase email confirmation links redirect back to your app. Add the Railway frontend URL to the allow-list:

1. Supabase Dashboard → **Authentication → URL Configuration**
2. Add your Railway frontend URL to **Redirect URLs**:
   ```
   https://your-app.up.railway.app/**
   ```

---

## Deployment Checklist

- [ ] Backend `SUPABASE_URL` set
- [ ] Backend `SUPABASE_SERVICE_ROLE_KEY` set
- [ ] Backend `FRONTEND_URL` set to Railway frontend URL
- [ ] Frontend port set to `8080` in Railway networking
- [ ] Frontend `VITE_SUPABASE_URL` set
- [ ] Frontend `VITE_SUPABASE_ANON_KEY` set
- [ ] Frontend `VITE_API_BASE_URL` set to Railway backend URL
- [ ] Supabase redirect URL updated to Railway frontend URL
- [ ] Both services deployed successfully (green in Railway dashboard)

---

## Accessing the App

Once deployed, the app is accessible at your **frontend** Railway public URL. The backend URL is only used internally by the frontend — users never access it directly.

---

## Re-deploying

Railway redeploys automatically on every push to the connected branch. To trigger a manual redeploy: Railway Dashboard → Service → **Deploy → Redeploy**.

> If you change any `VITE_*` environment variable, you must redeploy the **frontend** service for the change to take effect (values are baked in at build time).
