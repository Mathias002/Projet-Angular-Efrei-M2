import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from './role.enum';

/**
 * CreateUserDto
 * -------------
 * DTO (Data Transfer Object) utilisé pour la création d'un nouvel utilisateur.
 *
 * Grâce aux décorateurs de `class-validator`, on s'assure
 * que les champs reçus respectent les contraintes avant même
 * de passer à la logique métier.
 */
export class CreateUserDto {
  /**
   * Nom d'utilisateur
   * - Obligatoire
   * - Doit être une chaîne d'au moins 2 caractères
   */
  @IsNotEmpty({ message: 'Le nom d’utilisateur est obligatoire.' })
  @IsString({ message: 'Le nom d’utilisateur doit être une chaîne de caractères.' })
  @MinLength(2, { message: 'Le nom d’utilisateur doit contenir au moins 2 caractères.' })
  username: string;

  /**
   * Email de l'utilisateur
   * - Doit être un email valide
   */
  @IsEmail({}, { message: 'Veuillez fournir un email valide.' })
  email: string;

  /**
   * Rôle de l'utilisateur
   * - Optionnel
   * - Doit être une valeur valide de l'énumération UserRole (ADMIN, USER)
   */
  @IsOptional()
  @IsEnum(UserRole, { message: 'Le rôle doit être une valeur valide de UserRole.' })
  role: UserRole;

  /**
   * Mot de passe
   * - Obligatoire
   * - Minimum 6 caractères
   */
  @IsNotEmpty({ message: 'Le mot de passe est obligatoire.' })
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' })
  password: string;

  /**
   * Confirmation du mot de passe
   * - Obligatoire
   * - Minimum 6 caractères
   * - Doit correspondre au mot de passe (vérifié côté service ou via un décorateur custom)
   */
  @IsNotEmpty({ message: 'La confirmation du mot de passe est obligatoire.' })
  @MinLength(6, { message: 'La confirmation doit contenir au moins 6 caractères.' })
  confirmPassword: string;
}
