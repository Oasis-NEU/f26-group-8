import express, { type Express, type Request, type Response } from 'express';
import authRouter from './auth.js';

const app: Express = express();
app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  res.send('ABOUT');
});

app.use('/auth', authRouter);

app.use(express.static('frontend'))
app.listen(3000);




