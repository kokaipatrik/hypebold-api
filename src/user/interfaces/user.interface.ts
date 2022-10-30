import { Types } from 'mongoose';
import { UserProfile } from '../schema/user.schema';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface ValidatedUser {
  id: Types.ObjectId;
  username: string;
  email: string;
  role: string;
  profile: UserProfile;
}
