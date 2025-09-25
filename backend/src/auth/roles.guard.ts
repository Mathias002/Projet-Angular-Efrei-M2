import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * RolesGuard
 * ----------
 * Permet de controller l'accés a une route en vérifiant
 * que l'utilisateur envoyant la requête possède bien le rôle necessaire
 *
 * - Reflector permet de lire la métadonnée "role" définie
 *   dans les contrôleurs ou gestionnaires de routes via un décorateur personnalisé. -> `@Role('admin')`
 * - Bloque l'accès si l'utilisateur n'a pas le bon rôle.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * canActivate()
   * -------------
   * Méthode appelée avant l'exécution du handler de route.
   *
   * @param context - Contexte d'exécution de la requête
   * @returns true si l'utilisateur possede le bon rôle, sinon lève une exception
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    // Recupère l'utilisateur depuis la requête `req.user`
    const { user } = context.switchToHttp().getRequest();
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Accès refusé');
    }

    return true;
  }
}
