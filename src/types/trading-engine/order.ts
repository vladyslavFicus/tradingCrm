import { TradingEngine__OperationTypes__Enum as OrderType } from '__generated__/types';

export { OrderType };

export enum OrderTypeOnCreation {
  MARKET = 'MARKET',
  STOP = 'STOP',
  LIMIT = 'LIMIT',
}

export enum OrderStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  PENDING = 'PENDING',
  CANCELED = 'CANCELED',
}

export enum OrderDirection {
  BUY = 'BUY',
  SELL = 'SELL',
}
