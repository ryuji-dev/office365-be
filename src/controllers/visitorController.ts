import { Request, Response } from 'express';
import Visitor from '../models/Visitor';

// 방문자 정보 저장
export const registration = async (req: Request, res: Response) => {
  try {
    const {
      department,
      name,
      email,
      phone,
      visitDate,
      visitTarget,
      visitPurpose,
    } = req.body;

    const newVisitor = new Visitor({
      department,
      name,
      email,
      phone,
      visitDate,
      visitTarget,
      visitPurpose,
    });

    await newVisitor.save();
    res.status(200).json({
      message: '방문 정보가 성공적으로 저장되었습니다.',
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: '방문 정보를 저장하는 중 오류가 발생했습니다.', error });
  }
};

// 전체 방문자 정보 조회
export const getVisitors = async (req: Request, res: Response) => {
  try {
    const visitors = await Visitor.find();
    res.status(200).json({
      message: '방문 정보가 성공적으로 조회되었습니다.',
      visitors,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: '방문 정보를 조회하는 중 오류가 발생했습니다.', error });
  }
};
