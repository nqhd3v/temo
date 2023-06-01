export interface IEventProperties {
  id: string;
  title: string;
  description: string;
  module: TEventModule;
  type: TEventType;
  data: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

export type TEventType = 'log' | 'error' | 'info' | 'progress';
export type TEventModule = 'account' | 'event';
