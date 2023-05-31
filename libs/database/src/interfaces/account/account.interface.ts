export interface IAccountProperties {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

export interface IAccountResponse
  extends Omit<IAccountProperties, 'password' | 'updated_at' | 'deleted_at'> {}
