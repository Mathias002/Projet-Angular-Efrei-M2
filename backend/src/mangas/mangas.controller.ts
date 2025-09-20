import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { MangasService } from './mangas.service';

@Controller('mangas')
export class MangasController {
  constructor(private readonly mangasService: MangasService) {}

  @Get(':mangaId')
  async getMangaById(@Param('mangaId') mangaId: string) {
    if (parseInt(mangaId)) {
      return this.mangasService.getMangaById(mangaId);
    } else {
      throw new NotFoundException('Une erreur est survenue', {
        cause: new Error(),
        description:
          'Le type du paramètre renseigné (' + mangaId + ') est incorrect, un nombre est attendu.',
      });
    }
  }

  @Get()
  async getMangaSearch() {
    return this.mangasService.getMangaSearch();
  }
}
