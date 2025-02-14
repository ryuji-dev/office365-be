import express from 'express';
import {
  signup,
  login,
  logout,
  googleLogin,
  googleCallback,
  googleLogout,
  naverLogin,
  naverCallback,
  naverLogout,
} from '../controllers/authController';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);
router.post('/google/logout', googleLogout);
router.get('/naver', naverLogin);
router.get('/naver/callback', naverCallback);
router.post('/naver/logout', naverLogout);

export default router;
