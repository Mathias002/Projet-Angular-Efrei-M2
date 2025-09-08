import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
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

  @IsOptional()
  @MinLength(6)
  @IsString()
  oldPassword: string;

  @IsOptional()
  @MinLength(6)
  @IsString()
  newPassword: string;

  @IsOptional()
  @MinLength(6)
  @IsString()
  confirmPassword: string;
}
