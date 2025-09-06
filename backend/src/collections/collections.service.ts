import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Collection, CollectionDocument } from './schemas/collection.schema';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(@InjectModel(Collection.name) private collectionModel: Model<CollectionDocument>) {}

  async create(createCollectionDto: CreateCollectionDto): Promise<Collection> {
    const newCollection = new this.collectionModel({
      ...createCollectionDto,
    });
    return newCollection.save();
  }

  async update(id: string, updateCollectionDto: UpdateCollectionDto): Promise<Collection | null> {
    return this.collectionModel.findByIdAndUpdate(id, updateCollectionDto, { new: true }).exec();
  }

  async delete(id: string): Promise<Collection | null> {
    return this.collectionModel.findByIdAndUpdate(id, { deletedAt: Date.now() });
  }

  async findAll(): Promise<Collection[]> {
    return this.collectionModel.find().exec();
  }

  async findOne(id: string): Promise<Collection | null> {
    return this.collectionModel.findById(id).exec();
  }
}
