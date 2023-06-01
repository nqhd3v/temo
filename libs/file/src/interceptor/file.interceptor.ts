import { FileInterceptor } from '@nestjs/platform-express';
import {
  Injectable,
  mixin,
  NestInterceptor,
  Type,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage, DiskStorageOptions } from 'multer';
import * as fs from 'fs/promises';
import { join } from 'path';
import { randomAlphabet } from 'tools/random';

function OneFileInterceptor(
  fieldName: string,
  options?: {
    subFolder?: string;
    isKeepFilename?: boolean;
    prefixFilename?: string;
  }
): Type<NestInterceptor> {
  @Injectable()
  class SingleFileInterceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor;
    constructor(configService: ConfigService) {
      const filesDestination = configService.get('UPLOAD_DIR_PATH');

      const destination: DiskStorageOptions['destination'] = async (
        req,
        file,
        cb
      ) => {
        const finalDst = options?.subFolder
          ? join(__dirname, '../../..', filesDestination, options?.subFolder)
          : join(__dirname, '../../..', filesDestination);
        // Create if dir not exist
        await fs.mkdir(finalDst, { recursive: true });
        cb(null, finalDst);
      };

      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination,
          filename: (_, file, callback) => {
            const ext = file.originalname.match(/[^.]+$/);
            const name = options?.isKeepFilename
              ? file.originalname
              : randomAlphabet(10);
            const filename = `${options?.prefixFilename || ''}${name}.${ext}`;
            callback(null, filename);
          },
        }),
      };

      this.fileInterceptor = new (FileInterceptor(fieldName, multerOptions))();
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }

  return mixin(SingleFileInterceptor);
}

export default OneFileInterceptor;
