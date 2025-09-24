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
    // Récupère le rôle requis depuis la metadonnée `role`
    const requiredRole = this.reflector.get<string>('role', context.getHandler());

    // Si pas de rôle requis on laisse la requête s'executer
    if (!requiredRole) return true;

    // Recupère l'utilisateur depuis la requête `req.user`
    const { user } = context.switchToHttp().getRequest();

    // Vérifie s'il existe un utilisateur et si son rôle correspond à celui requis
    if (!user || user.role !== requiredRole) {
      throw new ForbiddenException('Accès refusé');
    }

    return true;
  }
}
