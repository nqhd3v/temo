import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  IAccountService,
  IAccountSearchPayload,
  INewAccountPayload,
  IAccountProperties,
  IJobService,
  JobNameEnum,
} from '@temo/database';
import { JobModuleEnum } from 'libs/database/src/entities/job.entity';
import { lastValueFrom } from 'rxjs';
import { IResponseObject } from 'tools/response';

@Injectable()
export class AccountService implements OnModuleInit {
  private accountMicroservice: IAccountService;
  private workerMicroservice: IJobService;

  constructor(
    @Inject('ACCOUNT_PACKAGE') private accountClient: ClientGrpc,
    @Inject('WORKER_PACKAGE') private workerClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.accountMicroservice =
      this.accountClient.getService<IAccountService>('AccountService');
    this.workerMicroservice =
      this.workerClient.getService<IJobService>('WorkerService');
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

  public async addImportAccountToQueue(filePath: string) {
    return await lastValueFrom(
      this.workerMicroservice.create({
        name: JobNameEnum.IMPORT_ACCOUNTS,
        module: JobModuleEnum.ACCOUNT,
        data: JSON.stringify({
          filePath,
        }),
      })
    );
  }
}
