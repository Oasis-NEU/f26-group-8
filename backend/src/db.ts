import { createClient } from '@supabase/supabase-js';

// one shared Supabase client for the whole backend, using the SECRET key
// (the secret key skips RLS, so only the server may ever have it)
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  {
    auth: {
      // by default supabase-js remembers a logged-in user and keeps their token fresh.
      // that's for browsers, where one person uses the client. our server handles
      // many different users, so it must never remember or refresh anyone's session.
      // each request brings its own token instead (see authenticateToken)
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
