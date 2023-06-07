import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AccountResponse, AccountServiceClient, AccountsResponse, SearchAccountParams } from '../../../../proto/build/account.pb'
import { WorkerServiceClient } from '../../../../proto/build/worker.pb'
import {
  IAccountService,
  IAccountSearchPayload,
  INewAccountPayload,
  IAccountProperties,
  IJobService,
  JobNameEnum,
  IJobProperties,
  Account,
} from '@temo/database';
import { csvReaderAsync } from 'tools/csv-reader';
import { JobModuleEnum } from 'libs/database/src/entities/job.entity';
import { lastValueFrom } from 'rxjs';
import { IResponseObject } from 'tools/response';
import { NewAccountParams } from '../../../../proto/build/account.pb';

@Injectable()
export class AccountService implements OnModuleInit {
  private accountMicroservice: AccountServiceClient;
  private workerMicroservice: WorkerServiceClient;

  constructor(
    @Inject('ACCOUNT_PACKAGE') private accountClient: ClientGrpc,
    @Inject('WORKER_PACKAGE') private workerClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.accountMicroservice =
      this.accountClient.getService<AccountServiceClient>('AccountService');
    this.workerMicroservice =
      this.workerClient.getService<WorkerServiceClient>('WorkerService');
  }

  public async findById(
    id: string
  ): Promise<AccountResponse> {
    const accountObservable = this.accountMicroservice.findById({ id });
    return await lastValueFrom(accountObservable);
  }

  public async search(
    payload: SearchAccountParams
  ): Promise<AccountsResponse> {
    const accountObservable = this.accountMicroservice.search(payload);
    return await lastValueFrom(accountObservable);
  }

  public async createOne(
    payload: NewAccountParams
  ): Promise<AccountResponse> {
    const accountObservable = this.accountMicroservice.create(payload);
    return await lastValueFrom(accountObservable);
  }

  public async addImportAccountToQueue(
    filePath: string
  ): Promise<IJobProperties> {
    const res = await lastValueFrom(
      this.workerMicroservice.create({
        name: JobNameEnum.IMPORT_ACCOUNTS,
        module: JobModuleEnum.ACCOUNT,
        data: JSON.stringify({
          filePath,
        }),
      })
    );
    if (!res.isSuccess) {
      throw new Error('exception.worker.not-add-job');
    }
    return res.data;
  }

  public async importAccountsByFile(filepath: string) {
    const res = await csvReaderAsync<Account>(filepath);
    if (res.type === 'array') {
      throw new Error('internal.account.invalid-data');
    }
    const newAccounts = await lastValueFrom(
      this.accountMicroservice.createMulti(res)
    );
    return newAccounts;
  }
}
