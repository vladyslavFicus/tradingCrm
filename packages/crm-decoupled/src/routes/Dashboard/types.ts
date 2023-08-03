import React from 'react';
import { TooltipProps } from 'recharts';
import {
  ChartData__Item as ChartDataItem,
  ChartData__Summary as ChartDataSummary,
  ChartData__Summary as SummaryItem,
  ChartData__Summary__Enum as SummaryEnum,
} from '__generated__/types';

export type ChartData = Array<ChartDataItem>;

export type SummaryData = Array<SummaryItem>;

export type Chart = {
  data: ChartData,
  chartColor: string,
  renderTooltip: (tooltipProps: TooltipProps) => React.ReactNode,
};

export type DateRange = {
  dateFrom: string,
  dateTo: string,
};

export type SummaryColumn = {
  label: string,
  key: SummaryEnum,
};

// Api charts
export type UseChart = {
  isChartLoading: boolean,
  isChartError: boolean,
  chartList: Array<ChartDataItem>,
  summaryList: Array<ChartDataSummary>,
  handleSelectChange: (range: DateRange) => void,
};

type Option = {
  label: string,
  range: DateRange,
};

export type ChartSelectOptions = Record<SelectOption, Option>;

export enum SelectOption {
  LAST_7_DAYS = 'lastSevenDays',
  CURRENT_WEEK = 'currentWeek',
  PAST_WEEK = 'pastWeek',
  LAST_MONTH = 'lastMonth',
  CURRENT_MONTH = 'currentMonth',
  PASS_MONTS = 'pastMonth',
}

export enum Charts {
  depositAmountStatistic = 'depositAmountStatistic',
  depositCountStatistic = 'depositCountStatistic',
  ftdAmountStatistic = 'ftdAmountStatistic',
  ftdCountStatistic = 'ftdCountStatistic',
  ftrAmountStatistic = 'ftrAmountStatistic',
  ftrCountStatistic = 'ftrCountStatistic',
  registrationStatistic = 'registrationStatistic',
  retentionAmountStatistic = 'retentionAmountStatistic',
  retentionCountStatistic = 'retentionCountStatistic',
  withdrawalAmountStatistic = 'withdrawalAmountStatistic',
  withdrawalCountStatistic = 'withdrawalCountStatistic',
}

export enum Grids {
  lastDeposits = 'lastDeposits',
  lastNotifications = 'lastNotifications',
  lastRegistration = 'lastRegistration',
  lastWithdrawals = 'lastWithdrawals',
}
