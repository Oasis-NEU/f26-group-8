// api.js is how every page talks to our backend (the Express server in backend/).
// Every request goes to /api/..., and the Vite proxy (vite.config.js) passes
// it on to the backend on port 3000.
// It also sends your login token, so the backend knows who is asking.

// supabase is our one shared connection (supabase.js). It knows who's logged in
import { supabase } from './supabase.js';

// path is the part after /api, like '/posts' or '/messages'.
// options is the same as fetch's, like { method: 'POST', body: ... }.
// Leave options out to just read something (a GET).
// "export" lets pages import it: import { api } from '../api.js';
export async function api(path, options = {}) {
    // supabase is null when .env.local is missing (see supabase.js)
    if (!supabase) {
        throw new Error('Supabase is not set up (.env.local is missing)');
    }

    // Ask Supabase for the current login. access_token is the long code
    // that proves who you are. "?." gives undefined instead of crashing
    // when nobody is logged in
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    const response = await fetch('/api' + path, {
        ...options, // copies method and body from options
        headers: {
            // tells the backend that what we send is JSON
            'Content-Type': 'application/json',
            // only add the token if there is one. The backend's
            // authenticateToken reads it from here
            ...(token ? { Authorization: 'Bearer ' + token } : {}),
        },
    });

    // Read the answer as JSON. If the backend isn't running, the answer
    // isn't JSON, so .catch gives an empty object instead of crashing
    const body = await response.json().catch(() => ({}));

    // response.ok is true when it worked (status 200-299). Otherwise our
    // backend always sends { error: '...' }, so pass that message along
    if (!response.ok) {
        throw new Error(body.error || 'Something went wrong. Try again.');
    }
    return body;
}
