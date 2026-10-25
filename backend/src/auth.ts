import express from 'express';
import bcrypt from 'bcrypt';
import { supabase } from './db.js';
import jwt from 'jsonwebtoken'

const router = express.Router();
const key = process.env.JWT_KEY

// a fake hash we compare against when the username doesn't exist (see /login)
// made once at startup with the same cost (10) as real hashes, so it takes the same time to check
const dummyHash = bcrypt.hashSync('not-a-real-password', 10);

// returns an error message if username/password are bad, or null if they're fine
// signup and login both use this so the rules stay the same in both places
// checkLength is only true for signup: login skips it so accounts made
// before the limit existed can still log in
function checkCredentials(username: unknown, password: unknown, checkLength: boolean): string | null {
  // typeof check matters because req.body is whatever the client sent,
  // so username could be a number, an array, an object, etc.
  if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
    return 'Username and password are required';
  }
  // bcrypt only looks at the first 72 bytes of a password and silently ignores the rest,
  // so a longer password would "work" but be weaker than the user thinks
  // (bytes, not characters: emoji and accented letters take more than 1 byte each)
  if (checkLength && Buffer.byteLength(password, 'utf8') > 72) {
    return 'Password is too long';
  }
  return null;
}


router.post('/signup', async (req, res) => {
  const { username, password } = req.body ?? {};
  // ?? is necessary because if req.body is undefined, it will default to an empty object, preventing a runtime error

  const signupProblem = checkCredentials(username, password, true);
  if (signupProblem) {
    return res.status(400).json({ error: signupProblem });
  }

  // check if the username is already in the database
  const { data: existing, error: findError } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .maybeSingle();

  if (findError) {
    // the real reason goes to our terminal, the client only sees the generic message
    console.error('signup lookup failed:', findError);
    return res.status(500).json({ error: 'Database error' });
  }

  if (existing) {
    return res.status(409).json({ error: 'Username already taken' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // save the new user to the database
  const { error: insertError } = await supabase
    .from('users')
    .insert({ username, password_hash: passwordHash });

  if (insertError) {
    // 23505 = unique violation (two signups with the same username at once)
    if (insertError.code === '23505') {
      return res.status(409).json({ error: 'Username already taken' });
    }
    console.error('signup insert failed:', insertError);
    return res.status(500).json({ error: 'Database error' });
  }

  res.status(201).json({ message: 'User created' });
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body ?? {};

  // without this, a missing username gets sent straight to the database query
  const loginProblem = checkCredentials(username, password, false);
  if (loginProblem) {
    return res.status(400).json({ error: loginProblem });
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('id, username, password_hash')
    .eq('username', username)
    .maybeSingle();

  if (error) {
    console.error('login lookup failed:', error);
    return res.status(500).json({ error: 'Database error' });
  }

  // always run bcrypt.compare, even if the user doesn't exist.
  // compare is slow on purpose, so skipping it for unknown usernames would make
  // those responses noticeably faster, and someone could time requests to find
  // out which usernames are real. the dummy hash never matches a real password.
  // password is guaranteed to be a string now, so no ?? '' fallback needed
  const match = await bcrypt.compare(password, user ? user.password_hash : dummyHash);

  if (!user || !match) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // log the real reason for us, but don't tell the client how the server is set up
  if (!key) {
    console.error('JWT_KEY is missing from secrets.env');
    return res.status(500).json({ error: 'Server error' });
  }

  // create and signs token for the user
  // the field name here has to match TokenPayload in middleware.ts,
  // otherwise req.user.username comes out undefined on protected routes
  const token = jwt.sign({ username: user.username }, key, { expiresIn: '6h' });
  res.json({token});
});

export default router;
