import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Event,
  EventTypeEnum,
  IEventSearchPayload,
  INewEventPayload,
} from '@temo/database';
import { EventModuleEnum } from 'libs/database/src/entities/event.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>
  ) {}

  async createEvent(payload: INewEventPayload): Promise<Event> {
    const newEvent = this.eventRepository.create({
      title: payload.title,
      description: payload.description,
      module: payload.module as EventModuleEnum,
      type: payload.type as EventTypeEnum,
      data: payload.data,
    });
    return await this.eventRepository.save(newEvent);
  }

  async findById(id: string = ''): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });
    return event;
  }

  async searchEvents(
    payload$: IEventSearchPayload
  ): Promise<{ data: Event[]; total: number }> {
    const current = payload$.page || 1;
    const size = payload$.size || 10;
    const keyword = payload$.keyword || '';
    const type = payload$.type || '';

    let eventsQuery = this.eventRepository.createQueryBuilder('e');
    eventsQuery = eventsQuery.where(
      'title LIKE :keyword OR description LIKE :keyword',
      { keyword: `%${keyword}%` }
    );
    if (type) {
      eventsQuery = eventsQuery.andWhere('type = :type', { type });
    }
    const total = await eventsQuery.getCount();
    eventsQuery = eventsQuery.skip((current - 1) * size).limit(size);
    const data = await eventsQuery.getMany();

    return {
      data,
      total,
    };
  }

  // async updateById(id: string, data$: IUpdateEventPayload): Promise<Event> {
  //   if (!data$.title || !data$.fee || !data$.type) {
  //     throw new Error('exception.charge-event.invalid-input');
  //   }
  //   const current = await this.findById(id);
  //   if (!current) {
  //     throw new Error('exception.charge-event.notfound');
  //   }
  //   current.title = data$.title;
  //   current.description = data$.description || '';
  //   current.type = data$.type as EventTypeEnum;
  //   current.fee = data$.fee;

  //   return await this.eventRepository.save(current);
  // }
}
