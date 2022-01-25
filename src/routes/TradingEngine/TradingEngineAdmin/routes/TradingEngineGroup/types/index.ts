export interface Security {
  id: string,
  name: string,
}

export enum GroupCommissionType {
  MONEY = 'MONEY',
  PIPS = 'PIPS',
  PERCENT = 'PERCENT'
}

export enum GroupCommissionLots {
  LOT = 'LOT',
  DEAL = 'DEAL'
}

export enum ArchivePeriodDays {
  DISABLED = 0,
  PERIOD_90 = 90,
  PERIOD_180 = 180,
  PERIOD_365 = 365,
}

export enum ArchiveMaxBalance {
  MAX_0 = 0,
  MAX_100 = 100,
  MAX_1000 = 1000,
  MAX_10000 = 10000,
}

export enum DefaultLeverage {
  LEVERAGE_1 = 1,
  LEVERAGE_2 = 2,
  LEVERAGE_3 = 3,
  LEVERAGE_5 = 5,
  LEVERAGE_15 = 15,
  LEVERAGE_10 = 10,
  LEVERAGE_20 = 20,
  LEVERAGE_25 = 25,
  LEVERAGE_33 = 33,
  LEVERAGE_50 = 50,
  LEVERAGE_66 = 66,
  LEVERAGE_75 = 75,
  LEVERAGE_100 = 100,
  LEVERAGE_125 = 125,
  LEVERAGE_150 = 150,
  LEVERAGE_175 = 175,
  LEVERAGE_200 = 200,
  LEVERAGE_300 = 300,
  LEVERAGE_400 = 400,
  LEVERAGE_500 = 500,
  LEVERAGE_1000 = 1000,
}

export enum SpreadDiff {
  SPREAD_0 = 0,
}

export enum LotMin {
  MIN_0_01 = 0.01,
  MIN_0_10 = 0.10,
  MIN_1_00 = 1.00,
  MIN_10_0 = 10.0,
}

export enum LotMax {
  MAX_1_0 = 1.0,
  MAX_10_0 = 10.0,
  MAX_100_0 = 100.0,
}

export enum LotStep {
  STEP_0_01 = 0.01,
  STEP_0_1 = 0.1,
  STEP_1_0 = 1.0,
}

export interface GroupSecurity {
  security: Security,
  show: boolean,
  spreadDiff: SpreadDiff,
  lotMin: LotMin,
  lotMax: LotMax,
  lotStep: LotStep,
  commissionBase: number,
  commissionType: GroupCommissionType,
  commissionLots: GroupCommissionLots,
}

export interface SwapConfigs {
  long: number,
  short: number,
}

export interface SymbolEntity {
  symbolId: number,
  symbol: string,
  percentage: number,
  swapConfigs: SwapConfigs
}

export interface Margin {
  symbol: string,
  percentage: number,
  swapShort: number,
  swapLong: number,
}

export interface Group {
  groupName: string,
  currency: string,
  description: string,
  enable: boolean,
  defaultLeverage: DefaultLeverage,
  useSwap: boolean,
  hedgeProhibited: boolean,
  archivePeriodDays: ArchivePeriodDays,
  archiveMaxBalance: ArchiveMaxBalance,
  marginCallLevel: number,
  stopoutLevel: number,
  groupSecurities: GroupSecurity[],
  groupMargins: Margin[]
}
