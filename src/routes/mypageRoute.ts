import express from 'express';
import passport from 'passport';
import {
  getProfile,
  changeAvatar,
  uploadMulter,
  changePassword,
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

router.post(
  '/change-password',
  passport.authenticate('jwt', { session: false }),
  changePassword
);

export default router;
