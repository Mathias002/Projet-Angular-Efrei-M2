import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { CollectionsModule } from './collections/collections.module';
import { MangasModule } from './mangas/manga.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/collectionMangaDB'),
    UsersModule,
    CollectionsModule,
    MangasModule,
  ],
})
export class AppModule {}
