Anthony: Sign Up, Sign in, database
Sign Up steps:
    check if user exists
    hash the password using brcypt
    save the user to a mock data base

Log in steps:
    find the username in database
    make sure the password matches
    generate the jwt token (Jayden will create jwt)
    send token back to client

Create actual database

Code review fixes (from code-reviewer on Anthony-work, 2026-10-18)
    Each task below only touches the files listed in it, so different
    people/agents can work on different tasks at the same time without
    editing the same file. Don't edit files outside your task.

    Shared contract (keep these the same so tasks don't break each other):
        POST /auth/signup   body: { username, password }   -> 201/200, or { error } with 400/409/500
        POST /auth/login    body: { username, password }   -> { token }, or { error } with 400/401/500
        Token payload: { username }   (matches TokenPayload in middleware.ts)

    [x] Task 1 - JWT payload name mismatch            files: backend/src/auth.ts
        login now signs { username: user.username } to match TokenPayload. Done.

    [x] Task A - auth input checks + generic errors   files: backend/src/auth.ts  (Anthony)
        A1. signup and login: return 400 unless username and password are non-empty strings
            (login currently has no missing-field check at all)
        A2. optional: reject passwords longer than 72 bytes (bcrypt ignores the rest)
        A3. line ~77: change "Key does not exist" to a generic "Server error",
            console.error the real reason

    [x] Task B - remove dead static line              files: backend/src/app.ts
        B1. line 14: remove express.static('frontend') (points at a folder that doesn't exist). Done.

    [x] Task C - clean up root package.json           files: package.json, package-lock.json (repo root)
        [x] C1. revert the added bcrypt, bcryptjs, dotenv, express, jsonwebtoken, next-auth
            (the real ones are in backend/package.json)
        [x] C2. reopened by second review: root files still differ from main
            (@types/bcrypt added, next-auth removed, ~20 lines of npm init metadata,
            ~1900-line lockfile diff). From the repo root run:
                git checkout main -- package.json package-lock.json
            then `git diff main -- package.json package-lock.json` should print nothing.
            Removing express.js / next-auth for real is a separate team decision, not this task.
        [x] C3. third review: local main was 34 commits behind GitHub, so C2 "reverted" to an
            old version. Fixed by restoring the root files to this branch's version
            (= origin/main) and moving local main to origin/main. The PR now doesn't touch them.
            Always compare against origin/main: `git diff origin/main -- <file>`

    Second review fixes (code-reviewer, 2026-10-18)

    [x] Task D - log errors + login fixes             files: backend/src/auth.ts  (Anthony)
        D1. console.error the Supabase error before each "Database error" 500
            (signup lookup, signup insert, login lookup) so the terminal shows why it failed.
            Client message stays generic.
        D2. only enforce the 72-byte password limit on /signup, not /login,
            so accounts made before the limit can still log in
            (e.g. give checkCredentials a flag, or do the length check in /signup only)
        D3. optional: stop login timing from revealing which usernames exist:
            always run bcrypt.compare, against a dummy hash made once at startup
            when the user isn't found, then `if (!user || !match) return 401`

    [x] Task E - catch-all error handler              files: backend/src/app.ts
        E1. after the routes, add a final error handler that console.errors the error
            and returns 500 { error: 'Server error' } instead of Express's
            default HTML page with a stack trace

    Jayden:
        middleware.ts:27 has the same "Token Key does not exist" message as A3
            -> console.error the real reason, return 500 { error: 'Server error' }
        middleware.ts:32 returns 403 for an invalid/expired token, 401 is the usual code
        middleware.ts:19 comment says the header is "Bearer: token", it's "Bearer token" (no colon)
        (authenticateToken isn't used on any route yet, so none of these break anything today)

    Not ours - pass to the frontend team (Anthony and Jayden are backend only):
        Login.jsx / Signup.jsx don't call the backend yet, they just navigate to /Feed
        The forms send "email" but the backend expects "username"
        Frontend on :5173 needs a Vite proxy (or backend CORS) to reach :3000

SSO login (planned 2026-10-19) - replaces username/password with Supabase Auth
    Full explained plan: https://claude.ai/artifact/GpzZCXLLkqfbSs4iJTWUdh
    $0 budget: free tiers only. Never enter a credit card. Apple is skipped ($99/yr).
    Providers: google, github, linkedin_oidc, azure (skip azure if it asks for a card)
    Start with Google only, end to end, then add the others (dashboard work, no code changes).
    Each task only touches the files listed, so tasks can run in parallel.

    New shared contract (replaces the one above once SSO ships):
        Backend routes move under /api (done as part of S4), because the frontend's
        /auth/callback page also starts with /auth: a Vite proxy for "/auth" would send the
        login redirect to Express and it would 404. Frontend proxies only "/api".
        authenticateToken sets  req.user = { id: string, email: string | null }   (id = auth.users.id)
        GET /api/auth/me  protected -> { id, email, username, display_name, avatar_url },
                          creates profile on first call; errors: { error } with 401/500
        Frontend sends  Authorization: Bearer <supabase access_token>

    ORDER MATTERS: run S2 (RLS on) BEFORE S1c (handing out the publishable key).
        public.users has password hashes and RLS off. Anyone with the publishable key
        could read them at <SUPABASE_URL>/rest/v1/users until RLS is on.

    [ ] Task S1 - Supabase dashboard setup             files: none (dashboard only)  (Anthony)
        [x] S1a. Authentication -> URL Configuration: Site URL http://localhost:5173,
             add redirect URL http://localhost:5173/**
        [x] S1b. Google Cloud Console: make a free OAuth "Web application" client
             (redirect URI = the callback shown in Supabase's Google provider page).
             Don't turn on billing. Paste client ID + secret into Supabase, enable Google.
        S1c. ONLY AFTER S2c: copy the PUBLISHABLE key for the frontend team.
             never share the secret key.

    [x] Task S2 - profiles table                       files: backend/sql/profiles.sql (new)  (Anthony)
        [x] S2a. SQL written in backend/sql/profiles.sql (profiles keyed to auth.users.id,
             RLS on, read-own-row policy only, no insert/update policies: all writes go
             through our backend, which uses the secret key)
        [x] S2b. the same file also turns on RLS for public.users
        [x] S2c. read it through, then run it in the Supabase SQL Editor

    [x] Task S3 - server-side client options           files: backend/src/db.ts  (Anthony)
        S3a. createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } })

    [ ] Task S4 - GET /api/auth/me                     files: backend/src/auth.ts, backend/src/app.ts  (Anthony)
        needs: S2 run, and Jayden's J1a merged FIRST (S4 uses req.user.id, which doesn't
        exist on TokenPayload until J1a; tsx runs anyway but tsc fails). J1b for real tokens.
        S4a. app.ts: app.use('/api/auth', authRouter)  (see shared contract)
        S4b. add GET /me behind authenticateToken
        S4c. look up profiles by req.user.id with .maybeSingle(); if none,
             .insert({ id, email }).select().single() and return it
        S4d. if the insert fails with 23505 (two first visits at once), select the row again
             and return it instead of an error
        S4e. usual style: { data, error }, console.error the real error, generic message

    [ ] Task J1 - middleware uses Supabase tokens      files: backend/src/middleware.ts  (Jayden)
        J1a. TokenPayload -> { id: string; email: string | null }   (merge this before S4)
        J1b. authenticateToken becomes async: Bearer header -> 401 if missing ->
             const { data, error } = await supabase.auth.getClaims(token) ->
             401 if (error || !data)   <- getClaims can return no data AND no error ->
             req.user = { id: data.claims.sub, email: data.claims.email ?? null } -> next()
        J1c. drop the jsonwebtoken import and the JWT_KEY check
             (this also fixes the 3 items in the "Jayden:" list above)

    [ ] Task S5 - remove old password login            files: backend/src/auth.ts, backend/package.json  (Anthony)
        needs: Google working end to end AND J1 merged
        S5a. delete /signup, /login, checkCredentials, dummyHash
        S5b. npm uninstall bcrypt @types/bcrypt jsonwebtoken @types/jsonwebtoken
        S5c. remove JWT_KEY from secrets.env, update the shared contract above
        S5d. once nothing uses it: drop table public.users

    [ ] Task S6 - more providers                       files: none (dashboard only)  (Anthony)
        S6a. GitHub -> S6b. LinkedIn (linkedin_oidc) -> S6c. Microsoft (azure, stop if it asks for a card)

    Not ours - pass to the frontend team:
        [x] install @supabase/supabase-js, shared client with the publishable key (flowType 'pkce')
            (Kevin, frontend/src/supabase.js; exports null if .env.local is missing)
        [x] Google buttons on Login.jsx and Signup.jsx call signInWithOAuth (done 2026-10-24)
        [x] /auth/callback page: not needed. Google redirects back to /login, which finishes
            the login (useEffect + getSession) and goes to /feed
        [ ] Vite proxy for /api (NOT /auth), Bearer header on backend calls (after S4)
        [ ] put Supabase values in frontend/.env.local (after S1c)

