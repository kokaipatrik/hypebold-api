import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Delivery {
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

export type DeliveryDocument = Delivery & Document;

export const DeliverySchema = SchemaFactory.createForClass(Delivery);
