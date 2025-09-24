import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * create-collectionDTO
 * ---------
 * Data Transfer Object (DTO) utilisé pour valider les données
 * envoyées lors de la tentative de création d'une collection.
 *
 * Grâce aux décorateurs de `class-validator`, on s'assure
 * que les champs reçus respectent les contraintes avant même
 * de passer à la logique métier.
 */
export class CreateCollectionDto {
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

  /**
   * L'id de l'utilisateur qui créer la collection
   * - Doit être un string valide
   * - Ne peut pas être vide
   */
  @IsString()
  @IsNotEmpty()
  userId: string;
}
