import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Account, DatabaseModule } from '@temo/database';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EVENT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:4051',
          package: 'Event',
          protoPath: join(__dirname, '../../..', 'proto', 'event.proto'),
        },
      },
      // {
      //   name: 'WORKER_PACKAGE',
      //   transport: Transport.GRPC,
      //   options: {
      //     url: 'localhost:4052',
      //     package: 'Worker',
      //     protoPath: join(__dirname, '../../..', 'proto', 'worker.proto'),
      //   },
      // },
    ]),
    DatabaseModule,
    TypeOrmModule.forFeature([Account]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
