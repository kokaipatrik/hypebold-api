import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Ad {
  @Prop()
  userId: Types.ObjectId;

  @Prop()
  categoryId: Types.ObjectId;

  @Prop()
  brandId: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  conditionId: Types.ObjectId;

  @Prop()
  price: number;

  @Prop()
  currencyId: Types.ObjectId;

  @Prop()
  sizeId: Types.ObjectId;

  @Prop()
  description: string;

  @Prop()
  town: string;

  @Prop()
  telephone: string;

  @Prop()
  deliveryId: Types.ObjectId;

  @Prop()
  images: Array<string>;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type AdDocument = Ad & Document;

export const AdSchema = SchemaFactory.createForClass(Ad);
