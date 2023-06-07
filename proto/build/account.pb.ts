/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Timestamp } from "./google/protobuf/timestamp.pb";

export const protobufPackage = "Account";

export interface AccountProperties {
  id: string;
  username: string;
  password: string;
  email: string;
  name: string;
  created_at: Timestamp | undefined;
  updated_at: Timestamp | undefined;
  deleted_at: Timestamp | undefined;
}

/** Service - Method's responses */
export interface AccountResponse {
  isSuccess: boolean;
  message?: string | undefined;
  data: AccountProperties | undefined;
}

export interface CreateAccountsResponse {
  isSuccess: boolean;
  message?: string | undefined;
  data: AccountProperties[];
}

export interface AccountsData {
  data: AccountProperties[];
  total: number;
}

export interface AccountsResponse {
  isSuccess: boolean;
  message?: string | undefined;
  data: AccountsData | undefined;
}

/** Service - Params */
export interface AccountIdParams {
  id: string;
}

export interface NewAccountParams {
  username: string;
  password: string;
  name: string;
  email: string;
}

export interface NewAccountsParams {
  data: NewAccountParams[];
}

export interface SearchAccountParams {
  keyword: string;
  page: number;
  size: number;
}

export interface UpdateAccountPayload {
  name: string;
  email: string;
}

export interface UpdateAccountParams {
  id: number;
  data: UpdateAccountPayload | undefined;
}

export const ACCOUNT_PACKAGE_NAME = "Account";

export interface AccountServiceClient {
  findById(request: AccountIdParams): Observable<AccountResponse>;

  create(request: NewAccountParams): Observable<AccountResponse>;

  createMulti(request: NewAccountsParams): Observable<CreateAccountsResponse>;

  search(request: SearchAccountParams): Observable<AccountsResponse>;
}

export interface AccountServiceController {
  findById(request: AccountIdParams): Promise<AccountResponse> | Observable<AccountResponse> | AccountResponse;

  create(request: NewAccountParams): Promise<AccountResponse> | Observable<AccountResponse> | AccountResponse;

  createMulti(
    request: NewAccountsParams,
  ): Promise<CreateAccountsResponse> | Observable<CreateAccountsResponse> | CreateAccountsResponse;

  search(request: SearchAccountParams): Promise<AccountsResponse> | Observable<AccountsResponse> | AccountsResponse;
}

export function AccountServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findById", "create", "createMulti", "search"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AccountService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AccountService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const ACCOUNT_SERVICE_NAME = "AccountService";
