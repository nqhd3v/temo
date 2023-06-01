import { nanoid } from 'nanoid';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

export enum JobNameEnum {
  IMPORT_ACCOUNTS = 'import-accounts',
}

export enum JobModuleEnum {
  ACCOUNT = 'account',
  EVENT = 'event',
}

export enum JobStateEnum {
  DONE = 'done',
  ERROR = 'err',
  WAITING = 'waiting',
  PROCESSING = 'processing',
  CREATE = 'create',
}

@Entity({ name: 'queue' })
export class Job {
  @PrimaryColumn({
    name: 'id',
  })
  public id: string;

  @Column({
    name: 'name',
    enum: JobNameEnum,
  })
  public name: JobNameEnum;

  @Column({
    name: 'module',
  })
  public module: JobModuleEnum;

  @Column({
    name: 'state',
    enum: JobStateEnum,
    default: JobStateEnum.WAITING,
  })
  public state: JobStateEnum;

  @Column({
    name: 'data',
    default: '{}',
  })
  public data: string;

  @Column({
    name: 'note',
    default: '',
  })
  public note: string;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  public updated_at: Date;

  @BeforeInsert()
  updateBeforeInsert() {
    const idStr = nanoid(8);
    this.id = this.id || `QU${idStr}`;
  }

  public static genId() {
    return `QU${nanoid(8)}`;
  }
}
