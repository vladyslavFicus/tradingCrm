import React from 'react';
import { TooltipProps } from 'recharts';
import {
  ChartData__Item as ChartDataItem,
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

export enum SelectOption {
  LAST_7_DAYS = 'lastSevenDays',
  CURRENT_WEEK = 'currentWeek',
  PAST_WEEK = 'pastWeek',
  LAST_MONTH = 'lastMonth',
  CURRENT_MONTH = 'currentMonth',
  PASS_MONTS = 'pastMonth',
}
