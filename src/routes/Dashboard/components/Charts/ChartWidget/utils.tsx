import moment from 'moment';
import I18n from 'i18n-js';
import { ChartData__Summary__Enum as SummaryEnum } from '__generated__/types';
import { DATE_TIME_BASE_FORMAT } from 'components/DatePickers/constants';
import { ChartData, SummaryData } from './types';

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

// Select Range Options
export const getChartSelectOptions = () => ({
  // LAST 7 DAYS
  lastSevenDays: {
    label: I18n.t('DASHBOARD.CHART_SELECT_OPTIONS.LAST_7_DAYS'),
    range: {
      dateFrom: moment().subtract(6, 'days').startOf('day').format(DATE_TIME_BASE_FORMAT),
      dateTo: moment().add(1, 'day').startOf('day').format(DATE_TIME_BASE_FORMAT),
    },
  },
  // CURRENT WEEK
  currentWeek: {
    label: I18n.t('DASHBOARD.CHART_SELECT_OPTIONS.CURRENT_WEEK'),
    range: {
      dateFrom: moment().startOf('week').format(DATE_TIME_BASE_FORMAT),
      dateTo: moment().add(1, 'day').startOf('day').format(DATE_TIME_BASE_FORMAT),
    },
  },
  // PAST WEEK
  pastWeek: {
    label: I18n.t('DASHBOARD.CHART_SELECT_OPTIONS.PAST_WEEK'),
    range: {
      dateFrom: moment().subtract(1, 'week').startOf('week').format(DATE_TIME_BASE_FORMAT),
      dateTo: moment().startOf('week').format(DATE_TIME_BASE_FORMAT),
    },
  },
  // LAST MONTH
  lastMonth: {
    label: I18n.t('DASHBOARD.CHART_SELECT_OPTIONS.LAST_MONTH'),
    range: {
      dateFrom: moment().subtract(1, 'month').add(1, 'days').startOf('day')
        .format(DATE_TIME_BASE_FORMAT),
      dateTo: moment().add(1, 'day').startOf('day').format(DATE_TIME_BASE_FORMAT),
    },
  },
  // PAST_MONTH
  pastMonth: {
    label: I18n.t('DASHBOARD.CHART_SELECT_OPTIONS.PAST_MONTH'),
    range: {
      dateFrom: moment().subtract(1, 'month').startOf('month').format(DATE_TIME_BASE_FORMAT),
      dateTo: moment().startOf('month').format(DATE_TIME_BASE_FORMAT),
    },
  },
});

// Summury Ranges
const summaryRanges = () => [
  // TODAY SUMMURY
  {
    type: SummaryEnum.TODAY,
    dateFrom: moment().startOf('day')
      .format(DATE_TIME_BASE_FORMAT),
    dateTo: moment().add(1, 'day').startOf('day')
      .format(DATE_TIME_BASE_FORMAT),
  },
  // THIS MONTH SUMMURY
  {
    type: SummaryEnum.MONTH,
    dateFrom: moment().startOf('month')
      .format(DATE_TIME_BASE_FORMAT),
    dateTo: moment().endOf('month').add(1, 'day').startOf('day')
      .format(DATE_TIME_BASE_FORMAT),
  },
  // TOTAL MONTH SUMMURY
  {
    type: SummaryEnum.TOTAL,
    dateTo: moment().endOf('day')
      .format(DATE_TIME_BASE_FORMAT),
  },
];

// Initial Request Params
export const chartInitialQueryParams = () => ({
  ...getChartSelectOptions().lastSevenDays.range,
  zoneId: moment().format('Z'),
  summary: summaryRanges(),
});
