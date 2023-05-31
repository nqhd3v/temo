import { Injectable, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import ResponseObj, { IResponseObject } from 'tools/response';

import { AppService } from './app.service';
import {
  Account,
  IAccountId,
  IAccountSearchPayload,
  IAccountSearchString,
  INewAccountPayload,
} from '@temo/database';

@Injectable()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('AccountService', 'findById')
  async findById(data: IAccountId): Promise<IResponseObject<Account>> {
    Logger.log(' - AccountService - findById');
    const account = await this.appService.findById(data?.id);

    if (!account) {
      return ResponseObj.fail('account.notfound');
    }
    return ResponseObj.success(account);
  }

  @GrpcMethod('AccountService', 'findByUsernameOrEmail')
  async findByUsernameOrEmail(
    data: IAccountSearchString
  ): Promise<IResponseObject<Account>> {
    Logger.log(' - AccountService - findByUsernameOrEmail');
    const account = await this.appService.findByUsernameOrEmail(
      data?.searchString
    );

    if (!account) {
      return ResponseObj.fail('account.notfound');
    }
    return ResponseObj.success(account);
  }

  @GrpcMethod('AccountService', 'create')
  async create(data: INewAccountPayload): Promise<IResponseObject<Account>> {
    Logger.log(` 🚩 AccountService - create(${JSON.stringify(data)})`);
    try {
      const newAccount = await this.appService.create(data);
      return ResponseObj.success(newAccount);
    } catch (err) {
      return ResponseObj.fail(err.message);
    }
  }

  @GrpcMethod('AccountService', 'search')
  async search(
    data$: IAccountSearchPayload
  ): Promise<IResponseObject<{ data: Account[]; total: number }>> {
    Logger.log(' - AccountService - search');
    const data = await this.appService.search(data$);

    return ResponseObj.success(data);
  }
}
