/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "Worker";

export interface JobProperties {
  id: string;
  name: string;
  state: string;
  module: string;
  data: string;
  note: string;
}

/** Service - Method's responses */
export interface JobResponse {
  isSuccess: boolean;
  message?: string | undefined;
  data: JobProperties | undefined;
}

export interface JobsData {
  data: JobProperties[];
  total: number;
}

export interface JobsResponse {
  isSuccess: boolean;
  message?: string | undefined;
  data: JobsData | undefined;
}

/** Service - Params */
export interface JobIdParams {
  id: string;
}

export interface NewJobParams {
  name: string;
  data: string;
  module: string;
  note?: string | undefined;
  state?: string | undefined;
}

export interface SearchJobsParams {
  name?: string | undefined;
  page?: number | undefined;
  size?: number | undefined;
  state?: string | undefined;
  module?: string | undefined;
}

export interface UpdateJobParams {
  state: number;
  data: string;
  note: string;
}

export const WORKER_PACKAGE_NAME = "Worker";

export interface WorkerServiceClient {
  create(request: NewJobParams): Observable<JobResponse>;

  search(request: SearchJobsParams): Observable<JobsResponse>;

  updateById(request: UpdateJobParams): Observable<JobResponse>;
}

export interface WorkerServiceController {
  create(request: NewJobParams): Promise<JobResponse> | Observable<JobResponse> | JobResponse;

  search(request: SearchJobsParams): Promise<JobsResponse> | Observable<JobsResponse> | JobsResponse;

  updateById(request: UpdateJobParams): Promise<JobResponse> | Observable<JobResponse> | JobResponse;
}

export function WorkerServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["create", "search", "updateById"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("WorkerService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("WorkerService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const WORKER_SERVICE_NAME = "WorkerService";
