import {
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsString,
  IsEmail,
  IsDateString,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsEmail()
  @MaxLength(30)
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  readonly password: string;

  @IsDateString()
  @IsNotEmpty()
  readonly createdAt: Date;

  @IsDateString()
  readonly updatedAt: Date;
}
