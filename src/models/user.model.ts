// src/models/user.model.ts

import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {}

const userSchema: Schema = new Schema<IUserDocument>({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const UserModel = mongoose.model<IUserDocument>('User', userSchema);
export default UserModel;
