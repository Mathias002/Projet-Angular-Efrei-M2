import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { CollectionDocument, Collection } from '../collections/schemas/collection.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Collection.name) private collectionModel: Model<CollectionDocument>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password !== createUserDto.confirmPassword) {
      // the password fiel and the confirmPasswor field do not contain the same value -> BadRequestException
      throw new BadRequestException("Une erreur c'est produite", {
        cause: new Error(),
        description:
          'Veillez vérifier que le mot de passe est similaire à celui renseigner dans la confirmation',
      });
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return newUser.save();
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    // check if user exist before updating
    const userUpdated = await this.findOne(userId);

    // create clone of updateUserDto for updated data
    const updateData: Partial<User> = {};

    // copy non-password field
    if (updateUserDto.username !== undefined) {
      updateData.username = updateUserDto.username;
    }
    if (updateUserDto.email !== undefined) {
      updateData.email = updateUserDto.email;
    }
    if (updateUserDto.role !== undefined) {
      updateData.role = updateUserDto.role;
    }

    // Manage change of password
    if (updateUserDto.newPassword) {
      // check if newPassword and confirmPassword have the same value
      if (updateUserDto.newPassword !== updateUserDto.confirmPassword) {
        throw new BadRequestException("Une erreur s'est produite", {
          cause: new Error(),
          description:
            'Veuillez vérifier que le mot de passe est similaire à celui renseigné dans la confirmation',
        });
      }

      // check if field oldPassword is set
      if (!updateUserDto.oldPassword) {
        throw new BadRequestException('Ancien mot de passe requis', {
          cause: new Error(),
          description: "L'ancien mot de passe est requis pour modifier le mot de passe.",
        });
      }

      // check if oldPassword is correct
      const isMatch = await bcrypt.compare(updateUserDto.oldPassword, userUpdated.password);
      if (!isMatch) {
        throw new BadRequestException('Ancien mot de passe incorrect', {
          cause: new Error(),
          description: 'Veuillez vérifier votre ancien mot de passe.',
        });
      }

      // hash new password and add to update data
      updateData.password = await bcrypt.hash(updateUserDto.newPassword, 10);
    }

    return this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).exec();
  }

  async delete(userId: string): Promise<User | null> {
    // check if user exist befere soft-deleting
    await this.findOne(userId);

    const deletedUser = await this.userModel
      .findByIdAndUpdate(userId, { deletedAt: Date.now() }, { new: true })
      .exec();

    // soft-deleting in cascade of user's collections
    await this.collectionModel.updateMany(
      { userId: userId, deletedAt: null },
      { deletedAt: Date.now() }
    );

    return deletedUser;
  }

  async findAll(): Promise<User[]> {
    // get all active users
    const users = await this.userModel.find({ deletedAt: null }).exec();

    if (users.length !== 0) {
      // at least one user was returned
      return users;
    } else {
      // no user was returned -> NotFoundException
      throw new NotFoundException("Une erreur c'est produite", {
        cause: new Error(),
        description: "Il semblerait qu'il n'existe pas encore d'utilisateur :(",
      });
    }
  }

  async findOne(userId: string): Promise<User> {
    // get active user associated with the param userId
    const user = await this.userModel.findOne({ _id: userId, deletedAt: null }).exec();

    if (user) {
      // the user exist, he is returned
      return user;
    } else {
      // no user was returned -> NotFoundException
      throw new NotFoundException("Une erreur c'est produite", {
        cause: new Error(),
        description: "Il semblerait que cet utilisateur n'existe pas :(",
      });
    }
  }
}
