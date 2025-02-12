import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../modles/User';

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

    res.status(201).send(newUser);
  } catch (error) {
    const errorMessage =
      (error as Error).message || '회원가입 중 오류가 발생했습니다.';
    res.status(500).send({ error: errorMessage });
  }
};
