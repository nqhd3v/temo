import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  IAccountService,
  IAccountSearchPayload,
  INewAccountPayload,
  IAccountProperties,
} from '@temo/database';
import { lastValueFrom } from 'rxjs';
import { IResponseObject } from 'tools/response';

@Injectable()
export class AccountService implements OnModuleInit {
  private accountMicroservice: IAccountService;

  constructor(@Inject('ACCOUNT_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.accountMicroservice =
      this.client.getService<IAccountService>('AccountService');
  }

  public async findById(
    id: string
  ): Promise<IResponseObject<IAccountProperties>> {
    const accountObservable = this.accountMicroservice.findById({ id });
    return await lastValueFrom(accountObservable);
  }

  public async search(
    payload: IAccountSearchPayload
  ): Promise<IResponseObject<{ data: IAccountProperties[]; total: number }>> {
    const accountObservable = this.accountMicroservice.search(payload);
    return await lastValueFrom(accountObservable);
  }

  public async createOne(
    payload: INewAccountPayload
  ): Promise<IResponseObject<IAccountProperties>> {
    const accountObservable = this.accountMicroservice.create(payload);
    return await lastValueFrom(accountObservable);
  }

  public async updateById(
    id: string
  ): Promise<IResponseObject<IAccountProperties>> {
    const accountObservable = this.accountMicroservice.findById({ id });
    return await lastValueFrom(accountObservable);
  }
}
