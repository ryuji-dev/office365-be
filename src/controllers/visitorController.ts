import { Request, Response } from 'express';
import Visitor from '../models/Visitor';

export const selectDepartment = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const { department } = req.body;
    const newVisitor = new Visitor({
      department,
      name: '',
      email: '',
      phone: '',
      visitDate: new Date(),
      visitTarget: '',
      visitPurpose: '',
    });

    await newVisitor.save();

    res.status(200).json({
      message: '부서 정보가 성공적으로 저장되었습니다.',
      department: newVisitor.department,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: '부서 정보를 저장하는 중 오류가 발생했습니다.', error });
  }
};
