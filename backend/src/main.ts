import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Point d'entrée principal de l'application NestJS
 * ------------------------------------------------
 * - Initialise l'application
 * - Configure la validation globale
 * - Active CORS pour permettre les requêtes depuis le frontend Angular
 * - Lance le serveur sur le port 3000
 */
async function bootstrap() {
  // Création de l'application NestJS avec le module racine
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  /**
   * Configuration de CORS pour autoriser le frontend Angular à communiquer avec l'API
   * - origin: définit l'URL autorisée (ici http://localhost:4200)
   * - methods: liste des méthodes HTTP autorisées
   * - credentials: permet l'envoi des cookies/headers d'authentification
   */
  app.enableCors({
    origin: 'http://localhost:4200', // autorise les requêtes depuis l'url
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Démarrage du serveur sur le port 3000
  await app.listen(3000);
}
bootstrap();
