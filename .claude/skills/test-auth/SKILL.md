---
name: test-auth
description: Manually test the backend auth flow (POST /auth/signup, POST /auth/login, JWT middleware) with curl against the running server. Use when asked to test, check, or debug sign up, log in, tokens, or authenticateToken.
---

# Test the auth endpoints

Start the backend first (see the `run-app` skill). Base URL: `http://localhost:3000`.
Routes live in `backend/src/auth.ts`; the JWT middleware is in `backend/src/middleware.ts`.

Use a throwaway username (for example `test_<timestamp>`) because signups are written to the real Supabase `users` table.

## Sign up

```bash
curl -s -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test_123","password":"pw123"}'
```

| Case | Expected |
|---|---|
| New username | `201 {"message":"User created"}` |
| Same username again | `409 {"error":"Username already taken"}` |
| Missing username or password | `400` |

## Log in

```bash
curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test_123","password":"pw123"}'
```

| Case | Expected |
|---|---|
| Correct credentials | `200 {"token":"<jwt>"}` (expires in 6h) |
| Wrong password or unknown user | `401 {"error":"Invalid username or password"}` |
| `JWT_KEY` missing from secrets.env | `500` |

## Protected routes

`authenticateToken` reads `Authorization: Bearer <token>`:

```bash
curl -s http://localhost:3000/<protected-route> -H "Authorization: Bearer $TOKEN"
```

No token gives `401`, a bad or expired token gives `403`, and a valid one sets `req.user`.
No route uses the middleware yet, so mount it on a route before testing.

## Windows note

In PowerShell, `curl` is an alias for `Invoke-WebRequest`. Use `curl.exe`, or run the commands in Git Bash.

## Cleanup

Tell the user which test usernames were created so they can delete them from Supabase. Don't delete rows yourself unless asked.
