import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { CollectionsModule } from './collections/collections.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/collectionMangaDB'),
    UsersModule,
    CollectionsModule,
  ],
})
export class AppModule {}
