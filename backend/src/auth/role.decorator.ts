import { SetMetadata } from '@nestjs/common';

// Decorator permettant de définir un rôle requis pour accéder à une route
export const Role = (role: string) => SetMetadata('role', role);
