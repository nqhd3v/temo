import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        UPLOAD_DIR_PATH: Joi.string().required(),
      }),
      envFilePath: '../../../.env',
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class FileModule {}
