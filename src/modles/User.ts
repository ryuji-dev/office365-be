import mongoose, { Schema } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  contact: string;
}

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact: { type: String, required: true },
});

export default mongoose.model<IUser>('User', UserSchema);
