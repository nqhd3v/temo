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
        url: 'localhost:4051',
        package: 'Event',
        protoPath: join(__dirname, '../../..', 'proto', 'event.proto'),
      },
    }
  );
  await app.listen();
  Logger.log('Microservice - Event is running... 🚀\n');
}

bootstrap();
