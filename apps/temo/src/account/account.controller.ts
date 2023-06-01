import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { IAccountResponse } from '@temo/database';
import ResponseObj, { IResponseObject } from 'tools/response';
import NewAccountDTO from './dto/new-account.dto';
import { FileInterceptor } from '@temo/file';
import SearchAccountsDTO from './dto/search-account.dto';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

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
  async importAccounts(@UploadedFile() file: Express.Multer.File) {
    await this.accountService.addImportAccountToQueue(file.filename);
    return ResponseObj.success({ file });
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
