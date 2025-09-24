import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

/**
 * AuthController
 * --------------
 * Contrôleur responsable de la gestion de l'authentification.
 *
 * - Expose les routes pour l'inscription et la connexion des utilisateurs.
 * - Dépend de `AuthService` pour la logique métier.
 */
@Controller('auth')
export class AuthController {
  /**
   * Injection du service d'authentification.
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Route POST /auth/register
   * -------------------------
   * Permet de créer un nouvel utilisateur en base de données.
   *
   * @param registerDto - Données de l'utilisateur à enregistrer
   * @returns L'utilisateur créé ou une erreur si les données sont invalides
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Route POST /auth/login
   * ----------------------
   * Permet à un utilisateur existant de se connecter.
   *
   * @param loginDto - Contient l'email et le mot de passe
   * @returns Un token JWT ou une erreur d'authentification
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
