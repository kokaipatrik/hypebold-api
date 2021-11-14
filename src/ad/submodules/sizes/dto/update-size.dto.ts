import { IsNotEmpty, IsMongoId, IsDateString } from 'class-validator';
import { Types } from 'mongoose';

import { shoes } from '../types/size.types';

export class UpdateSizeDto {
  @IsMongoId()
  @IsNotEmpty()
  readonly categoryId: Types.ObjectId;

  @IsNotEmpty()
  readonly size: shoes | string;

  @IsDateString()
  readonly updatedAt: Date;
}
