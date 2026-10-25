import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import authRouter from './auth.js';

const app: Express = express();
app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  res.send('ABOUT');
});

app.use('/auth', authRouter);

// catch-all error handler: has to come after all the routes so it catches their errors.
// Express knows this is an error handler because it takes 4 arguments (err comes first),
// so we keep "next" even though we don't use it.
// Without this, Express sends back its default HTML error page with a stack trace,
// which shows the user details about our code they shouldn't see.
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  // log the real error in the terminal so we can see what went wrong
  console.error(err);
  // if a response already started sending, we can't send a new one,
  // so hand it back to Express to close the connection
  if (res.headersSent) {
    return next(err);
  }
  // express.json() marks its errors with a status, e.g. 400 when the client sends broken JSON.
  // that's the client's mistake, so pass the 4xx along instead of blaming the server with a 500
  const status = (err as { status?: number })?.status;
  if (status && status >= 400 && status < 500) {
    return res.status(status).json({ error: 'Bad request' });
  }
  // anything else is our fault: send the client a generic message, same style as the rest of our errors
  res.status(500).json({ error: 'Server error' });
});

// no express.static here: the frontend is its own Vite app (npm run dev in frontend/),
// and the old express.static('frontend') pointed at backend/frontend, which doesn't exist
app.listen(3000);




