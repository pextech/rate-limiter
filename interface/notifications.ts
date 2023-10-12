
export interface NotificationAttributes {
  id?: number;
  type: NOTIFICATION_TYPE;
  title: string;
  message: string;
  UserId?: number;
}

export enum NOTIFICATION_TYPE {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
}
