---
name: run-app
description: Start this repo's Express backend (port 3000) and/or Vite React frontend for local development. Use when asked to run, start, or launch the app, backend, frontend, or dev servers.
---

# Run the app

The repo has two separate npm projects. Each needs its own `npm install` the first time.

## Backend (Express + TypeScript, run with tsx)

```bash
cd backend
npm install        # first time only
npm run dev        # tsx watch --env-file=secrets.env src/app.ts
```

- Listens on http://localhost:3000 (hard-coded in `backend/src/app.ts`).
- Requires `backend/secrets.env` (gitignored). It must define `JWT_KEY`, `SUPABASE_URL`, and `SUPABASE_SECRET_KEY`. Never print or commit its values; check only that the keys exist.
- If startup fails with a Supabase error, a variable is missing from `secrets.env`.
- Run it in the background so the session isn't blocked, and stop it when finished.

## Frontend (React 19 + Vite + Tailwind 4)

```bash
cd frontend
npm install        # first time only
npm run dev        # Vite dev server, usually http://localhost:5173
npm run lint       # ESLint
npm run build      # production build into frontend/dist
```

Vite has no proxy configured, so frontend calls to the backend need the full `http://localhost:3000` URL.

## Verify it's up

```bash
curl http://localhost:3000/        # expect: ABOUT
```

To exercise the auth routes, use the `test-auth` skill.
