export type Filter = {
  read?: boolean,
  notificationTypes?: Array<string>,
};

export enum NotificationType {
  CLIENTS_DISTRIBUTOR = 'CLIENTS_DISTRIBUTOR',
  WITHDRAWAL = 'WITHDRAWAL',
  DEPOSIT = 'DEPOSIT',
  ACCOUNT = 'ACCOUNT',
  CALLBACK = 'CALLBACK',
}

export enum NotificationSubType {
  MARGIN_CALL = 'MARGIN_CALL',
  BULK_CLIENTS_ASSIGNED = 'BULK_CLIENTS_ASSIGNED',
}
