import { Types } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface ValidatedUser {
  id: Types.ObjectId;
  email: string;
  role: string;
}
