import mongoose, { Schema } from 'mongoose';

export interface IUser {
  _id: string;
  email: string;
  password: string;
  contact: string;
  profileImage: string;
  registerType: 'local' | 'google' | 'naver' | 'kakao';
  socialId: string;
}

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  contact: { type: String },
  profileImage: { type: String },
  registerType: {
    type: String,
    enum: ['local', 'google', 'naver', 'kakao'],
    default: 'local',
  },
  socialId: { type: String },
});

export default mongoose.model<IUser>('User', UserSchema);
