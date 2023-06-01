import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IAccountService,
  IEventService,
  INewJobPayload,
  ISearchJobsPayload,
  IUpdateJobPayload,
  Job,
  JobNameEnum,
  JobStateEnum,
} from '@temo/database';
import { Repository } from 'typeorm';
import { ClientGrpc } from '@nestjs/microservices';
import { JobModuleEnum } from 'libs/database/src/entities/job.entity';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService implements OnModuleInit {
  private accountMicroservice: IAccountService;
  private eventMicroservice: IEventService;

  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectQueue('account') private readonly accountQueue: Queue,
    @Inject('ACCOUNT_PACKAGE') private accountClient: ClientGrpc,
    @Inject('EVENT_PACKAGE') private eventClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.eventMicroservice =
      this.eventClient.getService<IEventService>('EventService');
    this.accountMicroservice =
      this.accountClient.getService<IAccountService>('AccountService');
  }

  async createJob(data: INewJobPayload): Promise<Job> {
    const jobId = Job.genId();
    // Add job to  queue
    await this.accountQueue.add(JobNameEnum.IMPORT_ACCOUNTS, data.data, {
      jobId,
    });
    const newJob = this.jobRepository.create({
      id: jobId,
      name: data.name as JobNameEnum,
      module: data.module as JobModuleEnum,
      data: data.data,
      note: data.note,
    });
    await lastValueFrom(
      this.eventMicroservice.create({
        title: 'System added a new job to queue',
        description: `[${data.name}] - ${data.note}`,
        module: data.module,
      })
    );
    return await this.jobRepository.save(newJob);
  }

  async updateJobById(id: string = '', data: IUpdateJobPayload): Promise<Job> {
    const current = await this.getJobById(id);
    if (!current) {
      throw new Error('exception.job.notfound');
    }
    current.state = data.state as JobStateEnum;
    current.data = data.data;
    current.note = data.note;

    await lastValueFrom(
      this.eventMicroservice.create({
        title: `System updated an existed job#${id}`,
        description: `[${current.name}] - ${data.note}`,
        module: current.module,
      })
    );

    return await this.jobRepository.save(current);
  }

  async getJobById(id: string = ''): Promise<Job> {
    return await this.jobRepository.findOne({ where: { id } });
  }

  async getJobs(
    payload$: ISearchJobsPayload
  ): Promise<{ data: Job[]; total: number }> {
    const current = payload$.page || 1;
    const size = payload$.size || 10;
    const name = payload$.name || '';
    const state = payload$.state || '';

    let jobsQuery = this.jobRepository.createQueryBuilder('e');

    if (name) {
      jobsQuery = jobsQuery.andWhere('name = :name', { name });
    }
    if (state) {
      jobsQuery = jobsQuery.andWhere('state = :state', { state });
    }

    const total = await jobsQuery.getCount();
    jobsQuery = jobsQuery.skip((current - 1) * size).limit(size);
    const data = await jobsQuery.getMany();

    return {
      data,
      total,
    };
  }
}
