---
name: plans-scope
description: Check progress against backend/plans.md and keep work limited to the steps listed there. Use when asked what's left to do, what the next step is, whether a plan item is done, or before suggesting new backend work.
---

# Work from backend/plans.md

`backend/plans.md` is the task list for this part of the project (Anthony: Sign Up, Log In, database). Jayden owns JWT creation.

## Rules

1. Read `backend/plans.md` fresh every time because it changes.
2. Only work on or suggest the steps it lists. Don't add features, validation, or refactors it doesn't mention. Mention glue code (for example `express.json()` or mounting a router) only when a listed step can't work without it.
3. Anthony writes the code by hand. Explain what to change and where (file and line), and show snippets, but don't edit source files unless explicitly asked.

## Status check

For each step in plans.md, look at the code (mainly `backend/src/auth.ts`, `db.ts`, and `middleware.ts`) and report one of:

- **Done**: give the file:line that implements it
- **Partial**: say what's missing
- **Not started**

Keep the report short, with one line per step.
