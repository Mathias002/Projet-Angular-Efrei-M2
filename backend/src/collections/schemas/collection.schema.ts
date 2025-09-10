import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MangaInfo } from '../../mangas/schemas/manga.schema';

export type CollectionDocument = Collection & Document;

@Schema({ timestamps: true })
export class Collection {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'userId', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [{ idManga: Number, tomesPossedes: [Number] }], default: [] })
  mangas: MangaInfo[];

  @Prop({ default: null })
  deletedAt: Date;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
