/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['https://temo.nqhuy.dev', `http://localhost:3000`],
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 30,
  });
  app.use(cookieParser());

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 4000;

  await app.listen(port, () => {
    Logger.log(` 🚀 - Gateway is running on port \u001B[31m${port}\u001B[0m\n`);
  });
}

bootstrap();
