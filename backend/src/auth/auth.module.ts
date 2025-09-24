import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { User, UserSchema } from '../users/schemas/user.schema';

/**
 * AuthModule
 * ----------
 * Module d'authentification qui regroupe :
 * - La configuration JWT
 * - La stratégie d'authentification
 * - Le contrôleur et le service d'auth
 * - L'accès au modèle User via Mongoose
 */
@Module({
  imports: [
    /**
     * PassportModule
     * --------------
     * Nécessaire pour utiliser les stratégies d'authentification
     */
    PassportModule,

    /**
     * JwtModule (configuration asynchrone)
     * ------------------------------------
     * On injecte ConfigService pour récupérer la clé secrète
     * et définir les options de signature du token JWT.
     */
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),

    /**
     * MongooseModule.forFeature
     * -------------------------
     * Permet de déclarer le schéma User pour qu'il soit
     * injecté et utilisable dans AuthService.
     */
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],

  /**
   * Providers
   * ---------
   * Les services et stratégies utilisés par ce module.
   */
  providers: [AuthService, JwtStrategy],

  /**
   * Controllers
   * -----------
   * Les endpoints exposés par ce module.
   */
  controllers: [AuthController],

  /**
   * Exports
   * -------
   * On exporte AuthService pour qu'il puisse être utilisé
   * dans d'autres modules.
   */
  exports: [AuthService],
})
export class AuthModule {}
