import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class AddMangaDto {
  @IsNotEmpty()
  @IsNumber()
  idManga: number;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true }) // vérifie que chaque élément est un nombre
  @Type(() => Number) // transforme les strings en number si besoin
  tomesPossedes: number[];
}
