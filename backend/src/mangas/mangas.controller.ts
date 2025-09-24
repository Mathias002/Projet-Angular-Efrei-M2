import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { MangasService } from './mangas.service';

@Controller('mangas')
export class MangasController {
  constructor(private readonly mangasService: MangasService) {}

  /**
   * GET /mangas/@param mangaId
   * --------------------
   * Retourne un manga spécifique en fonction de son identifiant.
   *
   * @param mangaId - Identifiant numérique du manga (paramètre de route)
   * @throws le manga ou une erreur si les données sont invalides
   */
  @Get(':mangaId')
  async getMangaById(@Param('mangaId') mangaId: string) {
    // Vérifie que mangaId est bien un nombre valide
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

  /**
   * GET /mangas
   * -----------
   * Retourne la liste complète des mangas disponible sur l'API.
   */
  @Get()
  async getMangaSearch() {
    return this.mangasService.getMangaSearch();
  }
}
