import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { AppService } from './app.service';
import { JobNameEnum, TJobName } from '@temo/database';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';

@Processor('account')
export class AccountProcessor {
  constructor(private readonly appService: AppService) {}

  @OnQueueActive()
  onActive(job: Job) {
    Logger.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`
    );
  }

  @Process(JobNameEnum.IMPORT_ACCOUNTS)
  async handleSyncAllData(job: Job) {
    try {
      Logger.log('Run job  ' + job.id);
    } catch (err) {
      Logger.log(`\x1b[31mSync all-data failed!\x1b[0m`);
      console.error(err);
    }
  }
}
