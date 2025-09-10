import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Collection } from './schemas/collection.schema';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { AddMangaDto } from '../mangas/dto/add-manga.dto';
import { UpdateMangaDto } from '../mangas/dto/update-manga.dto';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  /**
   * Create a new collection.
   * @param createCollectionDto - Data Transfer Object containing collection details.
   * @returns The created Collection object.
   */
  @Post()
  async create(@Body() createCollectionDto: CreateCollectionDto): Promise<Collection> {
    return this.collectionsService.create(createCollectionDto);
  }

  /**
   * Update an existing collection.
   * @param collectionId - The ID of the collection to update.
   * @param updateCollectionDto - Data Transfer Object containing updated collection details.
   * @returns The updated Collection object or null if not found.
   */
  @Put(':collectionId')
  async update(
    @Param('collectionId') collectionId: string,
    @Body() updateCollectionDto: UpdateCollectionDto
  ): Promise<Collection | null> {
    return this.collectionsService.update(collectionId, updateCollectionDto);
  }

  /**
   * Delete (soft-delete) a collection by ID.
   * @param collectionId - The ID of the collection to delete.
   * @returns The deleted Collection object or null if not found.
   */
  @Delete(':collectionId')
  async delte(@Param('collectionId') collectionId: string): Promise<Collection | null> {
    return this.collectionsService.delete(collectionId);
  }

  /**
   * Retrieve all active collections.
   * @returns An array of Collection objects.
   */
  @Get()
  async findAll(): Promise<Collection[]> {
    return this.collectionsService.findAll();
  }

  /**
   * Retrieve all collections for a specific user.
   * @param userId - The ID of the user whose collections to retrieve.
   * @returns An array of Collection objects.
   */
  @Get('user/:userId')
  async findCollectionByUser(@Param('userId') userId: string): Promise<Collection[]> {
    return this.collectionsService.findCollectionByUser(userId);
  }

  /**
   * Retrieve a single collection by ID.
   * @param collectionId - The ID of the collection to retrieve.
   * @returns The Collection object or throws NotFoundException if not found.
   */
  @Get(':collectionId')
  async findOne(@Param('collectionId') collectionId: string): Promise<Collection> {
    return this.collectionsService.findOne(collectionId);
  }

  /**
   * Add a manga to a collection.
   * @param collectionId - The ID of the collection.
   * @param addMangaDto - Data Transfer Object containing manga details.
   * @returns The updated Collection object or null if not found.
   */
  @Post(':collectionId/add-manga')
  async addManga(
    @Param('collectionId') collectionId: string,
    @Body() addMangaDto: AddMangaDto
  ): Promise<Collection | null> {
    return this.collectionsService.addManga(collectionId, addMangaDto);
  }

  /**
   * Update a manga in a collection.
   * @param collectionId - The ID of the collection.
   * @param mangaId - The ID of the manga to update.
   * @param updateMangaDto - Data Transfer Object containing updated manga details.
   * @returns The updated Collection object or null if not found.
   */
  @Put(':collectionId/update-manga/:mangaId')
  async updateManga(
    @Param('collectionId') collectionId: string,
    @Param('mangaId') mangaId: number,
    @Body() updateMangaDto: UpdateMangaDto
    // ajout check user
  ): Promise<Collection | null> {
    return this.collectionsService.updateManga(collectionId, Number(mangaId), updateMangaDto);
  }

  /**
   * Delete a manga from a collection.
   * @param collectionId - The ID of the collection.
   * @param mangaId - The ID of the manga to delete.
   * @returns The updated Collection object or null if not found.
   */
  @Delete(':collectionId/delete-manga/:mangaId')
  async deleteManga(
    @Param('collectionId') collectionId: string,
    @Param('mangaId') mangaId: number
    // ajout check user
  ): Promise<Collection | null> {
    return this.collectionsService.deleteManga(collectionId, Number(mangaId));
  }
}
