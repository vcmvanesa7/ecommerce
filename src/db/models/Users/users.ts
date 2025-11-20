import mongoose from 'mongoose';
import { Schema } from 'mongoose';

export interface IUser {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

const UserSchema : Schema<IUser> = new Schema({
  username: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema, 'Users');