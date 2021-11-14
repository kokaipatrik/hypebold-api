import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Currency {
  @Prop()
  name: string;

  @Prop()
  url: string;

  @Prop()
  currency: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type CurrencyDocument = Currency & Document;

export const CurrencySchema = SchemaFactory.createForClass(Currency);
