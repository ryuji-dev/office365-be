import { Request, Response } from 'express';
import path from 'path';
import multer from 'multer';
import User, { IUser } from '../models/User';

// 프로필 조회
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

// 디스크 저장소 설정
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, 'uploads');
  },
  filename: (req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// 파일 형식 제한
const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
  const filetypes = /jpeg|jpg|png|webp|svg/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) return cb(null, true);
  else cb(new Error('이미지 파일만 업로드 가능합니다.'), false);
};

// Multer 인스턴스 생성
export const uploadMulter = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
});

// 프로필 아바타 변경
export const changeAvatar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req.user as IUser)?._id;

    if (req.file) {
      const avatarPath = req.file.path;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profileImage: avatarPath },
        { new: true }
      );

      if (!updatedUser) {
        res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        return;
      }

      res.status(200).json({
        message: '프로필 아바타가 성공적으로 변경되었습니다.',
        user: updatedUser,
      });
    } else {
      res.status(400).json({ message: '파일이 업로드되지 않았습니다.' });
    }
  } catch (error) {
    res.status(500).json({
      message: '프로필 아바타 변경 중 오류가 발생했습니다.',
      error,
    });
  }
};
