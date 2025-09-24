import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * MangaDocument
 * -------------
 * Type combinant la classe MangaInfo et Document de Mongoose.
 */
export type MangaDocument = MangaInfo & Document;

/**
 * MangaInfo
 * ---------
 * Schéma représentant les informations d'un manga dans une collection.
 *
 * - idManga : identifiant unique du manga (numérique)
 * - tomesPossedes : liste des numéros de tomes possédés
 */
@Schema()
export class MangaInfo {
  /**
   * Identifiant unique du manga (obligatoire)
   */
  @Prop({ required: true })
  idManga: number;

  /**
   * Liste des tomes possédés
   * - Par défaut, tableau vide
   * - Chaque élément doit être un nombre
   */
  @Prop({ type: [Number], default: [] })
  tomesPossedes: number[];
}

/**
 * Génération du schéma Mongoose
 */
export const MangaSchema = SchemaFactory.createForClass(MangaInfo);
