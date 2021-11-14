import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly url: string;

  @IsDateString()
  readonly updatedAt: Date;
}
