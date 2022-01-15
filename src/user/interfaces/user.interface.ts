import { Types } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface ValidatedUser {
  id: Types.ObjectId;
  username: string;
  email: string;
  role: string;
}
