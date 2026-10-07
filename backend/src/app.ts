import express, { type Express, type Request, type Response } from 'express';

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('ABOUT');
});

app.use(express.static('frontend'))
app.listen(3000);