Jobs: outside sources + employer postings (planned 2026-11-13) - frontend/plans.md B3 + B6
    Real jobs come from two places and land in one jobs table:
        1. official public job APIs (no scraping: LinkedIn, Indeed, Handshake, Glassdoor are out)
        2. employers posting directly. They pick Employer at signup, and their jobs stay
           'pending' (hidden) until an admin verifies them, so fake listings can't reach students.
    $0 budget, no new npm packages (Node's built-in fetch). API keys go in secrets.env,
    added by hand: USAJOBS_API_KEY, USAJOBS_EMAIL, ADZUNA_APP_ID, ADZUNA_APP_KEY.

    Sources and their rules (checked 2026-11-13):
        Greenhouse  boards-api.greenhouse.io/v1/boards/{token}/jobs?content=true   no key, one company per call
        Lever       api.lever.co/v0/postings/{site}?mode=json                     no key, one company per call
        USAJOBS     data.usajobs.gov/api/search?HiringPath=student;graduates      free key; headers Host,
                    User-Agent (= the email used to sign up for the key), Authorization-Key
        Adzuna      api.adzuna.com/v1/api/jobs/us/search/{page}?what=intern        free key, free tier is for
                    evaluation/academic use; every Adzuna listing must show an "Adzuna" label linked to adzuna.com
        Every outside job shows its source and links out to the original posting.

    Shared contract additions (copy into frontend/plans.md once agreed):
        Job also has  source: 'employer' | 'greenhouse' | 'lever' | 'usajobs' | 'adzuna'
                      status: 'pending' | 'open' | 'closed'
        Job ids are uuid strings, not numbers
        Job drops is_posted (status already says whether a job is visible)
        GET  /api/jobs                  also takes q= (search) and page=; only returns open jobs
                                        50 per page, newest first; fewer than 50 back = last page
                                        level=college or level=high-school also returns 'both' jobs
                                        empty filters (?type=) count as no filter
        GET  /api/jobs/:id              open AND closed jobs (check status), never pending; else 404
                                        a past-deadline job still says status 'open' here (the list
                                        hides it): check deadline too before showing Apply
        apply_url is always http:// or https:// (jobs.sql step 3)
        GET  /api/jobs/mine             (employer)  -> { jobs: [Job] }, every status
        POST /api/auth/employer-request (student)   body { company_name } -> { profile }

    ORDER: run jobs.sql BEFORE roles.sql (verify_employer in roles.sql updates the jobs table,
    so that table has to exist first).

    [x] Task JB1 - jobs table                          files: backend/sql/jobs.sql (new)  (Anthony)
        JB1a. columns from the contract's Job, plus source, external_id, status, last_seen_at
        JB1b. unique (source, external_id) so re-imports update rows instead of copying them
        JB1c. RLS on, no policies (same as profiles: only the backend reads and writes)

    [x] Task R1 - roles on profiles                    files: backend/sql/roles.sql (new)  (Anthony)
        R1a. profiles: role ('student' | 'employer' | 'admin', default 'student'),
             company_name, employer_verified (default false)
        R1b. verify_employer(user id): sets employer_verified and opens that employer's pending jobs.
             An admin runs it in the SQL Editor for now.
        R1c. revoke execute on verify_employer from public, anon, authenticated
             (otherwise anyone with the publishable key could call it at /rest/v1/rpc)

    [ ] Task JB2 - importer                            files: backend/src/job-sources/ (new folder),
                                                              backend/src/import-jobs.ts (new),
                                                              backend/package.json (scripts only)  (Anthony)
        JB2a. one file per source that turns that API's shape into ours; keep only intern/co-op titles
        JB2b. import-jobs.ts, per source: fetch -> drop duplicate ids -> upsert -> close jobs the
              source no longer lists (only if every fetch for that source worked)
        JB2c. "import-jobs" script; run it by hand for now (not on startup: tsx watch restarts
              on every save and would use up Adzuna's daily limit)
        Progress (2026-11-13):
            [x] shared.ts, greenhouse.ts (10 boards), lever.ts (3 sites), import-jobs.ts, the script
            [x] first real run against Supabase: greenhouse 131, lever 67
            [ ] usajobs.ts and adzuna.ts, after their free keys are in secrets.env

    [x] Task JB3 - read routes                         files: backend/src/jobs.ts (new),
                                                              backend/src/app.ts (one line)  (Anthony)
        JB3a. app.use('/api/jobs', jobsRouter)
        JB3b. GET /: open jobs only, hides past deadlines, 400 on unknown filter values,
              q stripped to letters/digits/spaces/hyphens, 50 per page
        JB3c. GET /:id: check it's a uuid first (404, not a Postgres error turned into a 500)

    [ ] Task J2 - requireRole middleware (= B4)        files: backend/src/middleware.ts  (Jayden)
        needs: J1, R1
        J2a. requireRole(...roles): look up profiles.role by req.user.id, 403 if not allowed,
             set req.role and req.employerVerified. Supabase tokens don't carry our roles,
             so this has to read the table.

    [ ] Task JB4 - employer request                    files: backend/src/auth.ts  (Anthony)
        needs: J1, S4, R1
        JB4a. POST /employer-request { company_name }: only while role is 'student' (else 409);
              sets role 'employer', company_name, employer_verified false. Can never set admin.

    [ ] Task JB5 - employer and admin routes           files: backend/src/jobs.ts  (Anthony)
        needs: JB3, J2, JB4
        JB5a. GET /mine (employer), defined BEFORE /:id so Express doesn't read "mine" as an id
        JB5b. POST / (employer): copy only the allowed fields, never insert req.body directly.
              The server sets source, posted_by, organization (from the profile, never the body)
              and status ('open' if verified, otherwise 'pending')
        JB5c. PATCH /:id and POST /:id/close (owner or admin), employer jobs only
        JB5d. DELETE /:id (admin) -> 204

    Not ours - pass to the frontend team:
        [ ] F10: ids are uuid strings (Discovery.jsx uses Number(?job=), ApplicationTracker only
            looks jobs up in opportunities.js). Fields follow the contract (location, pay_text).
            Outside jobs have no match/tags and may have null deadline, setting, paid, pay_text.
        [ ] F10: a source label on every outside job; the Adzuna label on Adzuna jobs; Apply opens
            apply_url in a new tab; never render description as HTML
        [ ] Signup: Student / Employer choice (save it before the Google redirect); employers then
            enter a company name -> POST /api/auth/employer-request
        [ ] PRODUCT.md: the "every job is made up and labeled an example" rule changes