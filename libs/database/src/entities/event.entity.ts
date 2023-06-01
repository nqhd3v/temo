import {
  Column,
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
} from 'typeorm';
import { nanoid } from 'nanoid';

export enum EventTypeEnum {
  LOG = 'log',
  ERROR = 'error',
  INFO = 'info',
  PROGRESS = 'progress',
}

export enum EventModuleEnum {
  EVENT = 'event',
  ACCOUNT = 'account',
}

@Entity({ name: 'charge_event' })
export class Event {
  @PrimaryColumn({
    name: 'id',
  })
  public id: string;

  @Column()
  public title: string;

  @Column({
    name: 'description',
    default: '',
  })
  public description: string;

  @Column({
    name: 'type',
    enum: EventTypeEnum,
    default: EventTypeEnum.LOG,
  })
  public type: EventTypeEnum;

  @Column({
    name: 'module',
    default: EventModuleEnum.EVENT,
  })
  public module: EventModuleEnum;

  @Column({
    name: 'data',
    default: '{}',
  })
  public data: string;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updated_at: Date;

  @DeleteDateColumn({
    type: 'timestamptz',
  })
  deleted_at: Date;

  @BeforeInsert()
  updateID() {
    const idStr = nanoid(8);
    this.id = `TD${idStr}`;
  }
}
