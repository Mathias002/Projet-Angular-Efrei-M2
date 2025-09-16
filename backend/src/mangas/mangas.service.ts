import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MangasService {
  constructor(private httpService: HttpService) {}

  API = process.env.API_URL || '';
  header = { headers: { 'Content-Type': 'application/json' } };

  async checkManga(mangaId: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.API}/${mangaId}`, { timeout: 3000 })
      );

      // Si la requête réussit, l'API est joignable
      // Si elle renvoie bien un objet -> le manga existe
      if (!response.data) {
        return {
          apiReachable: true,
          exists: false,
          message: `Manga avec l'id ${mangaId} introuvable`,
        };
      }

      return {
        apiReachable: true,
        exists: true,
        data: response.data,
      };
    } catch (error) {
      if (error.response?.status === 404) {
        // L'API répond (donc joignable) mais le manga n'existe pas
        return {
          apiReachable: true,
          exists: false,
          message: `Manga avec l'id ${mangaId} introuvable`,
        };
      }

      // Si on tombe ici, c'est une erreur réseau ou un timeout
      console.error('API non joignable:', error.message);
      return {
        apiReachable: false,
        exists: false,
        message: 'Impossible de joindre l’API',
      };
    }
  }

  async getMangaById(mangaId: string) {
    const result = await this.checkManga(mangaId); // ✅ un seul appel

    if (!result.apiReachable) {
      throw new Error('API non joignable');
    }

    if (!result.exists) {
      throw new NotFoundException(`Manga avec l'id ${mangaId} introuvable`);
    }

    // Ici, on sait que le manga existe et on a déjà ses données
    return result.data;
  }
}
