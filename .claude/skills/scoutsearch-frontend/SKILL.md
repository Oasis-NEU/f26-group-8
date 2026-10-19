---
name: scoutsearch-frontend
description: How to build and change the ScoutSearch frontend (React 19 + Vite + react-router, every style in frontend/src/index.css) for the Oasis-NEU f26-group-8 student job board. Use for ANY work inside frontend/ - adding or changing a page (About, Login, Signup, Feed, Profile, Edit Profile, Network, Messages, or new ones like Apply, Notifications, Job Lister, Admin), styling or redesigning index.css (fonts, colors, hover effects), making buttons work (Like, Comment, Share, Connect, Edit profile), the NavBar, routes in App.jsx, guest/student/job-lister/admin views, hooking the Login/Signup forms up to the backend, frontend lint or build errors, and accessibility (WCAG) checks. Also use it when a teammate asks how something on the site works or wants to be walked through a frontend change step by step, even if they never say "frontend". Also read it before running a design or animation skill (frontend-design, impeccable, animate, emil-design-eng, break-ui) on this site. Not for code inside backend/.
---

# ScoutSearch frontend

ScoutSearch is "Indeed for students": a job board where high school and college
students find internships, co-ops, and research positions. It is an Oasis @
Northeastern group project (repo `Oasis-NEU/f26-group-8`). The frontend lives in
`frontend/`. The backend (Express + Supabase login/signup) lives in `backend/`.

Two more files in this folder, read only when the task needs them:

- [connect-backend.md](connect-backend.md): hooking Login/Signup (or anything
  else) up to the backend: the API, the port problem, a commented `fetch` example.
- [roadmap.md](roadmap.md): the four user roles and the team's planned work. Read
  it when a request is part of a bigger feature (Apply page, Job Lister view,
  role-based views) so you know what it's part of.

## Who you're working with

The team is learning React, CSS, and Git while building this. That changes how
you should work:

- **Show the code; don't type it for them.** Teammates usually type the code
  themselves (see CLAUDE.md). By default, say which file and where, show the
  snippet, and explain each new line. Then read their file afterward and check
  it. Only edit project files yourself when someone clearly asks you to
  ("go ahead and add it", "change it for me").
- **Do exactly what was asked.** Don't add extra components, pages, refactors, or
  "while I'm here" fixes. If you notice something else worth fixing, mention it in
  one line at the end instead. A beginner can't easily review a change that
  touches five things at once.
- **Explain in plain words.** Describe things by what they look like on screen
  ("the blue strip at the top of the card"), not jargon. The first time a React
  idea shows up (state, props, `.map()`, `key`), define it in a sentence.
- **Respect owners.** Pages are split between teammates (see the table below).
  Before changing a page someone else owns, say so and keep the change small.
  Branches are named after people (`Kevin-work`, `roemer-work`, `Ekkam-Work`,
  `Jayden-Work1`) and reach `main` through pull requests. Don't commit or push
  unless asked.

## Stack and commands

| Tool | How it's used here |
|---|---|
| React 19 | Components in plain JavaScript (`.jsx`). TypeScript is on the team's learning list, but the frontend isn't TypeScript yet, so don't convert files. |
| Vite 8 | Dev server and build. `vite.config.js` has no proxy yet. |
| react-router 8 | Import from `"react-router"` (not `react-router-dom`). `BrowserRouter` is set up in `main.jsx`; routes are in `App.jsx`. |
| Tailwind CSS 4 | Loaded by `@import 'tailwindcss';` at the top of `index.css`. It's only used for its style reset and the `sr-only` class. **Pages are styled with our own named classes in `index.css`, not Tailwind utility classes**, so all the styles stay readable in one place. Keep it that way. |
| ESLint | `react-hooks` + `react-refresh` rules. Unused imports are errors. |

Run commands from `frontend/` (the `package.json` at the repo root is a leftover
install, so ignore it). To start the site in the background, use the `run-app`
skill.

