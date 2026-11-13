-- plans.md Task R1. Paste this whole file into Supabase -> SQL Editor -> Run.
-- Run it AFTER jobs.sql: verify_employer below changes rows in the jobs table,
-- so that table should exist before anyone can call it.
-- Safe to run more than once: "if not exists" / "create or replace" skip or redo what's already there.


-- 1. R1a: three new columns on profiles.
-- every existing profile gets role 'student' and employer_verified false from the defaults.
alter table public.profiles
  add column if not exists role text not null default 'student'
    check (role in ('student', 'employer', 'admin')),
  add column if not exists company_name text,          -- only filled in for employers (JB4)
  add column if not exists employer_verified boolean not null default false;

-- why it's safe to keep role on profiles: profiles has a "read own profile" policy but
-- NO update policy, so nobody can change their own role with the publishable key.
-- if someone adds an "update own profile" policy later (e.g. for edit profile),
-- it must not let people change role, company_name or employer_verified,
-- or anyone could make themselves an admin.


-- 2. R1b: an admin runs this to verify an employer.
-- it marks the employer as verified and opens every job they posted that was waiting.
-- closed jobs stay closed.
create or replace function public.verify_employer(employer_id uuid)
returns void
language plpgsql
-- an empty search_path means every table name below has to say "public." in front,
-- so nobody can trick the function into using a different table with the same name.
set search_path = ''
as $$
begin
  update public.profiles
     set employer_verified = true
   where id = employer_id
     and role = 'employer';

  -- "found" is false if the update above changed no rows: a typo in the id,
  -- or the person isn't an employer. stop with a clear message instead of doing nothing.
  if not found then
    raise exception 'No employer profile with id %', employer_id;
  end if;

  update public.jobs
     set status = 'open'
   where posted_by = employer_id
     and source = 'employer'
     and status = 'pending';
end;
$$;


-- 3. R1c: only admins in the SQL Editor (and our backend's secret key) may run it.
-- Supabase lets anon and authenticated run new functions by default, through
-- <SUPABASE_URL>/rest/v1/rpc/verify_employer.
-- today that call would fail anyway: the function runs with the CALLER's permissions,
-- and RLS (no update policies on profiles or jobs) stops them changing anything.
-- this revoke is a second lock in case that ever changes. NEVER add "security definer"
-- to the function without it: that makes it run with full permissions for whoever calls it,
-- and then any employer really could verify themselves.
-- "public" here means "everyone", not the public schema.
revoke execute on function public.verify_employer(uuid) from public, anon, authenticated;


-- how to use it (don't run these with the rest of the file):
--
--   verify an employer: find their id in Table Editor -> profiles, then
--     select public.verify_employer('paste-their-id-here');
--
--   make someone an admin: only ever by hand, here in the SQL Editor
--     update public.profiles set role = 'admin' where id = 'paste-their-id-here';
