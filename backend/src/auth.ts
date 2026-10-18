import express from 'express';
import bcrypt from 'bcrypt';
import { supabase } from './db.js';
import jwt from 'jsonwebtoken'

const router = express.Router();
const key = process.env.JWT_KEY


router.post('/signup', async (req, res) => {
  const { username, password } = req.body ?? {};
  // ?? is necessary because if req.body is undefined, it will default to an empty object, preventing a runtime error

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // check if the username is already in the database
  const { data: existing, error: findError } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .maybeSingle();

  if (findError) {
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
    return res.status(500).json({ error: 'Database error' });
  }

  res.status(201).json({ message: 'User created' });
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body ?? {};


  const { data: user, error } = await supabase
    .from('users')
    .select('id, username, password_hash')
    .eq('username', username)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: 'Database error' });
  }

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

    const match = await bcrypt.compare(password ?? '', user.password_hash);

  if (!match) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  if (!key)
    return res.status(500).json({error: "Key does not exist"})

  // create and signs token for the user
  // the field name here has to match TokenPayload in middleware.ts,
  // otherwise req.user.username comes out undefined on protected routes
  const token = jwt.sign({ username: user.username }, key, { expiresIn: '6h' });
  res.json({token});
});

export default router;
