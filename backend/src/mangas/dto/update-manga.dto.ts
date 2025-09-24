import { IsArray, IsNotEmpty, IsNumber, ArrayMinSize, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * UpdateMangaDto
 * --------------
 * DTO (Data Transfer Object) utilisé pour mettre à jour les tomes possédés d'un manga
 * dans une collection existante.
 *
 * - Vérifie que la liste des tomes est un tableau de nombres
 * - Convertit automatiquement les valeurs reçues en nombres si besoin
 */
export class UpdateMangaDto {
  /**
   * Liste des tomes possédés (obligatoire et doit contenir uniquement des nombres)
   *
   * - @IsArray() : doit être un tableau
   * - @ArrayMinSize(1) : empêche l'envoi d'un tableau vide
   * - @IsNumber(..., { each: true }) : chaque élément doit être un nombre
   * - @Min(1) : interdit les valeurs négatives ou nulles (numéro de tome > 0)
   * - @Type(() => Number) : transforme les entrées en nombre si elles arrivent en string
   */
  @IsNotEmpty({ message: 'La liste des tomes est obligatoire.' })
  @IsArray({ message: 'Les tomes doivent être envoyés sous forme de tableau.' })
  @ArrayMinSize(1, { message: 'Vous devez fournir au moins un tome.' })
  @IsNumber({}, { each: true, message: 'Chaque tome doit être un nombre.' })
  @Min(1, { each: true, message: 'Chaque tome doit avoir un numéro supérieur ou égal à 1.' })
  @Type(() => Number)
  tomesPossedes: number[];
}
