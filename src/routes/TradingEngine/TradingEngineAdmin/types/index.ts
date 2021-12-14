export enum SessionType {
  TRADE = 'trade',
  QUOTE = 'quote',
}

export enum DayOfWeek {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY'
}

export enum SymbolType {
  FOREX = 'FOREX',
  CFD = 'CFD'
}

export enum SwapType {
  POINTS = 'POINTS',
  MONEY_IN_ACCOUNT_CURRENCY = 'MONEY_IN_ACCOUNT_CURRENCY',
  INTEREST_CURRENT_PRICE = 'INTEREST_CURRENT_PRICE',
}

export interface SymbolSession {
  dayOfWeek: DayOfWeek,
  trade?: {
    openTime: string,
    closeTime: string,
  },
  quote?: {
    openTime: string,
    closeTime: string,
  },
}

export interface FormValues {
  symbol: string,
  source: string,
  digits: number,
  description: string,
  securityName: string,
  symbolType: SymbolType,
  baseCurrency: string,
  quoteCurrency: string,
  backgroundColor: string,
  swapConfigs: {
    enable: boolean,
    rollover: DayOfWeek,
    type: SwapType,
    long: number,
    short: number,
  },
  filtration: {
    filterSmoothing: number,
    softFilter: number,
    hardFilter: number,
    softFiltrationLevel: number,
    hardFiltrationLevel: number,
    discardFiltrationLevel: number,
  },
  bidSpread: number,
  askSpread: number,
  stopsLevel: number,
  lotSize: number,
  percentage: number,
  marginCalculation: SymbolType,
  profitCalculation: SymbolType,
  symbolSessions: SymbolSession[],
}
