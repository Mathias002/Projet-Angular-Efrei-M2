import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Collection, CollectionDocument } from './schemas/collection.schema';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { UsersService } from '../users/users.service';
import { AddMangaDto } from '../mangas/dto/add-manga.dto';
import { UpdateMangaDto } from '../mangas/dto/update-manga.dto';

/**
 * CollectionService
 * -----------
 * Service responsable de la logique métier liée aux collections :
 * - CRUD des collections
 * - Ajout, modification, surppession des mangas dans la collection
 */
@Injectable()
export class CollectionsService {
  constructor(
    /**
     * Injection du modèle Collection (Mongoose)
     * Permet d'interagir avec la collection "collections" dans MongoDB
     */
    @InjectModel(Collection.name) private collectionModel: Model<CollectionDocument>,

    /**
     * Injection du service User
     * Permet de faire appel aux methods contenu dans user.service.ts
     */
    private usersService: UsersService
  ) {}

  /**
   * create()
   * ----------
   * Crée une nouvelle collection en base de données après validation.
   *
   * @param createCollectionDto - Données de la collection (nom, description, etc.)
   * @returns Informations de la collection créé
   */
  async create(createCollectionDto: CreateCollectionDto): Promise<Collection> {
    // Récupération des informations fourni par `createCollectionDto`
    const newCollection = new this.collectionModel({
      ...createCollectionDto,
    });

    // Vérifie si l'utilisateur rattaché à la collection existe
    await this.usersService.findOne(newCollection.userId.toString());

    // Retourne la collection crée
    return newCollection.save();
  }

  /**
   * update()
   * ----------
   * Met à jour une collection en base de données après validation.
   *
   * @param UpdateCollectionDto - Données de la collection à mettre à jour(nom, description, etc.)
   * @param collectionid - Id de la collection à mettre à jour
   * @returns Informations de la collection modifiée
   */
  async update(
    collectionid: string,
    updateCollectionDto: UpdateCollectionDto
  ): Promise<Collection | null> {
    // Vérifie si la collection existe
    await this.findOne(collectionid);

    // Effectue la modification et retourne les informations de la collection mis à jour
    return this.collectionModel
      .findByIdAndUpdate(collectionid, updateCollectionDto, { new: true })
      .exec();
  }

  /**
   * delete()
   * ----------
   * Suppression d'une collection en base de données après validation.
   *
   * @param collectionid - Id de la collection à mettre à jour
   * @returns Informations de la collection supprimée
   */
  async delete(collectionid: string): Promise<Collection | null> {
    // Vérifie si la collection existe
    await this.findOne(collectionid);

    // Effectue la suppression et retourne les informations de la collection supprimée
    return this.collectionModel.findByIdAndUpdate(
      collectionid,
      { deletedAt: Date.now() },
      { new: true }
    );
  }

  /**
   * findAll()
   * ----------
   * Récupération de toutes les collections active en base de données après validation.
   *
   * @param NoParams
   * @returns Liste de toutes les collections actives
   */
  async findAll(): Promise<Collection[]> {
    // Récupère toute les collections active
    const collections = await this.collectionModel.find({ deletedAt: null }).exec();

    // Vérifie le contenue de `collections`
    if (collections.length !== 0) {
      // Si `collections n'est pas null alors on retourne les collections`
      return collections;
    } else {
      // Sinon on retourne une NotFoundException
      throw new NotFoundException('Une erreur est survenue', {
        cause: new Error(),
        description: 'Il semblerait que personne ne possède de collection active :(',
      });
    }
  }

  /**
   * findCollectionByUser()
   * ----------
   * Récupération de toutes les collections active d'un utilisateur en base de données après validation.
   *
   * @param userId - Id de l'utilisateur
   * @returns Liste de toutes les collections actives d'un utilisateur
   */
  async findCollectionByUser(userId: string): Promise<Collection[]> {
    // Vérifie si l'utilisateur existe
    await this.usersService.findOne(userId);

    // Récupère toutes les collections active de l'utilisateur
    const collections = await this.collectionModel.find({ deletedAt: null, userId: userId });

    // Retourne les collections
    return collections;
  }

