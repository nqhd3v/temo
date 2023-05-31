import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

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
    ]),
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
