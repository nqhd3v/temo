import { Injectable, OnModuleInit, Inject, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientGrpc } from '@nestjs/microservices';
import {
  Account,
  INewAccountPayload,
  IAccountSearchPayload,
  IEventService,
} from '@temo/database';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService implements OnModuleInit {
  private eventMicroservice: IEventService;

  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @Inject('EVENT_PACKAGE') private client: ClientGrpc
  ) {}

  onModuleInit() {
    this.eventMicroservice =
      this.client.getService<IEventService>('EventService');
  }

  async findById(id: string = ''): Promise<Account> {
    const account = await this.accountRepository.findOne({ where: { id } });
    return account;
  }

  async findByUsernameOrEmail(searchString: string = ''): Promise<Account> {
    const account = await this.accountRepository
      .createQueryBuilder()
      .where('username = :str OR email = :str', { str: searchString })
      .getOne();
    return account;
  }

  async create(data$: INewAccountPayload): Promise<Account> {
    if (!data$.email || !data$.username || !data$.password || !data$.name) {
      throw new Error('exception.account.invalid-input');
    }
    const currentAccount = await this.findByUsernameOrEmail(data$.username);
    if (currentAccount) {
      throw new Error('exception.account.existed');
    }
    const newAccount = this.accountRepository.create({
      username: data$.username,
      password: data$.password,
      name: data$.name,
      email: data$.email,
    });
    const account = await this.accountRepository.save(newAccount);
    // create new event
    const event = await lastValueFrom(
      this.eventMicroservice.create({
        title: 'System just created a new account!',
        description: 'An account was created automatic by system.',
        type: 'logwork-late',
        fee: 0,
        member: account.id,
      })
    );
    Logger.log(' - Added a new event to database');

    return account;
  }

  async search(
    data$: IAccountSearchPayload
  ): Promise<{ data: Account[]; total: number }> {
    const current = data$.page || 1;
    const size = data$.size || 10;
    const keyword = data$.keyword || '';

    let accountsQuery = this.accountRepository.createQueryBuilder('a');
    accountsQuery = accountsQuery.where(
      'username LIKE :keyword OR name LIKE :keyword',
      { keyword: `%${keyword}%` }
    );
    const total = await accountsQuery.getCount();
    accountsQuery = accountsQuery.skip((current - 1) * size).limit(size);
    const data = await accountsQuery.getMany();

    return {
      data,
      total,
    };
  }
}
