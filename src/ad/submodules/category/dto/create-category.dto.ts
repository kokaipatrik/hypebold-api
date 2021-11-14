import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly url: string;

  @IsDateString()
  @IsNotEmpty()
  readonly createdAt: Date;

  @IsDateString()
  readonly updatedAt: Date;
}
