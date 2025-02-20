import express from 'express';
import passport from 'passport';
import { registration, getVisitors } from '../controllers/visitorController';

const router = express.Router();

router.post(
  '/registration',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    registration(req, res);
  }
);

router.get(
  '/visitors',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    getVisitors(req, res);
  }
);

export default router;
