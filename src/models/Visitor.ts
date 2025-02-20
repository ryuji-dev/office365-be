import mongoose, { Schema } from 'mongoose';

export interface IVisitor {
  _id: string;
  department?: string;
  name?: string;
  email?: string;
  phone?: string;
  visitDate?: Date;
  visitTarget?: string;
  visitPurpose?: string;
  status?: '접수중' | '접수' | '처리완료';
}

const VisitorSchema = new Schema({
  department: { type: String },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  visitDate: { type: Date },
  visitTarget: { type: String },
  visitPurpose: { type: String },
  status: {
    type: String,
    enum: ['접수중', '접수', '처리완료'],
    default: '접수중',
  },
});

export default mongoose.model<IVisitor>('Visitor', VisitorSchema);
