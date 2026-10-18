# Connecting the frontend to the backend

Read this when hooking Login, Signup, or any other page up to the backend.
Signup and login live in `backend/` and belong to Anthony; Jayden owns the JWT
token. Agree with them on anything that changes what gets sent or stored.

## The backend

It's in `backend/` (Express 5 + Supabase). Start it with `npm run dev` inside
`backend/` (or the `run-app` skill). It runs on port 3000 and needs
`backend/secrets.env`. That file holds secret keys. It is gitignored and must
never be read, committed, or copied into the frontend. Anything in `frontend/`
ends up in the browser where anyone can see it, so secrets never go there.

| Request | Send (JSON) | Get back |
|---|---|---|
| `POST /auth/signup` | `{ username, password }` | 201 `{ message }` · 400 missing fields · 409 username taken · 500 |
| `POST /auth/login` | `{ username, password }` | 200 `{ token }` (expires in 6h) · 401 wrong username or password · 500 |

Every error comes back as `{ error: "..." }`, so the page can always show
`data.error`. Login doesn't check for empty fields itself; the `required` on the
inputs covers that.

The token stores the name as `username` (`jwt.sign({ username }, ...)` in
`backend/src/auth.ts`). Protected backend routes (`authenticateToken` in
`backend/src/middleware.ts`) expect the header `Authorization: Bearer <token>`.
No route uses it yet. To test the backend on its own, use the `test-auth` skill.

## Check these before writing any code

1. **Field mismatch.** The backend wants `username`, but the forms collect `email`
   (Login) and `name` + `email` (Signup). Ask the backend team (Anthony, Jayden)
   which field to use before changing either side.
2. **Different ports.** The frontend runs on 5173 and the backend on 3000, and the
   backend has no CORS setup, so the browser blocks
   `fetch("http://localhost:3000/...")`. The usual fix is a Vite proxy (below).
3. **Where the token goes.** After login the page gets a token. Where to keep it
   (for example `localStorage`) is Jayden's call. Ask; don't pick one silently.

## The Vite proxy

`frontend/vite.config.js` is shared, so this changes it for everyone; mention it
in the pull request. Restart `npm run dev` after saving. It only works with the
dev server, not in a built site.

```js
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // While "npm run dev" is running, any request that starts with /auth is
  // passed along to the backend on port 3000. The browser only ever talks to
  // port 5173, so it doesn't block the request.
  server: {
    proxy: {
      '/auth': 'http://localhost:3000',
    },
  },
})
```

With that in place, the frontend calls `fetch('/auth/login', ...)` with no
`http://localhost:3000` in front.

## Login with fetch

This replaces `handleSubmit` in Login.jsx. It assumes the team picked `username`
and the input is now `name="username"`. It's written in Login.jsx's style
(4-space indent, single quotes). Things to notice:

- Today, Login sets its message and then leaves the page right away, so the
  message is never seen. Here it only leaves when the login worked, and an error
  stays on the page in the `role="status"` message so screen readers read it out.
- `try`/`catch` covers the backend not running, which would otherwise crash the
  page.

```jsx
// Runs when the form is submitted (the Log in button is clicked,
// or Enter is pressed).
// "async" lets this function wait for the backend's answer with "await".
async function handleSubmit(event) {
    // Normally submitting a form reloads the whole page. This stops that.
    event.preventDefault();
    // What the user typed in the username and password boxes
    const username = event.target.username.value;
    const password = event.target.password.value;

    // try/catch: if anything inside "try" fails (like the backend not
    // running), the code jumps to "catch" instead of breaking the page.
    try {
        // fetch sends a request to the backend. "await" waits for the answer.
        const response = await fetch('/auth/login', {
            method: 'POST',                                  // POST means "I'm sending data"
            headers: { 'Content-Type': 'application/json' }, // tells the backend the data is JSON
            body: JSON.stringify({ username, password }),    // turns the object into text to send
        });
        // Turns the backend's answer back from text into an object
        const data = await response.json();

        // response.ok is true when it worked (status 200-299).
        // Otherwise show the backend's error, like "Invalid username or password"
        if (!response.ok) {
            setMessage(data.error);
            return; // stop here, so we stay on the Log in page
        }

        // It worked. data.token is the login token (ask Jayden where to keep it).
        navigate('/feed');
    } catch {
        // The request never got an answer
        setMessage("Can't reach the server. Is the backend running?");
    }
}
```

## Signup

Same pattern, with `fetch('/auth/signup', ...)`. Signup only gives back a message,
not a token, so after a successful sign up either send the user to `/login` or
log them in with a second request to `/auth/login`. Check with the team which one
they want. A 409 means the username is taken. Show `data.error` so the user knows
to pick another.

## Protected routes (later)

Once the backend has a route behind `authenticateToken`, send the token like this,
and add that route's path to the proxy too:

```js
fetch('/some-route', {
    headers: { Authorization: 'Bearer ' + token },
});
```

A 401 means no token was sent; a 403 means it's wrong or expired (after 6h), so
send the user back to `/login`.
