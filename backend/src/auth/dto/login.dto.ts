import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

/**
 * LoginDto
 * ---------
 * Data Transfer Object (DTO) utilisé pour valider les données
 * envoyées lors de la tentative de connexion d'un utilisateur.
 *
 * Grâce aux décorateurs de `class-validator`, on s'assure
 * que les champs reçus respectent les contraintes avant même
 * de passer à la logique métier.
 */
export class LoginDto {
  /**
   * L'email de l'utilisateur
   * - Doit être une adresse email valide (ex : test@exemple.com)
   */
  @IsEmail()
  email: string;

  /**
   * Le mot de passe de l'utilisateur
   * - Ne peut pas être vide
   * - Doit contenir au moins 6 caractères
   * ~ (Validator supplémentire à implémenter lors de la mise en prod)
   */
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
