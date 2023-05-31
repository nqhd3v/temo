import { Injectable, Logger } from '@nestjs/common';

import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';

import {
  Event,
  IEventId,
  IEventSearchPayload,
  INewEventPayload,
  IUpdateEventPayload,
} from '@temo/database';
import ResponseObj, { IResponseObject } from 'tools/response';

@Injectable()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('EventService', 'getById')
  async getById(data$: IEventId): Promise<IResponseObject<Event>> {
    Logger.log(` 🚩 EventService - getById("${data$.id || ''}")`);
    const event = await this.appService.findById(data$.id);
    if (!event) {
      return ResponseObj.fail('exception.charge-event.notfound');
    }
    return ResponseObj.success(event);
  }

  @GrpcMethod('EventService', 'search')
  async search(
    payload$: IEventSearchPayload
  ): Promise<IResponseObject<{ data: Event[]; total: number }>> {
    Logger.log(` 🚩 EventService - search(${JSON.stringify(payload$)}")`);
    const data = await this.appService.searchEvents(payload$);

    return ResponseObj.success(data);
  }

  @GrpcMethod('EventService', 'updateById')
  async updateById(
    payload$: IUpdateEventPayload & IEventId
  ): Promise<IResponseObject<Event>> {
    Logger.log(` 🚩 EventService - updateById(${JSON.stringify(payload$)})`);
    const { id, ...updateData } = payload$;
    if (!id) {
      return ResponseObj.fail('exception.charge-event.id-undef');
    }
    const event = await this.appService.updateById(id, updateData);
    if (!event) {
      return ResponseObj.fail('exception.charge-event.notfound');
    }
    return ResponseObj.success(event);
  }

  @GrpcMethod('EventService', 'create')
  async create(payload$: INewEventPayload): Promise<IResponseObject<Event>> {
    Logger.log(` 🚩 EventService - updateById(${JSON.stringify(payload$)})`);
    const event = await this.appService.createEvent(payload$);

    return ResponseObj.success(event);
  }
}
