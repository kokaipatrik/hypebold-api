import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

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
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
