import { Module } from '@nestjs/common';
import { MangasService } from './mangas.service';
import { MangasController } from './mangas.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [MangasController],
  providers: [MangasService],
  exports: [MangasService],
})
export class MangasModule {}
