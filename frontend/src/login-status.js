// login-status.js remembers whether someone is logged in, so pages can
// show different things to logged-in people (for example, the About page's
// top bar shows "Home" and your circle instead of "Log in" and "Sign up").
//
// FOR NOW this is only pretend: the Log in and Sign up pages don't talk to
// the backend yet, so this just saves "yes" in the browser's localStorage
// (a small storage space each website gets) when the form is sent, and
// removes it on Log out.
//
// LATER, once Log in calls the backend, the backend sends back a login
// token. Where to keep that token is Jayden's call (JWT). When that's
// decided, only this file needs to change: isLoggedIn() would check for
// the token instead, and the pages that use it stay the same.

// The name it's saved under in localStorage
const storageKey = 'scoutsearch-logged-in';

// True if someone is logged in.
// "try/catch": if the browser blocks localStorage (some private windows
// do), act as if nobody is logged in
export function isLoggedIn() {
    try {
        return localStorage.getItem(storageKey) === 'yes';
    } catch {
        return false;
    }
}

// Remembers that someone just logged in (Login.jsx and Signup.jsx run this)
export function markLoggedIn() {
    try {
        localStorage.setItem(storageKey, 'yes');
    } catch {
        // If saving is blocked, the site just won't remember the login
    }
}

// Forgets the login (the dropdown's "Log out" runs this)
export function markLoggedOut() {
    try {
        localStorage.removeItem(storageKey);
    } catch {
        // Nothing to forget
    }
}
