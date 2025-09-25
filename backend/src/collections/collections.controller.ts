import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Collection } from './schemas/collection.schema';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { AddMangaDto } from '../mangas/dto/add-manga.dto';
import { UpdateMangaDto } from '../mangas/dto/update-manga.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/role.decorator';

/**
 * CollectionController
 * --------------
 * Contrôleur responsable de la gestion des collections.
 *
 * - Expose les routes pour les opérations CRUD et autres des collections.
 * - Dépend de `CollectionService` pour la logique métier.
 */
@Controller('collections')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CollectionsController {
  /**
   * Injection du service des collections.
   */
  constructor(private readonly collectionsService: CollectionsService) {}

  /**
   * Route POST /collections
   * -------------------------
   * Permet de créer une nouvelle collection en base de données.
   *
   * @param createCollectionDtoDto - Données de la collection à enregistrer
   * @returns la collection créé ou une erreur si les données sont invalides
   */
  @Post()
  async create(@Body() createCollectionDto: CreateCollectionDto): Promise<Collection> {
    return this.collectionsService.create(createCollectionDto);
  }

  /**
   * Route PUT /collections
   * -------------------------
   * Permet de modifier une collection en base de données.
   *
   * @param collectionId - Id de la collection à mettre à jour
   * @param updateCollectionDto - Données de la collection à modifier
   * @returns la collection modifiée ou une erreur si les données sont invalides
   */
  @Put(':collectionId')
  async update(
    @Param('collectionId') collectionId: string,
    @Body() updateCollectionDto: UpdateCollectionDto
  ): Promise<Collection | null> {
    return this.collectionsService.update(collectionId, updateCollectionDto);
  }

  /**
   * Route DELETE /collections
   * -------------------------
   * Permet de supprimer une collection en base de données.
   *
   * @param collectionId - Id de la collection à supprimer
   * @returns la collection supprimée ou une erreur si les données sont invalides
   */
  @Delete(':collectionId')
  async delete(@Param('collectionId') collectionId: string): Promise<Collection | null> {
    return this.collectionsService.delete(collectionId);
  }

  /**
   * Route GET /collections
   * -------------------------
   * Permet de récupérer toute les collections active en base de données.
   *
   * @param NoParams - Pas de paramètres requis
   * @returns Toutes les collection active ou une erreur si les données sont invalides
   */
  @Get()
  @Role('admin')
  async findAll(): Promise<Collection[]> {
    return this.collectionsService.findAll();
  }

  /**
   * Route GET /collections/user/@param userId
   * -------------------------
   * Permet de récupérer les collections active d'un utilisateur.
   *
   * @param userId - Id de l'utilisateur
   * @returns Les collection active de l'utilisateur ou une erreur si les données sont invalides
   */
  @Get('user/:userId')
  async findCollectionByUser(@Param('userId') userId: string): Promise<Collection[]> {
    return this.collectionsService.findCollectionByUser(userId);
  }

  /**
   * Route GET /collections/@param collectionId
   * -------------------------
   * Permet de récupérer une collections.
   *
   * @param collectionId - Id de la collection à récupérer
   * @returns La collection ou une erreur si les données sont invalides
   */
  @Get(':collectionId')
  async findOne(@Param('collectionId') collectionId: string): Promise<Collection> {
    return this.collectionsService.findOne(collectionId);
  }

  /**
   * Route POST /collections/@param collectionId/add-manga
   * -------------------------
   * Permet d'ajouter un manga dans une collections.
   *
   * @param collectionId - Id de la collection
   * @param addMangaDto - Données du manga à ajouter à la collection
   * @returns La collection ou une erreur si les données sont invalides
   */
  @Post(':collectionId/add-manga')
  async addManga(
    @Param('collectionId') collectionId: string,
    @Body() addMangaDto: AddMangaDto
  ): Promise<Collection | null> {
    return this.collectionsService.addManga(collectionId, addMangaDto);
  }

  /**
   * Route PUT /collections/@param collectionId/update-manga/@param collectionId
   * -------------------------
   * Permet de mettre à jour un manga dans une collections.
   *
   * @param collectionId - Id de la collection
   * @param mangaId - Id du manga
   * @param updateMangaDto - Donnée du manga à mettre à jour
   * @returns La collection ou une erreur si les données sont invalides
   */
  @Put(':collectionId/update-manga/:mangaId')
  async updateManga(
    @Param('collectionId') collectionId: string,
    @Param('mangaId') mangaId: number,
    @Body() updateMangaDto: UpdateMangaDto
  ): Promise<Collection | null> {
    return this.collectionsService.updateManga(collectionId, Number(mangaId), updateMangaDto);
  }

  /**
   * Route DELETE /collections/@param collectionId/delete-manga/@param mangaId
   * -------------------------
   * Permet de supprimer un manga d'une collections.
   *
   * @param collectionId - Id de la collection
   * @param mangaId - Id du manga
   * @returns La collection ou une erreur si les données sont invalides
   */
  @Delete(':collectionId/delete-manga/:mangaId')
  async deleteManga(
    @Param('collectionId') collectionId: string,
    @Param('mangaId') mangaId: number
  ): Promise<Collection | null> {
    return this.collectionsService.deleteManga(collectionId, Number(mangaId));
  }
}
