import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../modles/User';

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

    if (!user || !user.password) {
      res
        .status(401)
        .send({ error: '이메일 또는 비밀번호가 일치하지 않습니다.' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res
        .status(401)
        .send({ error: '이메일 또는 비밀번호가 일치하지 않습니다.' });
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
