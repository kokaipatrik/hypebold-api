import {
    MaxLength,
    IsNotEmpty,
    IsString,
    IsBoolean,
    IsOptional,
} from 'class-validator';

export class UserProfileDto {
    @IsBoolean()
    @IsNotEmpty()
    readonly ignore: boolean;

    @IsOptional()
    @IsBoolean()
    readonly verified: boolean;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly cover: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly title: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly description: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly country: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    readonly town: string;

    @IsOptional()
    readonly links: string;
}
