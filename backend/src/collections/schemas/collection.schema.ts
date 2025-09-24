import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MangaInfo } from '../../mangas/schemas/manga.schema';

/**
 * CollectionDocument
 * ------------
 * Type pour typer les documents Collection
 */
export type CollectionDocument = Collection & Document;

/**
 * Collection
 * ----------
 * Schéma représentant une collection de mangas pour un utilisateur.
 *
 * - Contient un nom et une description optionnelle
 * - Liée à un utilisateur via son ObjectId
 * - Contient un tableau de mangas avec les tomes possédés
 * - Utilise `timestamps: true` pour stocker `createdAt` et `updatedAt`
 */
@Schema({ timestamps: true })
export class Collection {
  /**
   * Nom de la collection (obligatoire)
   */
  @Prop({ required: true })
  name: string;

  /**
   * Description de la collection (facultatif)
   */
  @Prop()
  description: string;

  /**
   * Référence vers l'utilisateur propriétaire de la collection.
   * Utilise un ObjectId de MongoDB.
   */
  @Prop({ type: Types.ObjectId, ref: 'userId', required: true })
  userId: Types.ObjectId;

  /**
   * Tableau des mangas contenus dans la collection.
   * Chaque élément contient :
   * - idManga : identifiant du manga (Number)
   * - tomesPossedes : liste des numéros de tomes possédés (Array<Number>)
   *
   * Par défaut : tableau vide.
   */
  @Prop({ type: [{ idManga: Number, tomesPossedes: [Number] }], default: [] })
  mangas: MangaInfo[];

  /**
   * Date de suppression logique (soft delete).
   * Si `null`, la collection est active.
   */
  @Prop({ default: null })
  deletedAt: Date;
}

/**
 * Génération du schéma Mongoose à partir de la classe.
 */
export const CollectionSchema = SchemaFactory.createForClass(Collection);
