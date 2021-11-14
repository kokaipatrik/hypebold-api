import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Condition {
  @Prop()
  name: string;

  @Prop()
  url: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type ConditionDocument = Condition & Document;

export const ConditionSchema = SchemaFactory.createForClass(Condition);
