import {
  TradingEngine__SymbolTypes__Enum as SymbolType,
  TradingEngine__DaysOfWeek__Enum as DayOfWeek,
  TradingEngine__SwapTypes__Enum as SwapType,
  TradingEngineEditSymbol__SymbolSessions__Input as SymbolSession,
  TradingEngineSymbol__SwapsConfigsSwapDayTimes as SwapDayTimes,
} from '__generated__/types';

export enum SessionType {
  TRADE = 'trade',
  QUOTE = 'quote',
}

export {
  SymbolType,
  DayOfWeek,
  SwapType,
};

export type { SymbolSession };

export interface FormValues {
  symbol: string,
  source: string,
  digits: number,
  description: string,
  securityName: string,
  symbolType: SymbolType,
  baseCurrency: string | null,
  quoteCurrency: string,
  backgroundColor: string,
  swapConfigs: {
    enable: boolean,
    swapDayTimes: [SwapDayTimes],
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
  symbolSessions: SymbolSession[],
  lotMin: number,
  lotMax: number,
  lotStep: number,
  defaultFiltration: boolean,
}
