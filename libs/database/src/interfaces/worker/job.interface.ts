export interface IJobProperties {
  id: string;
  name: TJobName;
  job_id: string;
  state: TJobState;
  data: string;
  note: string;
  created_at: Date;
  updated_at: Date;
}

export type TJobState = 'done' | 'err' | 'waiting' | 'processing' | 'create';
export type TJobName = 'import-accounts';
export type TJobModule = 'account' | 'event';
