import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../users/dto/role.enum';

/**
 * RegisterDto
 * ---------
 * Data Transfer Object (DTO) utilisé pour valider les données
 * envoyées lors de la tentative d'inscription d'un utilisateur.
 *
 * Grâce aux décorateurs de `class-validator`, on s'assure
 * que les champs reçus respectent les contraintes avant même
 * de passer à la logique métier.
 */
export class RegisterDto {
  /**
   * Le username de l'utilisateur
   * - Ne doit pas être vide
   * - Doit être un string valide
   * - Doit contenir au moins 2 caractères
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  username: string;

  /**
   * L'email de l'utilisateur
   * - Doit être une adresse email valide (ex : test@exemple.com)
   */
  @IsEmail()
  email: string;

  /**
   * Le rôle de l'utilisateur
   * - Champ optionel lors de l'inscription
   * - Doit correspondre à une valeur de l'énumération UserRole (`admin`, `user`)
   */
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  /**
   * Le mot de passe de l'utilisateur
   * - Ne peut pas être vide
   * - Doit contenir au moins 6 caractères
   * ~ (Validator supplémentire à implémenter lors de la mise en prod)
   */
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  /**
   * Le confirmation du mot de passe de l'utilisateur
   * - Ne peut pas être vide
   * - Doit contenir au moins 6 caractères
   * ~ (Validator supplémentire à implémenter lors de la mise en prod)
   */
  @IsNotEmpty()
  @MinLength(6)
  confirmPassword: string;
}
