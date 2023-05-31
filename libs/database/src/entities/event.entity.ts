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
  MEETING_LATE = 'meeting-late',
  LOGWORK_LATE = 'logwork-late',
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
  })
  public type: EventTypeEnum;

  @Column()
  public fee: number;

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
