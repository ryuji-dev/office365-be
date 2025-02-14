import express from 'express';
import {
  signup,
  login,
  logout,
  googleLogin,
  googleCallback,
  googleLogout,
} from '../controllers/authController';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);
router.post('/google/logout', googleLogout);

export default router;
