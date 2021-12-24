import {
  GroupCommissionType,
  GroupCommissionLots,
  ArchivePeriodDays,
  ArchiveMaxBalance,
  DefaultLeverage,
  SpreadDiff,
  LotMin,
  LotMax,
  LotStep,
} from '../types';

export const ARCHIVE_PERIOD = {
  [ArchivePeriodDays.DISABLED]: 'disabled',
  [ArchivePeriodDays.PERIOD_90]: 90,
  [ArchivePeriodDays.PERIOD_180]: 180,
  [ArchivePeriodDays.PERIOD_365]: 365,
};

export const ARCHIVE_MAX_BALANCE = [
  ArchiveMaxBalance.MAX_0,
  ArchiveMaxBalance.MAX_100,
  ArchiveMaxBalance.MAX_1000,
  ArchiveMaxBalance.MAX_10000,
];

export const DEFAULT_LEVERAGES = [
  DefaultLeverage.LEVERAGE_1,
  DefaultLeverage.LEVERAGE_2,
  DefaultLeverage.LEVERAGE_3,
  DefaultLeverage.LEVERAGE_5,
  DefaultLeverage.LEVERAGE_15,
  DefaultLeverage.LEVERAGE_10,
  DefaultLeverage.LEVERAGE_20,
  DefaultLeverage.LEVERAGE_25,
  DefaultLeverage.LEVERAGE_33,
  DefaultLeverage.LEVERAGE_50,
  DefaultLeverage.LEVERAGE_66,
  DefaultLeverage.LEVERAGE_75,
  DefaultLeverage.LEVERAGE_100,
  DefaultLeverage.LEVERAGE_125,
  DefaultLeverage.LEVERAGE_150,
  DefaultLeverage.LEVERAGE_175,
  DefaultLeverage.LEVERAGE_200,
  DefaultLeverage.LEVERAGE_300,
  DefaultLeverage.LEVERAGE_400,
  DefaultLeverage.LEVERAGE_500,
  DefaultLeverage.LEVERAGE_1000,
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
  LotStep.STEP_1_0,
  LotStep.STEP_10_0,
  LotStep.STEP_100_0,
];

export const COMMISION_TYPES = {
  [GroupCommissionType.PIPS]: 'pt, points',
  [GroupCommissionType.MONEY]: '$',
  [GroupCommissionType.PERCENT]: '%',
};

export const COMMISION_LOTS = {
  [GroupCommissionLots.LOT]: 'per lot',
  [GroupCommissionLots.DEAL]: 'per deal',
};
