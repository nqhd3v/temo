import { IResponseObject } from 'tools/response';
import {
  IJobProperties,
  TJobModule,
  TJobName,
  TJobState,
} from './job.interface';
import { Observable } from 'rxjs';

export default interface IJobService {
  updateById(
    payload: IUpdateJobPayload & IJobId
  ): Observable<IResponseObject<IJobProperties>>;
  search(
    payload: ISearchJobsPayload
  ): Observable<IResponseObject<{ data: IJobProperties[]; total: number }>>;
  create(payload: INewJobPayload): Observable<IResponseObject<IJobProperties>>;
}

export interface INewJobPayload {
  name: TJobName;
  data: string;
  note?: string;
  module: TJobModule;
}

export interface IUpdateJobPayload {
  data: string;
  note: string;
  state: TJobState;
}

export interface ISearchJobsPayload {
  name?: TJobName;
  state?: TJobState;
  module?: TJobModule;
  page?: number;
  size?: number;
}

export interface IJobId {
  id: string;
}
