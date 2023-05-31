import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule, Event } from '@temo/database';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Event])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