```bash
cd frontend
npm install      # first time only
npm run dev      # starts the site at http://localhost:5173
npm run lint     # finds mistakes
npm run build    # checks the site builds (writes to frontend/dist, which git ignores)
```

## Where things are

```
frontend/
  index.html                 the one HTML page; React draws inside <div id="root">
  vite.config.js             Vite settings (shared, so a change here affects everyone)
  src/
    main.jsx                 starts React, wraps the app in BrowserRouter, loads index.css
    App.jsx                  the list of pages: one <Route path element> per page
    index.css                ALL the styles, split into one section per page
    components/NavBar.jsx    the white top bar used on Feed, Profile, Network, Messages
    pages/                   one file per page
```

## Pages

| Route | File | Owner | What it does today |
|---|---|---|---|
| `/` | (App.jsx) | | Sends visitors to `/about`. |
| `/about` | About.jsx | Kevin | Done. Blue sticky top bar whose tabs jump to sections, plus Sign up / Log in buttons. It has its own `top-bar`, not NavBar. |
| `/login` | Login.jsx | Kevin | Form with labels and a `role="status"` message. Doesn't call the backend yet; it just goes to `/feed`. |
| `/signup` | Signup.jsx | Kevin | Same as Login plus a Name field. Doesn't call the backend yet. |
| `/feed` | Feed.jsx | Roemer | 3 columns: profile card + "Your space" / post box + posts / "People to know" + "Trending Topics". Like works (state + `aria-pressed`). Comment, Share, Connect, Photo/Event/Article do nothing yet. |
| `/profile` | Profile.jsx | Roemer | Header, About, Education, Experience, Projects, Resume, Skills, Followed Companies and Communities. Buttons do nothing yet, including "Edit profile" (it doesn't link to `/editprofile`). |
| `/editprofile` | EditProfile.jsx | Roemer | **Only on `roemer-work`, not on `main` yet.** Uses `edit-` classes; Resume and Skills are still left to do. Don't build a second Edit Profile page. `roemer-work` is behind `main`: its NavBar still uses `<a href="#">`, so keep main's `<Link>` version when the branches are merged. |
| `/network` | Network.jsx | Kevin | Requests box (empty), People You May Know grid (Connect does nothing yet), Groups box (empty). |
| `/messages` | Messages.jsx | Kevin | Only a heading so far. |

Everything on these pages is made-up sample data stored in lists at the top of
each file, because nothing is connected to the backend yet.

## Adding or changing a page

Team rule: **update the stylesheet before adding anything to a page.** Write the
CSS section first, then the JSX that uses it, so `index.css` stays the one place
to look up how something looks.

1. **CSS:** in `index.css`, add a section headed `/* ---------- Apply page ---------- */`
   with a short note on what it covers (copy the Network section's header).
2. **Page file:** create `src/pages/Apply.jsx` using the layout below.
3. **Route:** in `App.jsx`, import the page and add
   `<Route path="/apply" element={<Apply />} />` with a
   `{/* yoursite.com/apply shows the Apply page */}` comment like the others.
   Use lowercase paths.
4. **Link to it:** if it belongs in the top bar, add `<Link to="/apply">Apply</Link>`
   in `NavBar.jsx`. That changes every page that uses NavBar.
5. **Check it** using "Before you say it's done" at the bottom.

### Page file layout

Every page file goes in the same order: a comment saying what the page is,
imports, sample data, small pieces, then the whole page. Feed.jsx and Profile.jsx
follow it most closely. Use this as the starting point:

```jsx
// Apply.jsx is the Apply page (yoursite.com/apply).
// It lists open jobs, internships, and co-ops.
// Everything on it is made-up sample data for now, because the site
// isn't connected to the backend yet.
// The styles for this page are in index.css, under "Apply page".

// NavBar is the bar across the top of the page (components/NavBar.jsx).
import NavBar from "../components/NavBar.jsx";

// ---------- Sample data ----------
// Later, this data would come from the backend instead.
const jobs = [
  { id: 1, title: "Software Co-op", company: "Example Co", type: "Co-op", location: "Boston, MA", pay: "$25/hr" },
];

// ---------- Pieces of the page ----------
// Each function below is one piece of the page.

// One job in the list. "props" holds the info passed in by Apply below.
function JobBox(props) {
  return (
    <li className="apply-job-box">
      <h2 className="apply-job-title">{props.title}</h2>
      <p className="apply-job-company">{props.company}</p>
    </li>
  );
}

// Apply is the whole page. It puts the pieces above together.
function Apply() {
  return (
    <>
      <NavBar />
      <main className="apply-page">
        <h1 className="apply-page-title">Open positions</h1>
        <ul className="apply-job-list">
          {jobs.map((job) => (
            <JobBox key={job.id} title={job.title} company={job.company} />
          ))}
        </ul>
      </main>
    </>
  );
}

// "export default" lets other files import Apply (App.jsx does this).
export default Apply;
```

Keep these consistent across pages:

- **One `<h1>` per page.** If the design has no visible title, use
  `<h1 className="sr-only">` (Network does this).
- **Use the right tags:** `<main>` for the page, `<aside>` for side columns,
  `<section>` + `<h2>` for each box, `<ul>`/`<li>` for repeated items.
- **Links:** pages inside the site use `<Link to="/...">`, never `<a href="/...">`
  (that reloads the whole site). `<a href="#id">` is only for jumping within one
  page, like the About tabs.
- **After a form is sent**, move to the next page with `useNavigate()` (see Login.jsx).
- **Lists:** every item made by `.map()` needs a `key`. Use a real `id` from the
  data, not the position in the list.
- **Imports:** only import what you use; ESLint fails on unused imports.
- **On/off buttons** (Like, Follow, Connect, Save): copy Feed's Like button.
  Use `useState(false)`, flip it on click, change the class and the button's words,
  and set `aria-pressed={liked}`. Put the `useState` inside the piece that's
  repeated (like `Post`), so each copy remembers its own on/off.
- **Match the file you're in:** files differ in indent size (Feed uses 2 spaces,
  Login and Network use 4) and quotes (Feed uses `"`, Login uses `'`). Copy
  whatever the file already does.
- **Comments:** every file explains itself in plain words for teammates who are
  learning. Put a short comment above each element or block saying what it is on
  screen, and mark accessibility reasons with `(WCAG)`. New code should be
  commented as heavily as the code around it.

## Writing CSS in index.css

- **Plain-English class names** that describe what you see: `form-button`,
  `back-link`, `about-us-box`, `white-box`, `network-connect-button`. Avoid jargon
  like `btn-primary`, `card`, `hero`, `wrapper`, `container`. A few older classes
  (`feed-connect-btn`, `profile-btn-outline`, `profile-card`) don't follow this
  yet. Leave them alone unless someone asks for a rename, because renaming also
  means changing the JSX.
- **Start page-only classes with the page name** (`feed-`, `profile-`,
  `network-`, `edit-`, `apply-`) so one page can't break another. Classes without
  a prefix (`page`, `page-title`, `form-box`, `form-button`, `back-link`,
  `white-box`) are shared, so changing them changes several pages. The NavBar's
  classes start with `feed-` because it was first built for Feed; they live in
  the Feed section.
- **One section per page**, under a `/* ---------- Page name ---------- */` header.
- **Comment the way the file already does:** one comment above each rule saying
  what it styles, and a short note after each property, e.g.
  `padding: 8px 16px; /* space inside: top/bottom, left/right */`. These comments
  are how the team learns CSS, so keep them.
- **Colors:** the site uses a clear, gentle light blue scheme (real blues, no grays), kept a step dimmer than
  full brightness so it's easy on the eyes (chosen 2026-10-18): light blue page
  `#d7e9fb`, off-white boxes `#f0f7ff` (not pure white, which is glaring), navy
  text `#10325a`, blue buttons `#2a74ba`, and a sky-blue accent `#74b6ea` (navy
  words on it) saved for the main action. Use the variables in
  `:root` at the top instead of hex codes: `var(--primary)`,
  `var(--primary-dark)`, `var(--text)`, `var(--muted)`, `var(--bg)`, `var(--card)`,
  `var(--border)`, `var(--line)`, `var(--soft)`, `var(--subtle)`, `var(--accent)`. The
  About page also has its own `--about-` variables. Box backgrounds use
  `var(--card)`, not `white`; index.css has no hard-coded colors left besides
  `white` text on blue, so keep it that way. If a redesign
  needs a new color, add it to `:root` with a comment so the whole site can
  change together.
  - `--border` is the gray-blue around input boxes (3.5:1 on boxes, enough for
    borders). `--line` is the thin soft blue line around boxes and between
    rows. `--soft` is the very light blue for hover colors and tags.
  - Small gray text: use `var(--subtle)` (6:1 on boxes, 5.3:1 on `--bg`).
  - `--muted` and `--text` (and `--primary` and `--primary-dark`) are close in
    color. A hover or on/off state that only switches between them is hard to
    see, so add a second cue (underline, bold, or a background) the way
    `.feed-nav-right a:hover` does.
- **Fonts:** no `font-family` is set anywhere yet, so the site uses Tailwind's
  default system font. For a new font, load it with a `<link>` in `index.html`'s
  `<head>` and set `font-family` once on `body` in `index.css`.
- **Phones:** add an `@media (max-width: 760px)` rule so multi-column layouts
  stack into one column (the Network section does this). The file uses 640px and
  760px as its breakpoints.
- **Hover needs a keyboard twin:** anything with a `:hover` style should also get
  a `:focus-visible` style so keyboard users can see where they are. The Login
  form's `.form-button:focus-visible` rule is the one to copy.
- **Motion:** button feedback for the design pass (`transition`, a slight
  `transform` on `:active`) goes inside
  `@media (prefers-reduced-motion: no-preference)`, the same way the About page's
  smooth scrolling does.

## Accessibility (WCAG) checklist

Accessibility is an explicit team priority. Check each item for anything you add:

- Every input has a `<label htmlFor="x">` matching an `id="x"`. If the design shows
  no label, give it `className="sr-only"`. A placeholder is not a label.
- Headings go in order: one `h1`, then `h2` for boxes, `h3` inside boxes.
- Text has at least 4.5:1 contrast against its background, including the gray
  page background, not just white.
- Anything clickable is a `<button>` or `<Link>`, never a clickable `<div>`.
- On/off buttons use `aria-pressed`. Messages that appear after an action use
  `role="status"` so screen readers read them out.
- Repeated buttons say what they're for. Five "Connect" buttons all sound the same
  to a screen reader, so add something like
  `aria-label={"Connect with " + person.name}`. Start the label with the visible
  word ("Connect") so voice-control users can still say it.
- Decorations (initials circles, arrows, emoji icons) get `aria-hidden="true"` when
  the same information is already in nearby text.
- Everything can be reached with the Tab key and shows a visible outline.
- Animations and smooth scrolling go inside
  `@media (prefers-reduced-motion: no-preference)`.
- Buttons and links are easy to tap (at least about 24×24px; the existing ~10px
  padding around text works).

## Design and animation skills

The project also has design skills in `.claude/skills/`: Anthropic's
`frontend-design` (from `anthropics/skills`), Impeccable (from
`pbakaus/impeccable`), and Emil Kowalski's skills (from `emilkowalski/skills`).
They know a lot about design but were written for any project, so **on
ScoutSearch this file's rules win** when they disagree:

- Styles go in `index.css` under the page's section, with plain-English,
  page-prefixed class names and a comment on each property. No Tailwind utility
  classes, CSS modules, or inline `style={{ }}`.
- Motion is plain CSS (`transition`, `@keyframes`) inside
  `@media (prefers-reduced-motion: no-preference)`. Several of these skills reach
  for Framer Motion (`motion`). It isn't installed, so don't add it or any other
  npm package unless the team agrees, since it changes `package.json` for everyone.
- New colors, fonts, and timing values go in `:root` as variables, with a comment.
- Stay on the page that was named, say so if someone else owns it, and keep the
  WCAG checklist above. Advice that breaks it (faint gray text, motion that
  ignores reduced-motion, feedback that only shows on hover) loses.
- A command that changes the design counts as asking for the edit, unless the
  person said they want to type it themselves. Either way, explain each change
  in plain words afterward.

Which one to use (most tasks need just one row, so load only that skill):

| When someone wants to... | Use | Notes for this site |
|---|---|---|
| Get a review of how a page looks and works | `impeccable` with `critique` (design) or `audit` (accessibility, speed, phone sizes) | Report only. A good first step before a design pass. |
| Improve how a page looks | `impeccable` with `polish`, `layout`, `typeset`, `colorize`, `bolder`, `quieter`, or `distill` | Keeps the current look, words, and behavior. Only do a full redesign if the team asks for one. |
| Design a brand-new page (Apply, Notifications, Job Lister, Admin), or redesign a whole page when the team asks | `frontend-design` | Plans first, then builds. See "frontend-design on this site" below. Use it *or* `impeccable` for a task, not both. |
| Fix the phone layout | `impeccable` with `adapt`, then `mobile-native` for touch details | Feed and Profile have no phone layout yet. Use the file's 640px and 760px breakpoints. |
| Better button words, labels, and error messages | `impeccable` with `clarify` | |
| Fill empty boxes (Requests, Groups, Messages) | `impeccable` with `onboard` | |
| Find what breaks with long names, missing info, or huge numbers | `break-ui`, or `impeccable` with `harden` | Put the worst-case data in the sample-data list at the top of the page. Ask before adding break-ui's "Worst case" toggle, and take it out after. |
| Add hover and press feedback, or other motion | `animate` for the decisions, `emil-design-eng` for the small details | Plain CSS only (see above). |
| Find places that could use motion | `find-animation-opportunities` | Suggests only; doesn't edit. |
| Plan motion fixes across the whole site | `improve-animations` | Writes a plan; doesn't edit. |
| Check motion someone already wrote | `/review-animations` | Only runs when someone types it. |
| Fix an animation that stutters | `animation-performance` | |
| Find the name of an effect ("the bouncy pop-in") | `animation-vocabulary` | |
| Try several versions of one piece and pick one | `/prototype` | Only runs when someone types it. Build it on a temporary route and delete it after the pick. |
| Choose a library | `/pick-ui-library` | Only runs when someone types it. Adding a package is a team decision. |

Not for this site: `animate-expo` (React Native apps) and `write-swift` (Swift).
`ask-sonner` is for the Sonner pop-up message library, which isn't installed;
messages here use `role="status"`. `apple-design` is mostly about gestures and
springs, so only borrow its ideas on feedback and type.

**Impeccable on this site:**

- **Mode:** the About page is *Persuade* (it sells the site). Feed, Profile,
  Network, Messages, Login, Signup, and the planned Apply page are *Operate*
  (people getting something done), so good design there means calm and precise,
  not flashy.
- **First run:** its setup step runs `scripts/impeccable context`, which downloads
  a small helper program the first time. That's expected.
- **Files it makes:** `init` writes `PRODUCT.md` and `document` writes `DESIGN.md`
  at the repo root, plus a `.impeccable/` folder. These are shared team files, so
  only make them when someone asks. Take the product facts from this file and
  [roadmap.md](roadmap.md) (students, job board, WCAG, the four roles), and
  mention the new files in the pull request.
- **Ask first** before turning on `impeccable hooks` (runs a checker after every
  edit) or `live` (edits the page from the browser).

**frontend-design on this site:**

- **Skip its "confirm the subject" step.** The brief is already known:
  ScoutSearch is a job board where high school and college students find
  internships, co-ops, and research positions. Each page's job is in the Pages
  table above, and [roadmap.md](roadmap.md) has the four roles. Don't stop to ask
  for these.
- **New pages match the site.** Its advice to take risks and give each project
  its own look is written for a brand-new brand. Here, a new page uses NavBar and
  the `:root` colors so it looks like the same site, so the color part of its plan
  is just those variables. Only pick new colors or fonts when the team asks for a
  site-wide redesign. A new font changes every page, so check with the team first.
- **Mode decides how bold** (see Impeccable's Mode above). The About page can
  have one memorable moment. On Operate pages, keep it calm and spend boldness in
  one small place or not at all.
- **Keep the plan short:** a few lines for colors and fonts plus one ASCII sketch.
  Show it to the teammate before writing code so they can say yes or change it.
  Then build it the usual way (the `index.css` section first, then the JSX).
- **Don't strip the site's look to avoid its "AI tells" list.** The white boxes
  on Feed, Profile, and Network are the site's design. That list is about choices
  in new work.
- **Screenshots:** it asks you to screenshot and critique your work. If no browser
  is available, skip that and say so. Use "Before you say it's done" below in
  place of its own quality checklist.

## Before you say it's done

Run these from `frontend/` and report what you actually saw:

1. `npm run lint`: the only errors should be the 4 already listed in Known
   issues (fewer if you fixed some). Any other error came from the change, so fix it.
2. `npm run build`: it should end with `built in ...`.
3. Open the page with `npm run dev` (or the `run-app` skill). It should show up,
   its links should go to the right pages, and the browser console (F12) should
   have no red errors.
4. Press Tab through the page. Every link, button, and input should get a visible
   outline, in an order that makes sense.
5. Make the window narrow (about 375px, or the phone view in F12). Nothing new
   should spill off the side.
6. Go back over the WCAG checklist above for everything you added.

If you can't do a step (for example, you can't see a browser), say which ones you
skipped instead of saying it all works. Before a pull request, the
`code-reviewer` agent can look over the change.

## Known issues (leave alone unless asked)

These problems are real, but nobody has asked to fix them. Mention one if it
affects the task; don't fix it on the side. Last checked 2026-10-18.

- `npm run lint` already fails with 4 errors: unused imports in Messages.jsx
  (`useState`, `Link`, `useNavigate`) and Network.jsx (`useState`).
- Feed has no `<h1>`: its first heading is the `<h2>` name on the profile card. A
  hidden `<h1 className="sr-only">` like Network's would fix it.
- Login and Signup set their message and then leave the page right away, so the
  message is never seen. They also go to `/Feed` (capital F). That works because
  routes ignore case, but new code should use lowercase.
- These hover styles have no `:focus-visible` twin, so keyboard users only get the
  browser's plain default outline: `.feed-profile-link`, `.feed-post-actions button`,
  `.feed-nav-right a` (NavBar), `.profile-btn-outline`, `.profile-btn-primary`,
  `.network-connect-button`.
- Feed (3 columns) and Profile (2 columns) have no phone layout, so they spill
  off small screens.
- Initials circles are missing `aria-hidden="true"` in Feed.jsx, Profile.jsx, and
  NavBar (Network has it), and so are the 📄 icons on Profile.
- The NavBar circle is hard-coded to "RMV", and NavBar's comment still says its
  links use `href="#"`. The NavBar search box doesn't search.
- No page sets its own browser tab title, and `index.html`'s title is still
  "f26-group-8" (WCAG 2.4.2). In React 19 a page can fix this by putting
  `<title>Feed | ScoutSearch</title>` anywhere in its JSX.
- The README is still Vite's template.
