import { AccountType } from 'types/trading-engine';

export interface TradingAccountItem {
  uuid: string,
  name: string,
  login: number,
  group: string,
  platformType: string,
  profileUuid: string,
  registrationDate: string,
  leverage: number,
  balance: number,
  accountType: AccountType,
}
