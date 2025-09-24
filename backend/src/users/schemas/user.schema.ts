import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * UserDocument
 * ------------
 * Type combinant la classe User et Document de Mongoose.
 */
export type UserDocument = User & Document;

/**
 * User
 * ----
 * Schéma représentant un utilisateur dans la base de données.
 *
 * - Contient les informations essentielles (username, email, password)
 * - Utilise les timestamps pour `createdAt` et `updatedAt`
 * - Supporte un soft delete via `deletedAt`
 */
@Schema({ timestamps: true })
export class User {
  /**
   * Nom d'utilisateur (unique et obligatoire)
   */
  @Prop({ required: true, unique: true })
  username: string;

  /**
   * Adresse email (unique et obligatoire)
   */
  @Prop({ required: true, unique: true })
  email: string;

  /**
   * Mot de passe hashé
   */
  @Prop({ required: true })
  password: string;

  /**
   * Rôle de l'utilisateur
   * - Peut être "user" ou "admin"
   * - Défaut : "user"
   */
  @Prop({ enum: ['user', 'admin'], default: 'user' })
  role: string;

  /**
   * Date de suppression (soft delete)
   * - Null si le compte est actif
   */
  @Prop({ default: null })
  deletedAt: Date;
}

/**
 * Génération du schéma Mongoose à partir de la classe User.
 */
export const UserSchema = SchemaFactory.createForClass(User);
