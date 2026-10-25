-- plans.md Task S2. Paste this whole file into Supabase -> SQL Editor -> Run.
-- Run it BEFORE giving the publishable key to the frontend team (see "ORDER MATTERS" in plans.md).
-- It's safe to run more than once: "if not exists" / "drop policy if exists" skip what's already there.


-- 1. protect the old users table first.
-- it has password hashes and RLS is off, so anyone with the publishable key could read it.
-- our backend uses the secret key, which skips RLS, so signup/login keep working.
-- with RLS on and no policies, nobody using the publishable key can read or write it.
alter table public.users enable row level security;


-- 2. one row per logged-in person.
-- id is the same UUID Supabase gives the user in auth.users, so we never use email as the key
-- (email can be missing, and the same person can log in with different providers).
-- "on delete cascade" means if the user is deleted in Supabase Auth, their profile goes too.
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text,                -- can be null (e.g. a private GitHub email)
  username     text unique,         -- the user picks this later, so it starts null
  display_name text,                -- nullable on purpose: /auth/me only inserts { id, email }
  avatar_url   text,
  created_at   timestamptz not null default now()
);


-- 3. RLS on the new table too, for the same reason as step 1.
alter table public.profiles enable row level security;


-- 4. a logged-in user may READ only their own row (handy if the frontend ever reads it directly).
-- "(select auth.uid())" is the id inside the user's Supabase token.
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

-- no insert or update policies on purpose:
-- every write goes through our backend (GET /api/auth/me, later an edit-profile route),
-- so the backend can check things first. With no policy, the browser can't write here
-- directly with the publishable key and skip those checks.
