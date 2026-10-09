import express from 'express';
import bcrypt from 'bcrypt';
import { users } from './db.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (users.find(u => u.username === username)) {
    return res.status(409).json({ error: 'Username already taken' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ username, passwordHash });

  res.status(201).json({ message: 'User created' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body ?? {};

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const match = await bcrypt.compare(password ?? '', user.passwordHash);
  if (!match) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // TODO: put w/ Jayden JWT function here when ready
  res.json({ token: 'TODO-jwt' });
});

export default router;
