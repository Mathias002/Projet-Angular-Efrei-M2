import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Collection } from './schemas/collection.schema';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  async create(@Body() createCollectionDto: CreateCollectionDto): Promise<Collection> {
    return this.collectionsService.create(createCollectionDto);
  }

  @Put(':collectionId')
  async update(
    @Param('collectionId') collectionId: string,
    @Body() updateCollectionDto: UpdateCollectionDto
  ): Promise<Collection | null> {
    return this.collectionsService.update(collectionId, updateCollectionDto);
  }

  @Delete(':collectionId')
  async delte(@Param('collectionId') collectionId: string): Promise<Collection | null> {
    return this.collectionsService.delete(collectionId);
  }

  @Get()
  async findAll(): Promise<Collection[]> {
    return this.collectionsService.findAll();
  }

  @Get('user/:userId')
  async findCollectionByUser(@Param('userId') userId: string): Promise<Collection[]> {
    return this.collectionsService.findCollectionByUser(userId);
  }

  @Get(':collectionId')
  async findOne(@Param('collectionId') collectionId: string): Promise<Collection | null> {
    return this.collectionsService.findOne(collectionId);
  }
}
