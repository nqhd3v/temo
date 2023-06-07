/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Timestamp } from "./google/protobuf/timestamp.pb";

export const protobufPackage = "Event";

export interface EventProperties {
  id: string;
  title: string;
  description: string;
  type: string;
  module: string;
  data: string;
  created_at: Timestamp | undefined;
  updated_at: Timestamp | undefined;
}

/** Service - Method's responses */
export interface EventResponse {
  isSuccess: boolean;
  message: string;
  data: EventProperties | undefined;
}

export interface EventsData {
  data: EventProperties[];
  total: number;
}

export interface EventsResponse {
  isSuccess: boolean;
  message: string;
  data: EventsData | undefined;
}

/** Service - Params */
export interface EventIdParams {
  id: string;
}

export interface NewEventParams {
  title: string;
  description: string;
  type: string;
  module: string;
  data: string;
}

export interface SearchEventParams {
  keyword: string;
  page: number;
  size: number;
  type: string;
  module: string;
}

export const EVENT_PACKAGE_NAME = "Event";

export interface EventServiceClient {
  findById(request: EventIdParams): Observable<EventResponse>;

  create(request: NewEventParams): Observable<EventResponse>;

  streamCreate(request: Observable<NewEventParams>): Observable<EventResponse>;

  search(request: SearchEventParams): Observable<EventsResponse>;
}

export interface EventServiceController {
  findById(request: EventIdParams): Promise<EventResponse> | Observable<EventResponse> | EventResponse;

  create(request: NewEventParams): Promise<EventResponse> | Observable<EventResponse> | EventResponse;

  streamCreate(request: Observable<NewEventParams>): Promise<EventResponse> | Observable<EventResponse> | EventResponse;

  search(request: SearchEventParams): Promise<EventsResponse> | Observable<EventsResponse> | EventsResponse;
}

export function EventServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findById", "create", "search"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("EventService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = ["streamCreate"];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("EventService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const EVENT_SERVICE_NAME = "EventService";
