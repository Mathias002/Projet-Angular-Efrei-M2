import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  // Active CORS et autorise le frontend Angular
  app.enableCors({
    origin: 'http://localhost:4200', // autorise les requêtes depuis l'url
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // si tu utilises les cookies ou l'auth avec credentials
  });
  await app.listen(3000);
}
bootstrap();
