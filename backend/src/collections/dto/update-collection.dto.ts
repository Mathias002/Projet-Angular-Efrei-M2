import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * update-collectionDTO
 * ---------
 * Data Transfer Object (DTO) utilisé pour valider les données
 * envoyées lors de la tentative de modification d'une collection.
 *
 * Grâce aux décorateurs de `class-validator`, on s'assure
 * que les champs reçus respectent les contraintes avant même
 * de passer à la logique métier.
 */
export class UpdateCollectionDto {
  /**
   * Le nom de la collection
   * - Ne peut pas être vide
   * - Doit être un string valide
   * - Doit contenir au moins 2 caractères
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  /**
   * La description de la collection
   * - Doit être un string valide
   * - Doit contenir au maximun 500 caractères
   */
  @IsString()
  @MaxLength(500)
  description: string;
}
