import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ACCOUNT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:4050',
          package: 'Account',
          protoPath: join(__dirname, '../../..', 'proto', 'account.proto'),
        },
      },
      {
        name: 'WORKER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:4052',
          package: 'Worker',
          protoPath: join(__dirname, '../../..', 'proto', 'worker.proto'),
        },
      },
    ]),
    ConfigModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
