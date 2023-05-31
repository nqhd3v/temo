import { Observable } from 'rxjs';
import { IAccountProperties } from './account.interface';
import { IResponseObject } from 'tools/response';

export default interface IAccountService {
  findById(
    payload: IAccountId
  ): Observable<IResponseObject<IAccountProperties>>;
  findByUsernameOrEmail(
    payload: IAccountSearchString
  ): Observable<IResponseObject<IAccountProperties>>;
  search(
    payload: IAccountSearchPayload
  ): Observable<IResponseObject<{ data: IAccountProperties[]; total: number }>>;
  create(
    payload: INewAccountPayload
  ): Observable<IResponseObject<IAccountProperties>>;
}

export interface IAccountSearchPayload {
  keyword?: string;
  page?: number;
  size?: number;
}

export interface INewAccountPayload {
  name: string;
  username: string;
  password: string;
  email: string;
}

export interface IAccountId {
  id: string;
}

export interface IAccountSearchString {
  searchString: string;
}
