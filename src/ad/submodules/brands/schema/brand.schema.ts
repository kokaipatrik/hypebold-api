import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Brand {
  @Prop()
  name: string;

  @Prop()
  url: string;

  @Prop()
  description: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type BrandDocument = Brand & Document;

export const BrandSchema = SchemaFactory.createForClass(Brand);
