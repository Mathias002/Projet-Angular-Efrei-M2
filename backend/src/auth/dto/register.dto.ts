import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../users/dto/role.enum';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  username: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @MinLength(6)
  confirmPassword: string;
}
