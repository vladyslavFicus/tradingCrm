import I18n from 'i18n-js';
import moment from 'moment';
import { ChartData__Summary__Enum as SummaryEnum } from '__generated__/types';
import { DATE_TIME_BASE_FORMAT } from 'components/DatePickers/constants';
import { ChartSelectOptions } from './types';

// Select Range Options
export const chartSelectOptions: ChartSelectOptions = {
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
  // CURRENT MONTH
  currentMonth: {
    label: I18n.t('DASHBOARD.CHART_SELECT_OPTIONS.CURRENT_MONTH'),
    range: {
      dateFrom: moment().startOf('month').format(DATE_TIME_BASE_FORMAT),
      dateTo: moment().add(1, 'day').startOf('day').format(DATE_TIME_BASE_FORMAT),
    },
  },
  // PAST MONTH
  pastMonth: {
    label: I18n.t('DASHBOARD.CHART_SELECT_OPTIONS.PAST_MONTH'),
    range: {
      dateFrom: moment().subtract(1, 'month').startOf('month').format(DATE_TIME_BASE_FORMAT),
      dateTo: moment().startOf('month').format(DATE_TIME_BASE_FORMAT),
    },
  },
};

// Summury Ranges
export const summaryRanges = [
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
