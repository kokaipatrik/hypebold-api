import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class UpdateCurrencyDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly url: string;

  @IsString()
  @IsNotEmpty()
  readonly currency: string;

  @IsDateString()
  readonly updatedAt: Date;
}
