import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

@Schema({ collection: 'blocks' })
export class CreateBlock {
  @Prop()
  userId: Types.ObjectId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  visible: boolean;

  @Prop()
  open: boolean;

  @Prop()
  position: number;

  @Prop()
  type: string;
  
  @Prop({type: mongoose.Schema.Types.Mixed})
  data: any;
}

export type AdDocument = CreateBlock & Document;

export const CreateBlockSchema = SchemaFactory.createForClass(CreateBlock);
