import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserProfileDto } from '../dto/user-profile.dto';

type LinkType = 'custom' | 'social';

export interface UserProfileLinks {
  type: LinkType;
  url: string;
  title: string;
}

export interface UserProfile {
  ignore: boolean;
  verified?: boolean;
  cover?: string;
  title?: string;
  description?: string;
  country?: string;
  town?: string;
  links?: Array<UserProfileLinks>;
}

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  role: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: [Types.ObjectId], ref: 'Ad' })
  ads: Array<Types.ObjectId>;

  @Prop({ type: UserProfileDto })
  profile: UserProfile;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
