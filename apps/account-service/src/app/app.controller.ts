import { Logger, Controller } from '@nestjs/common';
import ResponseObj, { IResponseObject } from 'tools/response';

import { AppService } from './app.service';
import {
  Account,
  IAccountId,
  IAccountSearchPayload,
  IAccountSearchString,
  INewAccountPayload,
  INewEventPayload,
} from '@temo/database';
import { Observable, ReplaySubject } from 'rxjs';
import {
  EventModuleEnum,
  EventTypeEnum,
} from 'libs/database/src/entities/event.entity';
import {
  AccountResponse,
  AccountServiceController,
  AccountServiceControllerMethods,
} from '../../../../proto/build/account.pb';

@AccountServiceControllerMethods()
export class AppController implements AccountServiceController {
  constructor(private readonly appService: AppService) {}

  async findById(data: IAccountId) {
    Logger.log(' - AccountService - findById');
    const account = await this.appService.findById(data?.id);

    if (!account) {
      return ResponseObj.fail<Account>('account.notfound');
    }
    return ResponseObj.success<Account>(account);
  }

  async findByUsernameOrEmail(
    data: IAccountSearchString
  ): Promise<IResponseObject<Account>> {
    Logger.log(
      ` 🚩 AccountService - findByUsernameOrEmail(${JSON.stringify(data)})`
    );
    const account = await this.appService.findByUsernameOrEmail(
      data?.searchString
    );

    if (!account) {
      return ResponseObj.fail('account.notfound');
    }
    return ResponseObj.success(account);
  }

  async create(data: INewAccountPayload) {
    Logger.log(` 🚩 AccountService - create(${JSON.stringify(data)})`);
    try {
      const newAccount = await this.appService.create(data);
      // await lastValueFrom(
      //   this.eventMicroservice.create({
      //     title: 'System just created a new account!',
      //     description: 'An account was created automatic by system.',
      //     module: EventModuleEnum.ACCOUNT,
      //     type: EventTypeEnum.LOG,
      //     data: JSON.stringify({
      //       id: newAccount.id,
      //       username: newAccount.username,
      //       email: newAccount.email,
      //     }),
      //   })
      // );
      return ResponseObj.success<Account>(newAccount);
    } catch (err) {
      return ResponseObj.fail<Account>(err.message);
    }
  }

  async createMulti(
    data$: { data: INewAccountPayload[] },
    metadata$: Record<string, any> = {}
  ) {
    Logger.log(` 🚩 AccountService - createMulti(${JSON.stringify(data$)})`);
    const { isSkipDuplicated } = metadata$;
    const { data } = data$;
    try {
      const logEvent = new ReplaySubject<INewEventPayload>();

      const newAccounts = await this.appService.createMulti(data, {
        skipDuplicated: isSkipDuplicated,
        onLogAfterCreated: (data) =>
          logEvent.next({
            title: 'System just created a new account!',
            description: 'An account was created automatic by system.',
            module: EventModuleEnum.ACCOUNT,
            type: EventTypeEnum.LOG,
            data: JSON.stringify({
              id: data.id,
              username: data.username,
              email: data.email,
            }),
          }),
      });

      logEvent.complete();
      // await this.eventMicroservice.streamCreate(logEvent);
      // await lastValueFrom(
      //   this.eventMicroservice.create({
      //     title: 'System just created a new account!',
      //     description: 'An account was created automatic by system.',
      //     module: EventModuleEnum.ACCOUNT,
      //     type: EventTypeEnum.LOG,
      //     data: JSON.stringify({
      //       id: newAccount.id,
      //       username: newAccount.username,
      //       email: newAccount.email,
      //     }),
      //   })
      // );
      return ResponseObj.success<Account[]>(newAccounts);
    } catch (err) {
      return ResponseObj.fail<Account[]>(err.message);
    }
  }

  async search(data$: IAccountSearchPayload) {
    Logger.log(' - AccountService - search');
    const data = await this.appService.search(data$);

    return ResponseObj.success(data);
  }
}
