// supabase.js makes ONE connection to our supabase database and 
// every page imports it from here. If each page made its own connection,
// the browser would end up with several copies that don't share the
// login state. This is a common pattern in React apps.
import { createClient } from '@supabase/supabase-js'

// Vite reads these from the .env.local. Only names that start with VITE_
// are exposed to the browser. This is a security feature of Vite.
// Names with VITE_ get passed to the browser code
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Make the connection once and share it with "export" with the rest of the site
// flowType: 'pkce' is the safer way to handle logins that send you to
// another site and back (like "Log in with Google"). It's more secure than
// the old way (called the "implicit flow").
export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        flowType: 'pkce', // Use PKCE flow for authentication  
    },
});