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

/**
 * UpdateUserDto
 * -------------
 * DTO (Data Transfer Object) utilisé pour la modification d'un utilisateur.
 *
 * Grâce aux décorateurs de `class-validator`, on s'assure
 * que les champs reçus respectent les contraintes avant même
 * de passer à la logique métier.
 */
export class UpdateUserDto {
  /**
   * Nom d'utilisateur
   * - Obligatoire
   * - Doit être une chaîne d'au moins 2 caractères
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  username: string;

  /**
   * Email de l'utilisateur
   * - Doit être un email valide
   */
  @IsEmail()
  email: string;

  /**
   * Rôle de l'utilisateur
   * - Optionnel
   * - Doit être une valeur valide de l'énumération UserRole (ADMIN, USER)
   */
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  /**
   * Ancien mot de passe
   * - Optionnel
   * - Pris en compte si différent de null
   * - Minimum 6 caractères
   */
  @ValidateIf((o) => o.oldPassword !== '')
  @MinLength(6)
  @IsOptional()
  oldPassword?: string;

  /**
   * Nouveau mot de passe
   * - Optionnel
   * - Pris en compte si différent de null
   * - Minimum 6 caractères
   */
  @ValidateIf((o) => o.oldPassword !== '')
  @MinLength(6)
  @IsOptional()
  newPassword?: string;

  /**
   * Confirmation du nouveau mot de passe
   * - Optionnel
   * - Pris en compte si différent de null
   * - Minimum 6 caractères
   */
  @ValidateIf((o) => o.oldPassword !== '')
  @MinLength(6)
  @IsOptional()
  confirmPassword?: string;
}
