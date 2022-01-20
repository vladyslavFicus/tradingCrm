export enum OrderType {
  BUY = 'BUY',
  BUY_LIMIT = 'BUY_LIMIT',
  BUY_STOP = 'BUY_STOP',
  SELL = 'SELL',
  SELL_LIMIT = 'SELL_LIMIT',
  SELL_STOP = 'SELL_STOP',
}

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