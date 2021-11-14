import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class UpdateConditionDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly url: string;

  @IsDateString()
  readonly updatedAt: Date;
}
