import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import * as Joi from '@hapi/joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule, Job } from '@temo/database';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AccountProcessor } from './account.processor';

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
        name: 'EVENT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:4051',
          package: 'Event',
          protoPath: join(__dirname, '../../..', 'proto', 'event.proto'),
        },
      },
    ]),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: Number(configService.get('REDIS_PORT')),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({ name: 'account' }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.string().required(),
      }),
      envFilePath: '../../../.env',
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([Job]),
  ],
  controllers: [AppController],
  providers: [AppService, AccountProcessor],
})
export class AppModule {}
