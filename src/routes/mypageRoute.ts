import express from 'express';
import passport from 'passport';
import { getProfile } from '../controllers/mypageController';

const router = express.Router();

router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  getProfile
);

export default router;
