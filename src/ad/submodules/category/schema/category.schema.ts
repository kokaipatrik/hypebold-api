import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema()
export class Category {
  @Prop()
  name: string;

  @Prop()
  url: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type CategoryDocument = Category & Document;

export const CategorySchema = SchemaFactory.createForClass(Category);
