import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/**
 * JwtStrategy
 * -----------
 * Stratégie Passport permettant de valider les tokens JWT.
 *
 * - Récupère le token depuis l'en-tête Authorization (Bearer token)
 * - Vérifie la validité et la signature du token
 * - Retourne les informations de l'utilisateur attachées au token
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      /**
       * Methode pour extraire le token JWT de la requête
       * Ici l'extraction s'effectue dans l'en-tête Authorization: Bearer <token>
       */
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      /**
       * Permet d'ignorer automatiquement les tokens expirés
       */
      ignoreExpiration: false,
      /**
       * Correspond à la clé secrète permetant de vérifier la signature du token
       * Récupérer depuis les variables d'environements
       */
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * validate()
   * ----------
   * Méthode appelée automatiquement si le token est valide.
   * Retourne les informations qui seront attachées à req.user.
   *
   * @param payload - Données décodées du token JWT
   * @returns Objet représentant l'utilisateur authentifié
   */
  async validate(payload) {
    return {
      _id: payload._id,
      email: payload.email,
      username: payload.username,
      role: payload.role,
    };
  }
}
