import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class UpdateBrandDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly url: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsDateString()
  readonly updatedAt: Date;
}
