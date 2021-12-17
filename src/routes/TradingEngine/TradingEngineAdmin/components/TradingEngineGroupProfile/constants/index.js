import {
  GroupCommissionType,
  GroupCommissionLots,
  ArchivePeriod,
  ArchiveMaxBalance,
  Currency,
  DefaultLeverage,
  SpreadDiff,
  LotMin,
  LotMax,
  LotStep,
} from '../types';

export const ARCHIVE_PERIOD = [
  { value: ArchivePeriod.DISABLED, label: 'disabled' },
  { value: ArchivePeriod.PERIOD_90, label: 90 },
  { value: ArchivePeriod.PERIOD_180, label: 180 },
  { value: ArchivePeriod.PERIOD_365, label: 365 },
];

export const ARCHIVE_MAX_BALANCE = [
  ArchiveMaxBalance.MAX_0,
  ArchiveMaxBalance.MAX_100,
  ArchiveMaxBalance.MAX_1000,
  ArchiveMaxBalance.MAX_10000,
];

export const CURRENCIES = [
  Currency.USD,
  Currency.EUR,
  Currency.GBP,
];

export const DEFAULT_LEVERAGES = [
  { value: DefaultLeverage.LEVERAGE_1, label: '1:1' },
  { value: DefaultLeverage.LEVERAGE_2, label: '1:2' },
  { value: DefaultLeverage.LEVERAGE_3, label: '1:3' },
  { value: DefaultLeverage.LEVERAGE_5, label: '1:5' },
  { value: DefaultLeverage.LEVERAGE_15, label: '1:15' },
  { value: DefaultLeverage.LEVERAGE_10, label: '1:10' },
  { value: DefaultLeverage.LEVERAGE_20, label: '1:20' },
  { value: DefaultLeverage.LEVERAGE_25, label: '1:25' },
  { value: DefaultLeverage.LEVERAGE_33, label: '1:33' },
  { value: DefaultLeverage.LEVERAGE_50, label: '1:50' },
  { value: DefaultLeverage.LEVERAGE_66, label: '1:66' },
  { value: DefaultLeverage.LEVERAGE_75, label: '1:75' },
  { value: DefaultLeverage.LEVERAGE_100, label: '1:100' },
  { value: DefaultLeverage.LEVERAGE_125, label: '1:125' },
  { value: DefaultLeverage.LEVERAGE_150, label: '1:150' },
  { value: DefaultLeverage.LEVERAGE_175, label: '1:175' },
  { value: DefaultLeverage.LEVERAGE_200, label: '1:200' },
  { value: DefaultLeverage.LEVERAGE_300, label: '1:300' },
  { value: DefaultLeverage.LEVERAGE_400, label: '1:400' },
  { value: DefaultLeverage.LEVERAGE_500, label: '1:500' },
  { value: DefaultLeverage.LEVERAGE_1000, label: '1:1000' },
];

export const SPRED_DIFFERANCE = [
  SpreadDiff.SPRED_0,
];

export const LOT_MIN = [
  LotMin.MIN_0_01,
  LotMin.MIN_0_10,
  LotMin.MIN_1_00,
  LotMin.MIN_10_0,
  LotMin.MIN_100,
];

export const LOT_MAX = [
  LotMax.MAX_0_1,
  LotMax.MAX_1_0,
  LotMax.MAX_10_0,
  LotMax.MAX_100_0,
  LotMax.MAX_500_0,
  LotMax.MAX_1000_0,
  LotMax.MAX_10000_0,
];

export const LOT_STEP = [
  LotStep.STEP_0_01,
  LotStep.STEP_0_1,
  LotStep.STEP_1,
  LotStep.STEP_10_0,
  LotStep.STEP_100_0,
];

export const COMMISION_TYPES = [
  { value: GroupCommissionType.PIPS, label: 'pt, points' },
  { value: GroupCommissionType.MONEY, label: '$' },
  { value: GroupCommissionType.PERCENT, label: '%' },
];
export const COMMISION_LOTS = [
  { value: GroupCommissionLots.LOT, label: 'per lot' },
  { value: GroupCommissionLots.DEAL, label: 'per deal' },
];
