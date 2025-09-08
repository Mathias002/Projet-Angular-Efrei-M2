import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CollectionDocument = Collection & Document;

@Schema({ timestamps: true })
export class Collection {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'userId', required: true })
  userId: Types.ObjectId;

  // On stocke uniquement les IDs MyAnimeList
  @Prop({ type: [Number], default: [] })
  mangas: number[];

  @Prop({ default: null })
  deletedAt: Date;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
