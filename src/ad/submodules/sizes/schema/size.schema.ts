import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema()
export class ShoesSize {
  @Prop()
  eu: number;

  @Prop()
  us: number;

  @Prop()
  uk: number;
}

@Schema()
export class Size {
  @Prop()
  categoryId: Types.ObjectId;

  @Prop({ type: {} })
  size: ShoesSize | string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type SizeDocument = Size & Document;

export const SizeSchema = SchemaFactory.createForClass(Size);
