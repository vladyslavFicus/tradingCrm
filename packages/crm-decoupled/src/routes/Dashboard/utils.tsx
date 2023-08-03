import moment from 'moment';
import I18n from 'i18n-js';
import { ChartData__Summary__Enum as SummaryEnum } from '__generated__/types';
import { ChartData, SummaryData } from './types';
import { chartSelectOptions, summaryRanges } from './constants';

// Y Axis With
export const getYAxisWidth = (chartData: ChartData): number | undefined => {
  const maxYAxisValueLength = Math.max(...chartData.map(item => item.entryValue)).toString().length;

  if (maxYAxisValueLength < 7) {
    return undefined;
  }

  if (maxYAxisValueLength === 7) {
    return 80;
  }

  if (maxYAxisValueLength === 8) {
    return 90;
  }

  return 105;
};

// Value Formatter
export const valueFormatter = (value: number, currncySymbol?: string): string => {
  if (currncySymbol) {
    return `${I18n.toCurrency(value, { unit: '' })} ${currncySymbol}`;
  }

  return `${value}`;
};

// Value Axis Formatter
export const valueAxisFormatter = (label: string): string => {
  if (label.length > 10) {
    return `${label.substring(0, 7)}...`;
  }

  return label;
};

// Date Axis Formatter
export const dateAxisFormatter = (entryDate: string): string => moment(entryDate).format('DD.MM');

// Get Summary Value
export const getSummaryValue = (summary: SummaryData, key: SummaryEnum): number => {
  const row = summary.find(item => item.type === key);

  return row?.value || 0;
};

// Initial Request Params
export const chartInitialQueryParams = () => ({
  ...chartSelectOptions.lastSevenDays.range,
  zoneId: moment().format('Z'),
  summary: summaryRanges,
});
