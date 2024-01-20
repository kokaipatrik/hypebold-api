import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsMongoId,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateBlockDto {
  @IsMongoId()
  @IsNotEmpty()
  readonly userId: Types.ObjectId;

  @IsDateString()
  @IsNotEmpty()
  readonly createdAt: Date;

  @IsDateString()
  readonly updatedAt: Date;

  @IsBoolean()
  @IsNotEmpty()
  readonly visible: boolean;

  @IsBoolean()
  @IsNotEmpty()
  readonly open: boolean;

  @IsNumber()
  @IsNotEmpty()
  readonly position: number;

  @IsString()
  @IsNotEmpty()
  readonly type: string;
  
  @IsNotEmpty()
  readonly data: any;
}
