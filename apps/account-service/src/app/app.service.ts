import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Account,
  INewAccountPayload,
  IAccountSearchPayload,
} from '@temo/database';
import { AccountProperties } from 'proto/build/account.pb';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>
  ) {}

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
    const currentAccountByUsername = await this.findByUsernameOrEmail(
      data$.username
    );
    const currentAccountByEmail = await this.findByUsernameOrEmail(data$.email);
    if (currentAccountByUsername || currentAccountByEmail) {
      throw new Error('exception.account.existed');
    }
    const newAccount = this.accountRepository.create({
      username: data$.username,
      password: data$.password,
      name: data$.name,
      email: data$.email,
    });
    const account = await this.accountRepository.save(newAccount);

    return account;
  }

  async createMulti(
    data$: INewAccountPayload[],
    options?: {
      skipDuplicated?: boolean;
      onLogAfterCreated?: (data: Account) => void;
    }
  ): Promise<Account[]> {
    const { skipDuplicated, onLogAfterCreated } = options || {
      skipDuplicated: false,
      onLogAfterCreated: () => {},
    };

    const invalidAccounts = data$.filter(
      (d) => !d.email || !d.username || !d.password || !d.name
    );
    if (invalidAccounts.length > 0) {
      throw new Error('exception.account.invalid-input');
    }

    const nonDuplicatedAccountPromises = data$.map(async (d) => {
      const accNeedCheckExisted = await this.findByUsernameOrEmail(d.username);
      return accNeedCheckExisted ? null : d;
    });
    const nonDuplicatedAccounts = await Promise.all(
      nonDuplicatedAccountPromises
    );
    if (nonDuplicatedAccounts.length !== data$.length && !skipDuplicated) {
      throw new Error('exception.account.existed');
    }

    const accountPromises = nonDuplicatedAccounts
      .filter((d) => d)
      .map(async (d) => {
        const newAccountData = this.accountRepository.create({
          username: d.username,
          password: d.password,
          name: d.name,
          email: d.email,
        });
        const newAccount = await this.accountRepository.save(newAccountData);
        onLogAfterCreated(newAccount);

        return newAccount;
      });
    // const accounts = await this.accountRepository.save(newAccounts);
    const accounts = await Promise.all(accountPromises);

    return accounts;
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
