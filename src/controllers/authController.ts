import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import passport from 'passport';
import User, { IUser } from '../models/User';

dotenv.config();

const JWT = process.env.JWT_SECRET;

if (!JWT) throw new Error('JWT 환경 변수가 설정되지 않았습니다.');

// 회원가입
export const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, password, passwordConfirm, contact } = req.body;

  if ((password || '').trim() !== (passwordConfirm || '').trim()) {
    res.status(400).send({ error: '비밀번호가 일치하지 않습니다' });
    return;
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      res.status(400).send({ error: '이미 가입된 이메일입니다.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, contact });

    await newUser.save();

    // 가입한 사용자 정보를 로그로 출력
    console.log('새로운 사용자 가입:', newUser);

    res.status(201).send(newUser);
  } catch (error) {
    const errorMessage =
      (error as Error).message || '회원가입 중 오류가 발생했습니다.';
    res.status(500).send({ error: errorMessage });
  }
};

// 로그인
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send({ error: '이메일과 비밀번호를 입력해주세요.' });
    return;
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).send({
        error: 'INVALID_EMAIL',
        message: '이메일이 존재하지 않습니다.',
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).send({
        error: 'INVALID_PASSWORD',
        message: '비밀번호가 일치하지 않습니다.',
      });
      return;
    }

    const token = jwt.sign(
      {
        userId: user._id,
        userEmail: user.email,
        registerType: 'local',
        socialId: null,
      },
      JWT,
      {
        expiresIn: '1h',
      }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });

    res.status(200).json({ message: '로그인에 성공했습니다.', token });
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).send(`로그인 중 오류가 발생했습니다: ${errorMessage}`);
  }
};

// 로그아웃
export const logout = (req: Request, res: Response): void => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({
      error: 'Unauthorized',
      message: '사용자가 로그인하지 않았습니다.',
    });
    return;
  }

  res.clearCookie('token');
  res.status(200).json({ message: '로그아웃 되었습니다.' });
};

// 소셜 로그인 처리 함수
const handleSocialLogin = async (
  req: Request,
  res: Response,
  provider: string
) => {
  if (req.user) {
    const user = req.user as IUser;

    let existingUser = await User.findById(user._id);

    if (!existingUser) {
      existingUser = await User.create({
        _id: user._id,
        email: user.email,
        profileImage: user.profileImage,
        registerType: provider,
        socialId: user.socialId,
      });
    }

    const token = jwt.sign(
      {
        userId: existingUser._id,
        userEmail: existingUser.email,
        profileImage: existingUser.profileImage,
        registerType: existingUser.registerType,
        socialId: existingUser.socialId,
      },
      JWT,
      {
        expiresIn: '1h',
      }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });

    res.redirect(
      `http://localhost:5173?loginSuccess=true&provider=${provider}`
    );
  } else {
    res.redirect('http://localhost:5173/login');
  }
};

// 구글 로그인 요청 처리
export const googleLogin = passport.authenticate('google', {
  scope: ['email', 'profile'],
});

// 구글 로그인 콜백 처리
export const googleCallback = async (req: Request, res: Response) => {
  passport.authenticate('google', { failureRedirect: '/' })(
    req,
    res,
    async () => {
      await handleSocialLogin(req, res, 'google');
    }
  );
};

// 구글 로그아웃
export const googleLogout = (req: Request, res: Response): void => {
  res.clearCookie('token');
  res.status(200).json({ message: '구글 로그아웃 되었습니다.' });
};

// 네이버 로그인 요청 처리
export const naverLogin = passport.authenticate('naver', {
  authType: 'reprompt',
});

// 네이버 로그인 콜백 처리
export const naverCallback = async (req: Request, res: Response) => {
  passport.authenticate('naver', { failureRedirect: '/' })(
    req,
    res,
    async () => {
      await handleSocialLogin(req, res, 'naver');
    }
  );
};

// 네이버 로그아웃
export const naverLogout = (req: Request, res: Response): void => {
  res.clearCookie('token');
  res.status(200).json({ message: '네이버 로그아웃 되었습니다.' });
};

// 카카오 로그인 요청 처리
export const kakaoLogin = passport.authenticate('kakao');

// 카카오 로그인 콜백 처리
export const kakaoCallback = async (req: Request, res: Response) => {
  passport.authenticate('kakao', { failureRedirect: '/' })(
    req,
    res,
    async () => {
      await handleSocialLogin(req, res, 'kakao');
    }
  );
};

// 카카오 로그아웃
export const kakaoLogout = (req: Request, res: Response): void => {
  res.clearCookie('token');
  res.status(200).json({ message: '카카오 로그아웃 되었습니다.' });
};
