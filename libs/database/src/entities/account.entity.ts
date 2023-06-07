import {
  Column,
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  Timestamp,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { nanoid } from 'nanoid';

@Entity({ name: 'account' })
export class Account {
  @PrimaryColumn({
    name: 'id',
  })
  public id: string;

  @Column({
    name: 'username',
    unique: true,
  })
  public username: string;

  @Exclude()
  @Column({
    name: 'password',
  })
  public password: string;

  @Column()
  public name: string;

  @Column({
    name: 'email',
    unique: true,
  })
  public email: string;

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
    this.id = `AC${idStr}`;
  }
}
