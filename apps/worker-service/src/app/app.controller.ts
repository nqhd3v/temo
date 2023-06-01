import { Injectable, Logger } from '@nestjs/common';

import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  IJobId,
  INewJobPayload,
  ISearchJobsPayload,
  IUpdateJobPayload,
  Job,
} from '@temo/database';
import ResponseObj, { IResponseObject } from 'tools/response';

@Injectable()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('WorkerService', 'create')
  async createJob(data$: INewJobPayload): Promise<IResponseObject<Job>> {
    Logger.log(` 🚩 WorkerService - create("${JSON.stringify(data$)}")`);
    const newJob = await this.appService.createJob(data$);

    return ResponseObj.success(newJob);
  }

  // @GrpcMethod('WorkerService', 'cancelJobById')
  // async cancelJob() {
  //   return this.appService.getData();
  // }

  @GrpcMethod('WorkerService', 'search')
  async getJobs(
    payload$: ISearchJobsPayload
  ): Promise<IResponseObject<{ data: Job[]; total: number }>> {
    Logger.log(` 🚩 WorkerService - search("${JSON.stringify(payload$)}")`);
    const data = await this.appService.getJobs(payload$);

    return ResponseObj.success(data);
  }

  @GrpcMethod('WorkerService', 'updateById')
  async updateById(payload$: IUpdateJobPayload & IJobId) {
    Logger.log(
      ` 🚩 WorkerService - updateJobById("${JSON.stringify(payload$)}")`
    );
    try {
      const { id, ...data } = payload$;
      const jobUpdated = this.appService.updateJobById(id, data);

      return ResponseObj.success(jobUpdated);
    } catch (err) {
      return ResponseObj.fail(err.message);
    }
  }
}
