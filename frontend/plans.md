Phase two build plan (written 2026-10-26)
    What to build next and how, task by task, using the way this project already works.
    The "why" behind it (stakeholders, the login decision, ScoutCoach) is in the
    Phase Two Plan doc: https://claude.ai/artifact/3eCnALnwEjLgmRKqhZcrbe
    Roles and permissions: https://claude.ai/artifact/NtQNQjcXfnghXhAC1optbw
    Backend tasks already planned (J1, S4, S5, S6) live in backend/plans.md. This file
    does not repeat them; it says which frontend tasks wait on them.

    Like backend/plans.md: each task lists the files it touches, so different people
    (or Claude sessions) can work on different tasks at the same time without editing
    the same file. Don't edit files outside your task. index.css is the exception:
    everyone adds to it, but each task only adds its own page's section.


How to work a task (for teammates and for Claude)
    Before starting
        - Read .claude/skills/scoutsearch-frontend/SKILL.md (the house rules) and the task below.
        - Check the task's "needs". If a needed task isn't done, build with sample data and
          leave a "LATER:" comment where the real call goes (Login.jsx's handleReset is the model).
        - Check the owner. Pages belong to people (Kevin: About, Login, Signup, Network, Messages;
          Roemer: Feed, Profile, EditProfile, NavBar styles). Shared files (App.jsx, NavBar.jsx,
          AccountMenu.jsx, vite.config.js, package.json) get a one-line change and a note in the PR.
        - Ask the teammate: "Do you want to type it, or should I build it and walk you through it?"
        - New page: run the frontend-design skill (short plan + ASCII sketch, confirm, then build).
          Changing an existing page: impeccable. Motion details: emil-design-eng. The SKILL.md
          rules win over all three.
    Building
        1. CSS first: a new "/* ---------- Page name ---------- */" section in index.css with
           page-prefixed, plain-English class names (apply-job-card, not card). Comment every
           rule and property. Colors only from :root variables. Write the measured contrast ratio
           next to every text color (measure it; don't guess).
        2. Then the JSX, in the page layout from SKILL.md: comment, imports, sample data, pieces,
           whole page, export. New files use 4-space indents and single quotes (like Login,
           Network, Messages). Comment every block in plain words; mark accessibility with (WCAG).
        3. Route in App.jsx with the usual comment. Lowercase paths. Give the page a <title>.
        4. Motion goes inside @media (prefers-reduced-motion: no-preference), and :active presses
           also check :root:not([data-reduce-motion="on"]) (the Settings page's own switch).
        5. No new npm packages without the team agreeing. Everything below is planned to need none.
    Before calling it done
        - cd frontend && npm run lint   -> 0 problems
        - npm run build                 -> "built in ..."
        - npm run check (after F0a)     -> every page loads, no console errors, no sideways scroll
        - Tab through the new page: every stop has an outline, in a sensible order
        - 375px wide: nothing spills off the side
        - The WCAG checklist in SKILL.md
        - Don't commit unless asked. Give a commit message. Run the code-reviewer agent before a PR.


Decisions needed (from the Phase Two Plan doc; tasks that wait on one say so)
    [ ] D1. Email and password boxes: A remove, B Supabase email login (proposed), C keep custom login
    [ ] D2. The permissions table (Access Roles doc + the new rows in the Phase Two doc)
    [ ] D3. Does ScoutCoach's AI fit the $0 budget? (blocks F16 and B10 only)
    [ ] D4. Owners for the new pages (F1-F6)
    [ ] D5. Jake's template: confirm the MIT license in jakegut/resume, keep its copyright notice
    [ ] D6. Top bar: which new pages get a top-bar link vs. a link in the account menu (see F7)


Shared contract (frontend <-> backend), proposed. Change it here first, then in code.
    All routes are under /api (the Vite proxy sends /api to port 3000). Every protected route
    needs  Authorization: Bearer <supabase access_token>. Errors are always { error: "..." }.

    GET    /api/auth/me                      -> { id, email, username, display_name, avatar_url, role }
    GET    /api/jobs?type=&level=&setting=&paid=   (anyone)  -> { jobs: [Job] }
    GET    /api/jobs/:id                     (anyone)            -> { job: Job }
    POST   /api/jobs                         (employer)          -> 201 { job }
    PATCH  /api/jobs/:id                     (owner, staff)      -> { job }
    POST   /api/jobs/:id/close               (owner, staff)      -> { job }
    DELETE /api/jobs/:id                     (admin)             -> 204
    GET    /api/applications                 (student, own)      -> { applications: [Application] }
    POST   /api/applications                 (student)           -> 201 { application }
    PATCH  /api/applications/:id             (student, own)      -> { application }
    DELETE /api/applications/:id             (student, own)      -> 204
    GET    /api/jobs/:id/applications        (owner, staff)      -> { applications: [...] }
    GET    /api/events                       (anyone)            -> { events: [Event] }
    POST   /api/events                       (staff, employer)   -> 201 { event }
    GET    /api/resumes/me   PUT /api/resumes/me   (student)    -> { resume: Resume }
    POST   /api/scoutcoach/suggest           (student, after D3) -> { suggestions: [...] }

    Job          { id, title, organization, type: 'internship' | 'co-op' | 'research' | 'program',
                   level: 'high-school' | 'college' | 'both', location, setting: 'remote' | 'hybrid' | 'on-site',
                   paid: boolean, pay_text, deadline (YYYY-MM-DD), description, requirements,
                   apply_url (optional), posted_by, is_posted, created_at }
    Application  { id, student_id, job_id (null for a job found on another site), title, organization,
                   status: 'saved' | 'applied' | 'interviewing' | 'offer' | 'not-selected',
                   deadline, notes, updated_at }
    Event        { id, title, host, starts_at, ends_at, location, online_url, description, created_by }
    Resume       { student_id, data: { contact, education[], experience[], projects[], skills[] }, updated_at }

    The sample data in frontend/src/sample-data/ (F0c) uses these exact shapes, so switching a
    page from sample data to the backend only changes where the list comes from.


Frontend tasks

    Foundation (do these first; small)

    [ ] F0a - Browser check script in the repo        files: frontend/scripts/check-pages.mjs (new),
                                                              frontend/package.json ("check" script only)
        The headless-Chrome checks used so far live outside the repo. Put one in it.
        - Plain Node (built-in WebSocket and fetch) driving the installed Chrome over the
          DevTools protocol. No new npm package.
        - Starts nothing itself: expects "npm run dev" running; takes the port as an argument.
        - For every route in App.jsx, at 1280px and 375px: console errors and warnings, failed
          requests, sideways scrolling, <h1> count, <title>, inputs without labels.
        - Prints one line per page; exits 1 if anything failed.
        - package.json: add  "check": "node scripts/check-pages.mjs"  (shared file: say so in the PR).
        Done when: npm run check passes on main and fails if you add an unlabeled input.

    [ ] F0b - Update the frontend skill's docs        files: .claude/skills/scoutsearch-frontend/*.md
        They're out of date, so Claude sessions get wrong advice.
        - connect-backend.md: proxy is /api (not /auth); login is moving to Supabase; tokens
          come from supabase.auth.getSession(); point at api.js (F0c) and the contract above.
        - SKILL.md: Network and Messages are built; Login has the Forgot password screens;
          Microsoft is gone; lint has 0 known errors; the top bar has a phone layout; add the
          new pages to the Pages table as they land; mention npm run check.
        - roadmap.md: link this file.

    [ ] F0c - Shared helpers                          files: frontend/src/api.js (new),
                                                              frontend/src/sample-data/*.js (new),
                                                              frontend/src/login-status.js
        - sample-data/jobs.js, applications.js, events.js: labeled made-up examples in the
          contract's shapes (8-10 jobs covering every type, level, and setting, including
          high school ones). Several pages share them, which is why they leave the page files.
        - api.js: one apiFetch(path, options) that adds the Supabase token header, parses JSON,
          and throws an Error with the backend's { error } message. Same idea as supabase.js:
          one shared helper, imported everywhere, never copied into pages.
        - login-status.js: add the role placeholder in one obvious place, as roadmap.md says:
            export const placeholderRole = 'student'; // change to test other views
          plus getRole() that returns it for now. F8 replaces it with the real role.

    Pages with sample data (no backend needed; can run in parallel once F0c is done)

    [ ] F1 - Resume and co-op help guide              files: frontend/src/pages/Guide.jsx (new),
                                                              index.css ("Guide page"), App.jsx (route)
        Route /guide. Read mode: calm, long-form, easy to skim.
        - Sections: what a resume needs; co-op vs. internship vs. research position; when to
          start looking; for high schoolers; links to the tracker and ScoutCoach.
        - Real content written by the team (no lorem ipsum, no invented statistics).
        - On-page contents list with <a href="#..."> jumps (the About page's pattern).
        - Uses the About/Login look (about-site wrapper) if guests read it, or NavBar if only
          logged-in people do. Guests can read it, so: about-site + the about-bar top bar.

    [ ] F2 - Opportunity discovery                     files: frontend/src/pages/Opportunities.jsx (new),
                                                              index.css ("Opportunities page"), App.jsx
        Route /opportunities. Operate mode.
        - Search box + filters: type, level (high school / college), setting, paid. Filters are
          real <fieldset> groups with labels; the result count is in a role="status" line
          ("6 opportunities") so screen readers hear it change.
        - Cards: type chip, title, organization, location/setting, pay, deadline, and a
          <Link to={"/opportunities/" + job.id}>. Reuse the About page's listing-card look
          (DESIGN.md "Example Listing Card") with opportunities- classes.
        - Empty result: "No opportunities match these filters" + a Clear filters button.
        - "Examples" tag on the title until F10.
        - Filters live in the address (?type=co-op) with useSearchParams, so Back works and a
          filtered list can be shared (the same idea as Login's #forgot-password).

    [ ] F3 - Opportunity details                       files: frontend/src/pages/OpportunityDetails.jsx (new),
                                                              index.css ("Opportunity details page"), App.jsx
        needs: F2 (same sample data)
        Route /opportunities/:id (useParams). Unknown id -> a "This opportunity isn't
        available" message with a link back, not a blank page.
        - Full description, requirements, who can apply, deadline, how to apply.
        - The main button depends on getRole() (F0c):
            guest: "Sign up to apply" (Link to /signup)   student: Apply + Save
            employer who posted it: Edit + Close listing   staff: Close listing
          Apply and Save only change the screen for now (on/off pattern, aria-pressed).
        - Back link to the filtered list (navigate(-1) when the visitor came from it).

    [ ] F4 - Application tracker                       files: frontend/src/pages/Applications.jsx (new),
                                                              frontend/src/tracker-storage.js (new),
                                                              index.css ("Applications page"), App.jsx
        Route /applications. Students only (others see a short "for students" message).
        - Columns or grouped lists by status: Saved, Applied, Interviewing, Offer, Not selected.
          Change status with a real <select> (not drag and drop, which keyboards can't do).
        - "Add an application" form for jobs found anywhere: title, organization, status,
          deadline, notes. Edit and delete (with an "Undo" status message instead of confirm(),
          the same idea as Network's notes).
        - Deadlines in the next 7 days get a "Due soon" chip (text, not color alone).
        - tracker-storage.js saves the list in localStorage (copy settings.js: try/catch,
          a storage key, load/save functions) until F12 switches it to the backend.
        - Empty state: what the tracker is for and a button to add the first one.

    [ ] F5 - Events and calendar                       files: frontend/src/pages/Events.jsx (new),
                                                              frontend/src/calendar-file.js (new),
                                                              index.css ("Events page"), App.jsx
        Route /events. Everyone can view.
        - List view (default) and month view, switched with a two-button toggle (aria-pressed).
          The month view is a CSS grid table with real dates; days with events list their
          titles (no dot-only days: the title is the information).
        - "Add to calendar" makes a standard .ics file in the browser (calendar-file.js builds
          the text, a Blob + <a download> saves it). Works in Google, Outlook, and Apple
          calendars with no account or API. Unit-test the text builder by hand on one sample
          event (start/end in UTC, escaped commas).
        - Past events are hidden by default with a "Show past events" toggle.

    [ ] F6 - ScoutCoach 1: resume builder              files: frontend/src/pages/ScoutCoach.jsx (new),
                                                              frontend/src/resume-storage.js (new),
                                                              index.css ("ScoutCoach page"), App.jsx
        needs: D5. Route /scoutcoach. Students only.
        - Two columns: the form (left) and a live preview (right). Phones: tabs "Edit" / "Preview".
        - Form sections match Resume.data: contact, education, experience, projects, skills.
          Repeating sections (experience, projects) have Add / Remove / Move up / Move down
          buttons, each naming the item ("Remove Research Assistant").
        - Preview recreates Jake's template in HTML/CSS: name centered, small-caps section
          headings with a rule under them, two-column rows (title + dates, place + location),
          bullet points. A credit line in the page footer, per D5.
        - "Download PDF": window.print() with an @media print block in the ScoutCoach section
          that hides everything but the preview and sets the page to Letter with 0.5in margins.
          No PDF library.
        - Autosaves to localStorage (resume-storage.js, settings.js pattern) until F15.
        - A small "Resume help" link to /guide.
        - No AI in this task. Leave a clear spot in the layout for F16's suggestions panel.

    Navigation and roles

    [ ] F7 - Links to the new pages                    files: frontend/src/components/NavBar.jsx,
                                                              frontend/src/components/AccountMenu.jsx,
                                                              index.css (Feed: top bar, account menu)
        needs: D6, and a heads-up to Roemer (NavBar styles are in the Feed section).
        Proposed: top bar = Home, Opportunities, Network, Messages (+ your circle). Account menu
        gains My applications, ScoutCoach, Events, Resume help. Re-check the 375px two-row top
        bar after adding a link: it must still fit on one row under the name.
        The About page's top bar (guests) gets an Opportunities link too.

    [ ] F8 - Real roles on the website                 files: frontend/src/login-status.js,
                                                              frontend/src/use-current-user.js (new)
        needs: backend S4 (with role) and B3, and J1.
        - use-current-user.js: a small hook that calls apiFetch('/api/auth/me') once and shares
          the answer ({ user, role, loading }). Guests (no Supabase session) get role 'guest'
          without calling the backend.
        - getRole() / placeholderRole from F0c go away; pages read the hook instead.
        - Hiding a button is never the protection; the backend checks too (see Access Roles doc).

    [ ] F9 - Email login through Supabase              files: frontend/src/pages/Login.jsx,
                                                              frontend/src/pages/Signup.jsx
        needs: D1 = B, and B5.
        - Log in form: supabase.auth.signInWithPassword({ email, password }).
        - Sign up: supabase.auth.signUp({ email, password, options: { data: { display_name } } })
          and a "Check your email to confirm" screen (reuse the Forgot password screen's look).
        - Forgot password: replace the pretend wait in handleReset with
          supabase.auth.resetPasswordForEmail (the LATER comment already shows it), and add the
          /reset-password page where the email link lands (two password boxes + Save, like
          Sign up step 2) calling supabase.auth.updateUser({ password }).
        - Errors stay on the page in the role="status" message; never say whether an email has
          an account.

    Connecting to the backend (each waits on its backend task)

    [ ] F10 - Opportunities use /api/jobs              files: Opportunities.jsx, OpportunityDetails.jsx
        needs: B6. Swap sample-data/jobs.js for apiFetch. Add loading ("Loading opportunities...")
        and error states (message + Try again). Remove the Examples tag.

    [ ] F11 - Post a job page (employers)             files: frontend/src/pages/PostJob.jsx (new),
                                                              index.css ("Post a job page"), App.jsx
        needs: B6, F8. Route /post-job, also used for editing (/post-job/:id). Every Job field,
        labels on everything, inline errors next to the field, a preview of the card before
        posting. Non-employers see why they can't post.

    [ ] F12 - Tracker and Apply use the backend       files: Applications.jsx, tracker-storage.js,
                                                              OpportunityDetails.jsx
        needs: B7, F8. Tracker reads/writes /api/applications. On first load, offer to move
        anything saved in localStorage into the account, then clear it. Apply on details
        creates an application with job_id and status 'applied'.

    [ ] F13 - Applicants view (employers)             files: frontend/src/pages/Applicants.jsx (new),
                                                              index.css ("Applicants page"), App.jsx
        needs: B7, F8. Route /opportunities/:id/applicants. The job owner and staff only.

    [ ] F14 - Events use the backend                  files: Events.jsx
        needs: B9, F8. Read /api/events; a "Create event" form for staff and employers.

    [ ] F15 - ScoutCoach saves to the account         files: ScoutCoach.jsx, resume-storage.js
        needs: B8, F8. Same move-from-localStorage offer as F12.

    [ ] F16 - ScoutCoach 2: suggestions               files: ScoutCoach.jsx, index.css (ScoutCoach)
        needs: D3, B10.
        - A Suggestions panel per section: "Suggest better wording" sends only that section's
          text (never contact details) to /api/scoutcoach/suggest.
        - Each suggestion shows the before and after; nothing changes until the student clicks
          Use this. Never adds experience the student didn't write.
        - Before first use, a short note says what gets sent and to whom.


Backend tasks this plan needs (proposed; Anthony and Jayden move the ones they agree to
into backend/plans.md, which stays their file)
    B1 = J1  middleware uses Supabase tokens (Jayden)                      blocks everything role-based
    B2 = S4  GET /api/auth/me, and add role to its answer (Anthony)        blocks F8
    B3       role column + my_role() helper (Access Roles doc, SQL sketch) (Anthony)
    B4       requireRole(...roles) middleware for routes (Jayden)
    B5       if D1 = B: S5 becomes "move password login to Supabase": delete /signup, /login,
             bcrypt, jsonwebtoken; turn on Supabase email login; set the reset-password
             redirect URL to http://localhost:5173/reset-password (Anthony)
    B6       jobs table + RLS + the /api/jobs routes                        blocks F10, F11
    B7       applications table + RLS + routes                              blocks F12, F13
    B8       resumes table + RLS + routes                                   blocks F15
    B9       events table + RLS + routes                                    blocks F14
    B10      /api/scoutcoach/suggest, after D3: key in secrets.env only, send only the section
             text, rate-limit per student                                   blocks F16
    B11      npm audit fix in backend/ (body-parser, high), best done with S5
    B12      before launch: a free email sender for Supabase (its built-in one is for testing)


Order
    Now:     F0a, F0b, F0c  ->  F1, F2, F4, F5, F6 in parallel (F3 after F2)   |  backend: J1, S4, D1
    Next:    F7 (after D6), F8 (after J1 + S4 + B3), F9 (after D1 + B5)
    Then:    F10 + F11 (B6)  ->  F12 + F13 (B7)  ->  F14 (B9), F15 (B8)  ->  F16 (D3 + B10)
    Advice for the mentor demo: finish F2, F3, F4 and F6 end to end before starting F5.
