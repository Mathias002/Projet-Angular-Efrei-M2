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

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto
  ): Promise<Collection | null> {
    return this.collectionsService.update(id, updateCollectionDto);
  }

  @Delete(':id')
  async delte(@Param('id') id: string): Promise<Collection | null> {
    return this.collectionsService.delete(id);
  }

  @Get()
  async findAll(): Promise<Collection[]> {
    return this.collectionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Collection | null> {
    return this.collectionsService.findOne(id);
  }
}
