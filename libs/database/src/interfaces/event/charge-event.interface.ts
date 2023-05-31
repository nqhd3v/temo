export interface IEventProperties {
  id: string;
  title: string;
  description: string;
  fee: number;
  type: TEventType;
  member: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

export type TEventType = 'meeting-late' | 'logwork-late';
