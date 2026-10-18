---
name: supabase-db
description: How this backend talks to Supabase (Postgres) through the shared client in backend/src/db.ts, including the users table, env vars, and query/error conventions. Use when writing or debugging database queries, adding tables, or working on "create actual database" tasks.
---

# Supabase database

## Client

`backend/src/db.ts` exports one shared client:

```ts
import { supabase } from './db.js';   // keep the .js extension: ESM + tsx
```

It uses `SUPABASE_URL` and `SUPABASE_SECRET_KEY` from `backend/secrets.env`. The secret key bypasses Row Level Security, so only use it on the server and never send it to the frontend.

## `users` table (what the code expects)

| column | notes |
|---|---|
| `id` | primary key |
| `username` | must be **unique**. Signup depends on the `23505` unique-violation code |
| `password_hash` | bcrypt hash (cost 10). Never store or return the plain password |

Schema changes are made in the Supabase dashboard (SQL editor or Table editor). The repo has no migrations folder. Write any SQL out for the user to run instead of assuming it has been applied.

## Query conventions (match `backend/src/auth.ts`)

```ts
const { data, error } = await supabase
  .from('users')
  .select('id, username')
  .eq('username', username)
  .maybeSingle();          // null instead of an error when 0 rows

if (error) return res.status(500).json({ error: 'Database error' });
```

- Always destructure `{ data, error }` and check `error` first.
- Use `.maybeSingle()` for "find one or none" lookups.
- Return generic error messages to the client and don't leak `error.message`.
- Postgres code `23505` means a duplicate key, which maps to `409`.
