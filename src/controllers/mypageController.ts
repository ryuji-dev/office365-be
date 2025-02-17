import { Request, Response } from 'express';
import path from 'path';
import User, { IUser } from '../models/User';

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req.user as IUser)?._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      return;
    }

    if (!user.profileImage) {
      user.profileImage = 'http://localhost:5173/src/assets/elice.png';
    } else {
      user.profileImage = `http://localhost:3000/uploads/${path.basename(
        user.profileImage
      )}`;
    }

    res.status(200).json({
      message: '프로필 조회를 완료했습니다.',
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: '프로필 조회 중 오류가 발생했습니다.', error });
  }
};
