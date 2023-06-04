import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { IAccountResponse } from '@temo/database';
import ResponseObj, { IResponseObject } from 'tools/response';
import NewAccountDTO from './dto/new-account.dto';
import { FileInterceptor } from '@temo/file';
import SearchAccountsDTO from './dto/search-account.dto';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Controller('accounts')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly configService: ConfigService
  ) {}

  @Get(':id')
  async getAccountById(
    @Param('id') id: string
  ): Promise<IResponseObject<IAccountResponse>> {
    const res = await this.accountService.findById(id);

    if (!res.isSuccess) {
      return ResponseObj.fail(res.message || 'exception.account.unknown');
    }
    const account = res.data;

    delete account.password;
    delete account.updated_at;
    delete account.deleted_at;

    return ResponseObj.success(account);
  }

  @Post()
  async createNewAccount(@Body() data: NewAccountDTO) {
    const res = await this.accountService.createOne(data);

    if (!res.isSuccess) {
      return ResponseObj.fail(res.message || 'exception.account.unknown');
    }
    return ResponseObj.success(res.data);
  }

  @Post('import')
  @UseInterceptors(
    FileInterceptor('file', { prefixFilename: 'account-import-' })
  )
  async importAccounts(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'csv' })],
      })
    )
    file: Express.Multer.File
  ): Promise<
    IResponseObject<{
      isInQueue: boolean;
      data: any;
      fileSize: Express.Multer.File['size'];
    }>
  > {
    try {
      if (file.size > 2097152) {
        // File size greater than 2MB -> Add to queue
        const job = await this.accountService.addImportAccountToQueue(
          file.filename
        );
        return ResponseObj.success({
          isInQueue: true,
          data: {
            jobId: job.id,
          },
          fileSize: file.size,
        });
      }
      // Handle read file & create accounts.
      const uploadFolder = this.configService.get('UPLOAD_DIR_PATH');
      const data = await this.accountService.importAccountsByFile(
        join(uploadFolder, file.filename)
      );
      return ResponseObj.success({
        isInQueue: false,
        fileSize: file.size,
        data: {
          created: 0,
          failed: 0,
          data,
        },
      });
    } catch (err) {
      return ResponseObj.fail(err.message);
    }
  }

  @Get()
  async searchAccounts(
    @Query() payload: SearchAccountsDTO
  ): Promise<IResponseObject<{ data: IAccountResponse[]; total: number }>> {
    const res = await this.accountService.search(payload);

    if (!res.isSuccess) {
      return ResponseObj.fail(res.message || 'exception.account.unknown');
    }
    return ResponseObj.success(res.data);
  }
}
