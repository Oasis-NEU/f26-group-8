# f26-group-8

Oasis NEU group project: a social/networking web app with a React frontend and an Express backend.

## Layout

Two separate npm projects, each with its own `package.json` and `node_modules`:

- `frontend/` — React 19 + Vite + Tailwind 4, routing with `react-router`. Pages in `src/pages/`, shared components in `src/components/`, routes in `src/App.jsx`.
- `backend/` — Express 5 + TypeScript (ESM, run with `tsx`, no build step), Supabase (Postgres) for data, bcrypt for passwords, jsonwebtoken for auth.
  - `src/app.ts` — server entry, port 3000
  - `src/auth.ts` — `/auth/signup`, `/auth/login`
  - `src/middleware.ts` — `authenticateToken` (JWT Bearer check)
  - `src/db.ts` — shared Supabase client
  - `plans.md` — current backend task list

The root `package.json` is leftover and not used to run anything.

## Commands

```bash
cd backend  && npm run dev     # http://localhost:3000
cd frontend && npm run dev     # http://localhost:5173
cd frontend && npm run lint
```

## Secrets

`backend/secrets.env` (gitignored) holds `JWT_KEY`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`. Never read, print, or commit it.

## Conventions

- Code is written by students learning as they go, and is heavily commented in plain language explaining *why* (see `frontend/src/App.jsx`). Match that style in new code.
- Backend relative imports use the `.js` extension (`import { supabase } from './db.js'`).
- Supabase calls destructure `{ data, error }`, check `error` first, and return generic error messages to the client.
- Prefer explaining changes and showing snippets over editing files directly; team members usually type the code themselves.

## Team

Work is split by feature. Anthony: sign up, log in, database. Jayden: JWT.
Stay inside the task you're asked about; don't refactor other people's areas.
