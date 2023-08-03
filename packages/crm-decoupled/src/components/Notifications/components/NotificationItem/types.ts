export enum TypeIcons {
  ACCOUNT = 'ACCOUNT',
  CALLBACK = 'CALLBACK',
  CLIENT = 'CLIENT',
  DEPOSIT = 'DEPOSIT',
  KYC = 'KYC',
  TRADING = 'TRADING',
  WITHDRAWAL = 'WITHDRAWAL',
  AUTH = 'AUTH',
}

export enum TypePriorities {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum Subtypes {
  BULK_CLIENTS_ASSIGNED = 'BULK_CLIENTS_ASSIGNED',
  PASSWORD_EXPIRATION_NOTIFICATION = 'PASSWORD_EXPIRATION_NOTIFICATION',
}

export type DetailsType = {
  amount: string,
  currency: string,
  platformType: string,
  login: string,
  callbackTime: string,
  clientsCount: string,
  expirationTime: string,
}
