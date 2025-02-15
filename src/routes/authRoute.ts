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
  kakaoLogin,
  kakaoCallback,
  kakaoLogout,
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
router.get('/kakao', kakaoLogin);
router.get('/kakao/callback', kakaoCallback);
router.post('/kakao/logout', kakaoLogout);

export default router;
