-- plans.md Task JB1. Paste this whole file into Supabase -> SQL Editor -> Run.
-- Run it before roles.sql: verify_employer in roles.sql changes rows in this table.
-- (Postgres only looks for the table when that function actually runs, but keeping the
-- order means nobody can call it before the table is there.)
-- Safe to run more than once. But "if not exists" means a column you change inside
-- "create table" later won't be applied to the table that already exists: use a separate
-- "alter table" step for that, like step 3 below.


-- 1. one table for every job, whether an employer posted it or the importer pulled it in.
create table if not exists public.jobs (
  -- a random uuid instead of 1, 2, 3 (the contract says ids are uuid strings)
  id            uuid primary key default gen_random_uuid(),

  -- fields from the shared contract's Job
  title         text not null,
  organization  text not null,
  type          text not null check (type in ('internship', 'co-op', 'research', 'program')),
  level         text not null check (level in ('high-school', 'college', 'both')),

  -- outside sources often leave these out, so they can be null.
  -- a check like "setting in (...)" still passes when the value is null.
  location      text,
  setting       text check (setting in ('remote', 'hybrid', 'on-site')),
  paid          boolean,
  pay_text      text,
  deadline      date,         -- a real date type, so "hide past deadlines" is a simple compare
  description   text,

  -- a list of strings, like requirements in opportunities.js.
  -- an empty list instead of null, so the frontend's .map() doesn't crash on outside jobs.
  requirements  text[] not null default '{}',

  apply_url     text,
  -- the employer who posted it. if their profile is deleted, their jobs go too
  -- (nobody else could edit or close them).
  posted_by     uuid references public.profiles(id) on delete cascade,
  created_at    timestamptz not null default now(),

  -- new columns for JB1a
  source        text not null check (source in ('employer', 'greenhouse', 'lever', 'usajobs', 'adzuna')),
  external_id   text,         -- the job's id on the outside site. null for employer jobs
  -- defaults to 'pending' so a job is hidden unless something deliberately opens it
  status        text not null default 'pending' check (status in ('pending', 'open', 'closed')),
  last_seen_at  timestamptz,  -- when the importer last saw it. null for employer jobs

  -- JB1b: an outside job can only be in here once, so re-imports update the row instead of copying it.
  -- employer jobs all have external_id = null, and Postgres never counts two nulls as duplicates,
  -- so this doesn't stop employers from posting more than one job.
  -- keep this a plain unique rule (not a partial index): the importer's
  -- .upsert(rows, { onConflict: 'source,external_id' }) only works with a plain one.
  unique (source, external_id),

  -- employer jobs have an owner and no outside id. outside jobs are the other way round,
  -- and must link to the original posting (plans.md: "links out to the original posting").
  check (
    (source = 'employer' and posted_by is not null and external_id is null)
    or
    (source <> 'employer' and posted_by is null and external_id is not null and apply_url is not null)
  )
);


-- 2. JB1c: RLS on, no policies (same as profiles).
-- our backend uses the secret key, which skips RLS. the publishable key can't read or write here,
-- so pending (unverified) jobs can't leak out through <SUPABASE_URL>/rest/v1/jobs.
alter table public.jobs enable row level security;


-- 3. apply_url has to be a normal web link (http:// or https://).
-- the frontend opens it in a new tab, and a link like "javascript:..." would run code
-- on our site instead. employers will type this field themselves (JB5), so the database
-- checks it, not just our routes.
-- it's an "alter table" step (not inside "create table" above) so it also gets added to
-- the table we already made. drop-then-add makes it safe to run again.
alter table public.jobs drop constraint if exists jobs_apply_url_is_web_link;
alter table public.jobs add constraint jobs_apply_url_is_web_link
  check (apply_url is null or apply_url ~* '^https?://');   -- ~* = matches this pattern, any case
