import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { UserRole } from './role.enum';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  username: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  @ValidateIf((o) => o.oldPassword !== '')
  @MinLength(6)
  @IsString()
  @IsOptional()
  oldPassword?: string;

  @ValidateIf((o) => o.oldPassword !== '')
  @MinLength(6)
  @IsString()
  @IsOptional()
  newPassword?: string;

  @ValidateIf((o) => o.oldPassword !== '')
  @MinLength(6)
  @IsString()
  @IsOptional()
  confirmPassword?: string;
}
