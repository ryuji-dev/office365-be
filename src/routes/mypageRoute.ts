import express from 'express';
import passport from 'passport';
import {
  getProfile,
  changeAvatar,
  uploadMulter,
} from '../controllers/mypageController';

const router = express.Router();

router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  getProfile
);

router.post(
  '/change-avatar',
  passport.authenticate('jwt', { session: false }),
  uploadMulter.single('avatar'),
  changeAvatar
);

export default router;
