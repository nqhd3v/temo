import { Observable } from 'rxjs';
import { IEventProperties, TEventType } from './charge-event.interface';
import { IResponseObject } from 'tools/response';

export default interface IEventService {
  findById({
    id,
  }: {
    id: string;
  }): Observable<IResponseObject<IEventProperties>>;
  updateById(
    payload: IUpdateEventPayload & IEventId
  ): Observable<IResponseObject<IEventProperties>>;
  search(
    payload: IEventSearchPayload
  ): Observable<IResponseObject<{ data: IEventProperties[]; total: number }>>;
  create(
    payload: INewEventPayload
  ): Observable<IResponseObject<IEventProperties>>;
}

export interface IEventSearchPayload {
  keyword?: string;
  page?: number;
  size?: number;
  type?: TEventType;
}

export interface INewEventPayload {
  title: string;
  description?: string;
  fee: number;
  type: TEventType;
  member: string;
}

export interface IUpdateEventPayload {
  title: string;
  description?: string;
  fee: number;
  type: TEventType;
  member: string;
}

export interface IEventId {
  id: string;
}
