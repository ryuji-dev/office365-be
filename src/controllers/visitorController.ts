import { Request, Response } from 'express';
import Visitor from '../models/Visitor';
import mongoose from 'mongoose';

// 방문자 정보 저장
export const registration = async (req: Request, res: Response) => {
  try {
    const {
      department,
      name,
      email,
      phone,
      visitStartDate,
      visitEndDate,
      visitTarget,
      visitPurpose,
    } = req.body;

    const newVisitor = new Visitor({
      department,
      name,
      email,
      phone,
      visitStartDate,
      visitEndDate,
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

// 특정 방문자 정보 조회
export const getVisitorById = async (req: Request, res: Response) => {
  try {
    const { visitorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(visitorId)) {
      return res.status(400).json({
        message: '유효하지 않은 방문자 ID입니다.',
      });
    }

    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      return res.status(404).json({
        message: '방문자를 찾을 수 없습니다.',
      });
    }

    res.status(200).json({
      message: '방문 정보가 성공적으로 조회되었습니다.',
      visitor,
    });
  } catch (error) {
    res.status(500).json({
      message: '방문 정보를 조회하는 중 오류가 발생했습니다.',
      error,
    });
  }
};
