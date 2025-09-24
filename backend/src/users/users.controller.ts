import { Body, Controller, Get, UseGuards, Put, Param, Delete, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/role.decorator';

/**
 * UsersController
 * --------------
 * Contrôleur responsable de la gestion des users.
 *
 * - Expose les routes pour les opérations CRUD et autres des users.
 * - Dépend de `usersService` pour la logique métier.
 */
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  /**
   * Injection du service des users.
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Route POST /users
   * -------------------------
   * Permet de créer un nouveau utilisateur en base de données.
   *
   * @param createUserDto - Données de l'utilisateur à enregistrer
   * @returns l'utilisateur créé ou une erreur si les données sont invalides
   */
  @Post()
  @Role('admin')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  /**
   * Route PUT /users
   * -------------------------
   * Permet de modifier un utilisateur en base de données.
   *
   * @param userId - Id de l'utilisateur à mettre à jour
   * @param updateUserDto - Données de l'utilisateur à modifier
   * @returns l'utilisateur modifiée ou une erreur si les données sont invalides
   */
  @Put(':userId')
  @Role('admin')
  @Role('user')
  async update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User | null> {
    return this.usersService.update(userId, updateUserDto);
  }

  /**
   * Route DELETE /users
   * -------------------------
   * Permet de supprimer un utilisateur en base de données.
   *
   * @param userId - Id de l'utilisateur à supprimer
   * @returns l'utilisateur supprimée ou une erreur si les données sont invalides
   */
  @Delete(':userId')
  @Role('admin')
  @Role('user')
  async delete(@Param('userId') userId: string): Promise<User | null> {
    return this.usersService.delete(userId);
  }

  /**
   * Route GET /users
   * -------------------------
   * Permet de récupérer tout les utilisateurs actif en base de données.
   *
   * @param NoParams - Pas de paramètres requis
   * @returns Tout les utilisateurs actif ou une erreur si les données sont invalides
   */
  @Get()
  @Role('admin')
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  /**
   * Route GET /users/@param userId
   * -------------------------
   * Permet de récupérer une collections.
   *
   * @param userId - Id de l'utilisateur à récupérer
   * @returns l'utilisateur ou une erreur si les données sont invalides
   */
  @Get(':userId')
  async findOne(@Param('userId') userId: string): Promise<User | null> {
    return this.usersService.findOne(userId);
  }
}
