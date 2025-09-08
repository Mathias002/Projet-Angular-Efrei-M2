import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Collection, CollectionDocument } from './schemas/collection.schema';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(Collection.name) private collectionModel: Model<CollectionDocument>,
    private usersService: UsersService
  ) {}

  async create(createCollectionDto: CreateCollectionDto): Promise<Collection> {
    const newCollection = new this.collectionModel({
      ...createCollectionDto,
    });

    // check if user exist before save in db
    await this.usersService.findOne(newCollection.userId.toString());

    return newCollection.save();
  }

  async update(
    collectionid: string,
    updateCollectionDto: UpdateCollectionDto
  ): Promise<Collection | null> {
    // check if collection exist before updating
    await this.findOne(collectionid);

    return this.collectionModel
      .findByIdAndUpdate(collectionid, updateCollectionDto, { new: true })
      .exec();
  }

  async delete(collectionid: string): Promise<Collection | null> {
    // check if collection exist befere soft-deleting
    await this.findOne(collectionid);

    return this.collectionModel.findByIdAndUpdate(collectionid, { deletedAt: Date.now() });
  }

  async findAll(): Promise<Collection[]> {
    // get all active collections
    const collections = await this.collectionModel.find({ deletedAt: null }).exec();

    if (collections.length !== 0) {
      // at least one collection was returned
      return collections;
    } else {
      // no collection was returned -> NotFoundException
      throw new NotFoundException("Une erreur c'est produite", {
        cause: new Error(),
        description: "Il semblerait qu'il n'existe pas encore de collection :(",
      });
    }
  }

  async findCollectionByUser(userId: string): Promise<Collection[]> {
    // check if user exist
    await this.usersService.findOne(userId);

    // returns active collections associeted with the param userId
    const collections = await this.collectionModel.find({ deletedAt: null, userId: userId });

    if (collections.length !== 0) {
      // at least one collection was returned
      return collections;
    } else {
      // no collection was returned -> NotFoundException
      throw new NotFoundException("Une erreur c'est produite", {
        cause: new Error(),
        description: 'Désolé cet utilisateur ne possède aucunne collection :(',
      });
    }
  }

  async findOne(collectionid: string): Promise<Collection | null> {
    // get active collection associated with the param collectionId
    const collection = await this.collectionModel
      .findOne({ _id: collectionid, deletedAt: null })
      .exec();

    if (collection) {
      // the collection exist, it is returned
      return collection;
    } else {
      // no collection was returned -> NotFoundException
      throw new NotFoundException("Une erreur c'est produite", {
        cause: new Error(),
        description: "Il semblerait que cette collection n'existe pas :(",
      });
    }
  }

  // add manga func (add/delete)
}
