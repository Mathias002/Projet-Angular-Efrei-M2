import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { CollectionDocument, Collection } from '../collections/schemas/collection.schema';

/**
 * UsersService
 * -----------
 * Service responsable de la logique métier liée aux users :
 * - CRUD des users
 */
@Injectable()
export class UsersService {
  constructor(
    /**
     * Injection du modèle User (Mongoose)
     * Permet d'interagir avec la collection "users" dans MongoDB
     */
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,

    /**
     * Injection du modèle Collection (Mongoose)
     * Permet d'interagir avec la collection "collections" dans MongoDB
     */
    @InjectModel(Collection.name) private collectionModel: Model<CollectionDocument>
  ) {}

  /**
   * create()
   * ----------
   * Crée un nouveau utilisateur en base de données après validation.
   *
   * @param createUserDto - Données de l'utilisateur (nom, description, etc.)
   * @returns Informations de l'utilisateur créé
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Vérifie si le champ `comfirmPassword` correspond au champ `password`
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException('Une erreur est survenue', {
        cause: new Error(),
        description:
          'Veillez vérifier que le mot de passe est similaire à celui renseigner dans la confirmation',
      });
    }

    // Hashage du mot de passe avec bcrypt
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Création de l'utilisateur dans la base
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword, // On remplace le mot de passe en clair par la version hashée
    });

    // Retourne un objet user sans mot de passe pour éviter toute fuite d'information sensible
    return newUser.save();
  }

  /**
   * update()
   * ----------
   * Met à jour une collection en base de données après validation.
   *
   * @param userId - Id de l'utilisateur à mettre à jour
   * @param updateUserDto - Données de l'utilisateur à mettre à jour(username, email, etc.)
   * @returns Informations de l'utilisateur modifiée
   */
  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    // Récupère l'utilsateur à mettre à jour
    const userUpdated = await this.findOne(userId);

    // Création d'un clone de updateUserDto pour mettre à jour les données
    const updateData: Partial<User> = {};

    // Copie des champs sauf le password
    if (updateUserDto.username !== undefined) {
      updateData.username = updateUserDto.username;
    }
    if (updateUserDto.email !== undefined) {
      updateData.email = updateUserDto.email;
    }
    if (updateUserDto.role !== undefined) {
      updateData.role = updateUserDto.role;
    }

    // Gestion du champ password
    if (updateUserDto.newPassword) {
      // Vérifie que le champ `confirmPassword` correspond au champ `newPassword`
      if (updateUserDto.newPassword !== updateUserDto.confirmPassword) {
        throw new BadRequestException('Une erreur est survenue', {
          cause: new Error(),
          description:
            'Veuillez vérifier que le mot de passe est similaire à celui renseigné dans la confirmation',
        });
      }

      // Vérifie que le champ `oldPassword`
      if (!updateUserDto.oldPassword) {
        throw new BadRequestException('Ancien mot de passe requis', {
          cause: new Error(),
          description: 'Votre ancien mot de passe est requis pour modifier le mot de passe.',
        });
      }

      // Vérifie que le champ `oldPassword` matche avec le mot de passe  de l'utilisateur
      const isMatch = await bcrypt.compare(updateUserDto.oldPassword, userUpdated.password);
      if (!isMatch) {
        throw new BadRequestException('Ancien mot de passe incorrect', {
          cause: new Error(),
          description: 'Veuillez vérifier votre ancien mot de passe.',
        });
      }

      // Hashage du nouveau mot de passe
      updateData.password = await bcrypt.hash(updateUserDto.newPassword, 10);
    }

    // Retourne l'utilisateur mis à jour
    return this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).exec();
  }

  /**
   * delete()
   * ----------
   * Suppression d'un utilisateur en base de données après validation.
   *
   * @param userId - Id de l'utilisateur à supprimer
   * @returns Informations de l'utilisateur supprimée
   */
  async delete(userId: string): Promise<User | null> {
    // Vérifie si l'utilisateur existe
    await this.findOne(userId);

    // Effectue la suppression et stocke les informations de l'utilisateur supprimée
    const deletedUser = await this.userModel
      .findByIdAndUpdate(userId, { deletedAt: Date.now() }, { new: true })
      .exec();

    // Soft-delete en cascade des collections de l'utilisateur supprimé
    await this.collectionModel.updateMany(
      { userId: userId, deletedAt: null },
      { deletedAt: Date.now() }
    );

    // Retourne l'utilisateur supprimé
    return deletedUser;
  }

  /**
   * findAll()
   * ----------
   * Récupération de tout les utilisateurs actif en base de données après validation.
   *
   * @param NoParams
   * @returns Liste de tout les utilisateurs actif
   */
  async findAll(): Promise<User[]> {
    // Récupère tout les utilisateurs actif
    const users = await this.userModel.find({ deletedAt: null }).exec();

    // Vérifie le contenue de `users`
    if (users.length !== 0) {
      // Si `users n'est pas null alors on retourne les `users`
      return users;
    } else {
      // Sinon on retourne une NotFoundException
      throw new NotFoundException('Une erreur est survenue', {
        cause: new Error(),
        description: 'Aucun utilisateur en vue :(',
      });
    }
  }

  /**
   * findOne()
   * ----------
   * Récupération d'un utilisateur en base de données après validation.
   *
   * @param userId - Id de l'utilisateur
   * @returns Informations de l'utilisateur
   */
  async findOne(userId: string): Promise<User> {
    // Récuperation de l'utilisateur
    const user = await this.userModel.findOne({ _id: userId, deletedAt: null }).exec();

    // Vérifie si l'utilisateur existe
    if (user) {
      // Si l'utilisateur existe on le retourne
      return user;
    } else {
      // Sinon on retourne une NotFoundException
      throw new NotFoundException('Une erreur est survenue', {
        cause: new Error(),
        description: 'Il semblerait que cet utilisateur ne soit pas de ce monde :(',
      });
    }
  }
}
