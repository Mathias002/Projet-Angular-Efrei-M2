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

/**
 * AuthService
 * -----------
 * Service responsable de la logique métier liée à l'authentification :
 * - Inscription d'un nouvel utilisateur
 * - Connexion d'un utilisateur existant et génération du token JWT
 */
@Injectable()
export class AuthService {
  constructor(
    /**
     * Injection du modèle User (Mongoose)
     * Permet d'interagir avec la collection "users" dans MongoDB
     */
    @InjectModel(User.name) private userModel: Model<UserDocument>,

    /**
     * Injection du service JWT
     * Utilisé pour signer et générer les tokens d'accès
     */
    private readonly jwtService: JwtService
  ) {}

  /**
   * register()
   * ----------
   * Crée un nouvel utilisateur en base de données après validation.
   *
   * @param registerDto - Données d'inscription (email, mot de passe, etc.)
   * @returns Informations de l'utilisateur créé (sans mot de passe)
   */
  async register(registerDto: RegisterDto) {
    // Vérifie si un utilisateur avec le même email existe déjà
    const existingUser = await this.userModel.findOne({ email: registerDto.email });
    if (existingUser) throw new ConflictException('Email déjà utilisé');

    // Vérifie que password et confirmPassword correspondent
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('Une erreur est survenue', {
        cause: new Error(),
        description:
          'Veillez vérifier que le mot de passe est similaire à celui renseigner dans la confirmation',
      });
    }

    // Hashage sécurisé du mot de passe avec bcrypt
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Création de l'utilisateur dans la base
    const user = await this.userModel.create({
      ...registerDto,
      password: hashedPassword, // On remplace le mot de passe en clair par la version hashée
    });

    // Retourne un objet sans mot de passe pour éviter toute fuite d'information sensible
    return {
      message: 'Utilisateur créé avec succès',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * login()
   * -------
   * Authentifie un utilisateur existant et renvoie un token JWT.
   *
   * @param loginDto - Email et mot de passe fournis par l'utilisateur
   * @returns Objet contenant le token d'accès JWT
   */
  async login(loginDto: LoginDto) {
    // Recherche l'utilisateur par email et vérifie son existance en base
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (!user) throw new UnauthorizedException('Identifiants invalides');

    // Vérifie la validité du mot de passe
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Identifiants invalides');

    // Création du payload JWT (sans inclure le mot de passe)
    const payload = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    // Signature et génération du token
    const token = this.jwtService.sign(payload);

    // Retourne le token au client
    return { access_token: token };
  }
}