  /**
   * findOne()
   * ----------
   * Récupération d'une collection en base de données après validation.
   *
   * @param collectionId - Id de la collection
   * @returns Information de la collection
   */
  async findOne(collectionId: string): Promise<Collection> {
    // Récupère la collection
    const collection = await this.collectionModel
      .findOne({ _id: collectionId, deletedAt: null })
      .exec();

    // Vérifie si la collection existe
    if (collection) {
      // Si la collection existe on la retourne
      return collection;
    } else {
      // Sinon on retourne une NotFoundException
      throw new NotFoundException('Une erreur est survenue', {
        cause: new Error(),
        description: 'Il semble que cette collection ne soit pas répertoriée :(',
      });
    }
  }

  /**
   * addManga()
   * ----------
   * Ajout d'un manga dans une collection en base de données après validation.
   *
   * @param collectionId - Id de la collection
   * @param addMangaDto - Données du manga à ajouter
   * @returns Information de la collection
   */
  async addManga(collectionId: string, addMangaDto: AddMangaDto): Promise<Collection | null> {
    // Vérifie si la collection existe
    await this.findOne(collectionId);

    // Ajoute le manga dans la collection
    const FilledCollection = await this.collectionModel.findByIdAndUpdate(
      { _id: collectionId },
      {
        $push: {
          mangas: { idManga: addMangaDto.idManga, tomesPossedes: addMangaDto.tomesPossedes },
        },
      },
      { new: true }
    );

    // Retourne la collection
    return FilledCollection;
  }

  /**
   * updateManga()
   * ----------
   * Mise à jour d'un manga dans une collection en base de données après validation.
   *
   * @param collectionId - Id de la collection
   * @param mangaId - Id du manga
   * @param updateMangaDto - Données du manga à mettre à jour
   * @returns Information de la collection
   */
  async updateManga(
    collectionId: string,
    mangaId: number,
    updateMangaDto: UpdateMangaDto
  ): Promise<Collection | null> {
    // Récupèration de la collection
    const collection = await this.findOne(collectionId);

    // Récupèration du manga de la collection
    const manga = collection!.mangas.find((m) => m.idManga === mangaId);

    // Vérifie si le manga existe, si non retourne une NotFoundException
    if (!manga) {
      throw new NotFoundException(
        `Le manga avec l'id ${mangaId} n'existe pas dans cette collection.`
      );
    }

    // Mise à jour du manga
    const updatedMangaCollection = await this.collectionModel.findOneAndUpdate(
      { _id: collectionId, 'mangas.idManga': mangaId },
      { $set: { 'mangas.$.tomesPossedes': updateMangaDto.tomesPossedes } },
      { new: true }
    );

    // Retourne la collection mis à jour
    return updatedMangaCollection;
  }

  /**
   * deleteManga()
   * ----------
   * Mise à jour d'un manga dans une collection en base de données après validation.
   *
   * @param collectionId - Id de la collection
   * @param mangaId - Id du manga
   * @returns Information de la collection
   */
  async deleteManga(collectionId: string, mangaId: number): Promise<Collection | null> {
    // Récupération de la collection
    const collection = await this.findOne(collectionId);

    // Récupèration du manga de la collection
    const manga = collection!.mangas.find((m) => m.idManga === mangaId);

    // Vérifie si le manga existe, si non retourne une NotFoundException
    if (!manga) {
      throw new NotFoundException(
        `Le manga avec l'id ${mangaId} n'existe pas dans cette collection.`
      );
    }

    // Suppression du manga
    const emptiedCollection = await this.collectionModel.findByIdAndUpdate(
      { _id: collectionId },
      { $pull: { mangas: { idManga: mangaId } } },
      { new: true }
    );

    // Retourne la collection
    return emptiedCollection;
  }
}
