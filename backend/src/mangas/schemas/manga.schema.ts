import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MangaDocument = MangaInfo & Document;

@Schema()
export class MangaInfo {
  @Prop({ required: true })
  idManga: number;

  @Prop({ type: [Number], default: [] })
  tomesPossedes: number[];
}

export const MangaSchema = SchemaFactory.createForClass(MangaInfo);
