import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import './config/passport';
import './middlewares/passport';
import authRoute from './routes/authRoute';
import mypageRoute from './routes/mypageRoute';
import visitorRoute from './routes/visitorRoute';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.JWT_SECRET!,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/v1', authRoute);
app.use('/api/v1/mypage', mypageRoute);
app.use('/api/v1/visitor', visitorRoute);

export default app;
