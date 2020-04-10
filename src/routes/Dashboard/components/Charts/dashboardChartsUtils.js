import moment from 'moment';
import I18n from 'i18n-js';
import keyMirror from 'keymirror';

const detalization = keyMirror({
  PER_DAYS: null,
  PER_HOURS: null,
  PER_MINUTES: null,
});

const defaultAdditionalStatistics = (fromName, toName) => [
  {
    [fromName]: moment()
      .startOf('day')
      .utc()
      .format(),
    [toName]: moment()
      .add(1, 'day')
      .startOf('day')
      .utc()
      .format(),
  },
  {
    [fromName]: moment()
      .startOf('month')
      .utc()
      .format(),
    [toName]: moment()
      .endOf('month')
      .utc()
      .format(),
  },
  {
    [toName]: moment()
      .endOf('day')
      .utc()
      .format(),
  },
];

const initialDateQueryParams = (fromName, toName) => ({
  [fromName]: moment()
    .subtract(6, 'days')
    .startOf('day')
    .format(),
  [toName]: moment()
    .add(1, 'day')
    .startOf('day')
    .format(),
});

const initialDateQueryParamsUTC = (fromName, toName) => ({
  [fromName]: moment()
    .subtract(6, 'days')
    .startOf('day')
    .utc()
    .format(),
  [toName]: moment()
    .add(1, 'day')
    .startOf('day')
    .utc()
    .format(),
});

export const initialPaymentQueryParams = (from, to, args) => ({
  ...initialDateQueryParams(from, to),
  detalization: detalization.PER_DAYS,
  additionalStatistics: defaultAdditionalStatistics('dateFrom', 'dateTo'),
  ...args,
});

export const initialRegistrationQueryParams = (from, to, args) => ({
  ...initialDateQueryParamsUTC(from, to),
  detalization: detalization.PER_DAYS,
  additionalStatistics: defaultAdditionalStatistics('from', 'to'),
  ...args,
});

export const getChartSelectOptions = [
  {
    label: I18n.t('DASHBOARD.CHART_SELECT_OPTIONS.LAST_7_DAYS'),
    value: moment()
      .subtract(6, 'days')
      .startOf('day')
      .utc()
      .format(),
    endDate: moment()
      .add(1, 'day')
      .startOf('day')
      .utc()
      .format(),
  },
  {
    label: I18n.t('DASHBOARD.CHART_SELECT_OPTIONS.CURRENT_WEEK'),
    value: moment()
      .startOf('week')
      .utc()
      .format(),
    endDate: moment()
      .add(1, 'day')
      .startOf('day')
      .utc()
      .format(),
  },
  {
    label: I18n.t('DASHBOARD.CHART_SELECT_OPTIONS.PAST_WEEK'),
    value: moment()
      .subtract(1, 'week')
      .startOf('week')
      .utc()
      .format(),
    endDate: moment()
      .startOf('week')
      .utc()
      .format(),
  },
  {
    label: I18n.t('DASHBOARD.CHART_SELECT_OPTIONS.LAST_MONTH'),
    value: moment()
      .subtract(1, 'month')
      .add(1, 'days')
      .startOf('day')
      .utc()
      .format(),
    endDate: moment()
      .add(1, 'day')
      .startOf('day')
      .utc()
      .format(),
  },
  {
    label: I18n.t('DASHBOARD.CHART_SELECT_OPTIONS.PAST_MONTH'),
    value: moment()
      .subtract(1, 'month')
      .startOf('month')
      .utc()
      .format(),
    endDate: moment()
      .startOf('month')
      .utc()
      .format(),
  },
];

export const mapTotalObject = (object, selector) => (object
  ? Object
    .entries(object)
    .reduce((acc, [key, value]) => {
      const position = key.toLowerCase().indexOf(selector);

      if (position !== -1) {
        return {
          ...acc,
          [key.substring(0, position)]: { value },
        };
      }

      return acc;
    }, {})
  : {}
);
