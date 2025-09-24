import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

/**
 * MangasService
 * -------------
 * Service responsable de l'interaction avec l'API externe pour récupérer
 * des informations sur les mangas.
 *
 * - Vérifie l'existence d'un manga (checkManga)
 * - Récupère un manga par son identifiant (getMangaById)
 * - Récupère la liste globale des mangas (getMangaSearch)
 */
@Injectable()
export class MangasService {
  constructor(private httpService: HttpService) {}

  /** URL de base de l'API externe (configurable via variables d'environnement) */
  API = process.env.API_URL || '';

  /** Headers communs pour les requêtes HTTP */
  header = { headers: { 'Content-Type': 'application/json' } };

  /**
   * Vérifie l'existence d'un manga en interrogeant l'API externe.
   *
   * @param mangaId - Identifiant du manga à vérifier
   * @returns Objet indiquant si l'API est joignable, si le manga existe, et les données le cas échéant
   */
  async checkManga(mangaId: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.API}/${mangaId}`, { timeout: 3000 })
      );

      // Si on a bien une réponse mais pas de data -> manga inexistant
      if (!response.data) {
        return {
          apiReachable: true,
          exists: false,
          message: `Manga avec l'id ${mangaId} introuvable`,
        };
      }

      // Manga trouvé
      return {
        apiReachable: true,
        exists: true,
        data: response.data,
      };
    } catch (error) {
      if (error.response?.status === 404) {
        // L'API répond mais le manga n'existe pas
        return {
          apiReachable: true,
          exists: false,
          message: `Manga avec l'id ${mangaId} introuvable`,
        };
      }

      // Autres erreurs : timeout, API down, DNS, etc.
      console.error('API non joignable:', error.message);
      return {
        apiReachable: false,
        exists: false,
        message: 'Impossible de joindre l’API',
      };
    }
  }

  /**
   * Récupère un manga précis en utilisant checkManga().
   *
   * @param mangaId - Identifiant du manga
   * @throws ServiceUnavailableException si l'API est injoignable
   * @throws NotFoundException si le manga n'existe pas
   */
  async getMangaById(mangaId: string) {
    const result = await this.checkManga(mangaId); // ✅ un seul appel

    if (!result.apiReachable) {
      throw new ServiceUnavailableException('API externe non joignable');
    }

    if (!result.exists) {
      throw new NotFoundException(`Manga avec l'id ${mangaId} introuvable`);
    }

    return result.data;
  }

  /**
   * Récupère la liste globale des mangas depuis l'API externe.
   */
  async getMangaSearch() {
    const response = await lastValueFrom(this.httpService.get(`${this.API}`, { timeout: 3000 }));

    return response.data;
  }
}
