import { Body, Controller, Get, Put, Param, Delete, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Put(':userId')
  async update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User | null> {
    return this.usersService.update(userId, updateUserDto);
  }

  @Delete(':userId')
  async delte(@Param('userId') userId: string): Promise<User | null> {
    return this.usersService.delete(userId);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':userId')
  async findOne(@Param('userId') userId: string): Promise<User | null> {
    return this.usersService.findOne(userId);
  }
}
