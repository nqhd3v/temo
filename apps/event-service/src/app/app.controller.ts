import { Injectable, Logger } from '@nestjs/common';

import { AppService } from './app.service';
import { EventServiceControllerMethods } from '../../../../proto/build/event.pb';

import {
  Event,
  IEventId,
  IEventSearchPayload,
  INewEventPayload,
  // IUpdateEventPayload,
} from '@temo/database';
import ResponseObj, { IResponseObject } from 'tools/response';
import { Observable, Subject } from 'rxjs';

@EventServiceControllerMethods()
export class AppController {
  constructor(private readonly appService: AppService) {}

  async getById(data$: IEventId): Promise<IResponseObject<Event>> {
    Logger.log(` 🚩 EventService - getById("${data$.id || ''}")`);
    const event = await this.appService.findById(data$.id);
    if (!event) {
      return ResponseObj.fail('exception.charge-event.notfound');
    }
    return ResponseObj.success(event);
  }

  async search(
    payload$: IEventSearchPayload
  ): Promise<IResponseObject<{ data: Event[]; total: number }>> {
    Logger.log(` 🚩 EventService - search(${JSON.stringify(payload$)}")`);
    const data = await this.appService.searchEvents(payload$);

    return ResponseObj.success(data);
  }

  async streamCreate(
    data$: Observable<INewEventPayload>,
    metadata$: Record<string, any>
  ) {
    Logger.log(
      ` 🚩 EventService - streamCreate - ${typeof data$} - ${JSON.stringify(
        data$
      )} - ${JSON.stringify(metadata$)}`
    );
    const subject = new Subject();

    const onNext = (message) => {
      console.log(message);
      subject.next({
        reply: 'Hello, world!',
      });
    };
    const onComplete = () => subject.complete();
    data$.subscribe({
      next: onNext,
      complete: onComplete,
    });

    return subject.asObservable();
  }

  async create(payload$: INewEventPayload): Promise<IResponseObject<Event>> {
    Logger.log(` 🚩 EventService - create(${JSON.stringify(payload$)})`);
    const event = await this.appService.createEvent(payload$);

    return ResponseObj.success(event);
  }
}
