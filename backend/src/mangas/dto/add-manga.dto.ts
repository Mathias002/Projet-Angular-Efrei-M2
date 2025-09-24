import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * AddMangaDto
 * -----------
 * DTO (Data Transfer Object) utilisé pour ajouter un manga dans une collection.
 *
 * - Vérifie que l'id du manga est bien un nombre
 * - Vérifie que les tomes possédés sont un tableau de nombres
 */
export class AddMangaDto {
  /**
   * Identifiant unique du manga (obligatoire et numérique)
   */
  @IsNotEmpty({ message: "L'identifiant du manga est obligatoire." })
  @IsNumber({}, { message: "L'identifiant du manga doit être un nombre." })
  idManga: number;

  /**
   * Liste des tomes possédés (obligatoire et doit contenir uniquement des nombres)
   *
   * - @IsArray() : vérifie que c'est bien un tableau
   * - @IsNumber(..., { each: true }) : vérifie que chaque élément du tableau est un nombre
   * - @Type(() => Number) : transforme automatiquement les valeurs reçues en nombres
   *   (utile si elles arrivent sous forme de chaînes depuis le JSON)
   */
  @IsNotEmpty({ message: 'La liste des tomes possédés est obligatoire.' })
  @IsArray({ message: 'Les tomes possédés doivent être dans un tableau.' })
  @IsNumber({}, { each: true, message: 'Chaque tome doit être un nombre.' })
  @Type(() => Number)
  tomesPossedes: number[];
}
