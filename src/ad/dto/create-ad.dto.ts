import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsMongoId,
  IsNumber,
  IsArray,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateAdDto {
  @IsMongoId()
  @IsNotEmpty()
  readonly categoryId: Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  readonly brandId: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsMongoId()
  @IsNotEmpty()
  readonly conditionId: Types.ObjectId;

  @IsNumber()
  @IsNotEmpty()
  readonly price: string;

  @IsMongoId()
  @IsNotEmpty()
  readonly currencyId: Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  readonly sizeId: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  readonly town: string;

  @IsString()
  @IsNotEmpty()
  readonly telephone: string;

  @IsMongoId()
  @IsNotEmpty()
  readonly deliveryId: Types.ObjectId;

  @IsArray()
  @IsNotEmpty()
  readonly images: Array<string>;

  @IsDateString()
  @IsNotEmpty()
  readonly createdAt: Date;

  @IsDateString()
  readonly updatedAt: Date;
}
