import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { protobufPackage } from '../../../proto/build/account.pb';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: 'localhost:4050',
        package: protobufPackage,
        protoPath: join(__dirname, '../../..', 'proto', 'account.proto'),
      },
    }
  );
  await app.listen();
  Logger.log('Microservice - Account is running... 🚀\n');
}

bootstrap();
