import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: 'localhost:4052',
        package: 'Worker',
        protoPath: join(__dirname, '../../..', 'proto', 'worker.proto'),
      },
    }
  );
  await app.listen();
  Logger.log('Microservice - Worker is running... 🚀\n');
}

bootstrap();
