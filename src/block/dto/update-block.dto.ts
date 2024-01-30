import {
  IsNotEmpty,
  IsDateString,
  IsMongoId,
} from 'class-validator';
import { Types } from 'mongoose';

export class UpdateBlockDto {
  @IsMongoId()
  @IsNotEmpty()
  readonly userId: Types.ObjectId;

  @IsDateString()
  @IsNotEmpty()
  readonly updatedAt: Date;

  readonly visible?: boolean;

  readonly open?: boolean;

  readonly position?: number;

  readonly data?: any;
}
