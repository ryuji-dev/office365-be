import express from 'express';
import cors from 'cors';
import authRoute from './routes/authRoute';

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use('/api/v1', authRoute);

export default app;
