import mongoose, { Schema } from 'mongoose';

export interface IVisitor {
  _id: string;
  department: string;
  name: string;
  email: string;
  phone: string;
  visitStartDate: Date;
  visitEndDate: Date;
  visitTarget: string;
  visitPurpose: string;
  status: '접수중' | '접수' | '처리완료';
  createdAt: Date;
  updatedAt: Date;
}

const VisitorSchema = new Schema(
  {
    department: { type: String },
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    visitStartDate: { type: Date },
    visitEndDate: { type: Date },
    visitTarget: { type: String },
    visitPurpose: { type: String },
    status: {
      type: String,
      enum: ['접수중', '접수', '처리완료'],
      default: '접수중',
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IVisitor>('Visitor', VisitorSchema);
