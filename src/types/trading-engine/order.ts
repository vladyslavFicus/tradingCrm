import {
  TradingEngine__OperationTypes__Enum as OrderType,
  TradingEngine__OrderStatuses__Enum as OrderStatus,
} from '__generated__/types';

export { OrderType, OrderStatus };

export enum OrderTypeOnCreation {
  MARKET = 'MARKET',
  STOP = 'STOP',
  LIMIT = 'LIMIT',
}

export enum OrderDirection {
  BUY = 'BUY',
  SELL = 'SELL',
}
