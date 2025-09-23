import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userModel.findOne({ email: registerDto.email });
    if (existingUser) throw new ConflictException('Email déjà utilisé');

    if (registerDto.password !== registerDto.confirmPassword) {
      // the password fiel and the confirmPasswor field do not contain the same value -> BadRequestException
      throw new BadRequestException('Une erreur est survenue', {
        cause: new Error(),
        description:
          'Veillez vérifier que le mot de passe est similaire à celui renseigner dans la confirmation',
      });
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.userModel.create({
      ...registerDto,
      password: hashedPassword,
    });

    return {
      message: 'Utilisateur créé avec succès',
      user: { _id: user._id, username: user.username, email: user.email, role: user.role },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (!user) throw new UnauthorizedException('Identifiants invalides');

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Identifiants invalides');

    const payload = { _id: user._id, username: user.username, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}
