import mongoose, { Schema } from 'mongoose';

export interface IVisitor {
  _id: string;
  department: string;
  name?: string;
  email?: string;
  phone?: string;
  visitDate?: Date;
  visitTarget?: string;
  visitPurpose?: string;
}

const VisitorSchema = new Schema({
  department: { type: String, required: true },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  visitDate: { type: Date },
  visitTarget: { type: String },
  visitPurpose: { type: String },
});

export default mongoose.model<IVisitor>('Visitor', VisitorSchema);
