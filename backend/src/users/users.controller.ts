import { Body, Controller, Get, UseGuards, Put, Param, Delete, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/role.decorator';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a new user.
   * @param createUserDto - Data Transfer Object containing user details.
   * @returns The created User object.
   */
  @Post()
  @Role('admin')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  /**
   * Update an existing user.
   * @param userId - The ID of the user to update.
   * @param updateUserDto - Data Transfer Object containing updated user details.
   * @returns The updated User object or null if not found.
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
   * Delete (soft-delete) a user by ID.
   * @param userId - The ID of the user to delete.
   * @returns The deleted User object or null if not found.
   */
  @Delete(':userId')
  @Role('admin')
  @Role('user')
  async delete(@Param('userId') userId: string): Promise<User | null> {
    return this.usersService.delete(userId);
  }

  /**
   * Retrieve all active users.
   * @returns An array of User objects.
   */
  @Get()
  @Role('admin')
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  /**
   * Retrieve a single user by ID.
   * @param userId - The ID of the user to retrieve.
   * @returns The User object or null if not found.
   */
  @Get(':userId')
  async findOne(@Param('userId') userId: string): Promise<User | null> {
    return this.usersService.findOne(userId);
  }
}
