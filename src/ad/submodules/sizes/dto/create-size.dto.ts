import { IsNotEmpty, IsMongoId, IsDateString } from 'class-validator';
import { Types } from 'mongoose';

import { shoes } from '../types/size.types';

export class CreateSizeDto {
  @IsMongoId()
  @IsNotEmpty()
  readonly categoryId: Types.ObjectId;

  @IsNotEmpty()
  readonly size: shoes | string;

  @IsDateString()
  @IsNotEmpty()
  readonly createdAt: Date;

  @IsDateString()
  readonly updatedAt: Date;
}
