import moment from 'moment';
import I18n from 'i18n-js';
import keyMirror from 'keymirror';

const detalization = keyMirror({
  PER_DAYS: null,
  PER_HOURS: null,
  PER_MINUTES: null,
});

const defaultAdditionalStatistics = [{
  dateFrom: moment()
    .startOf('day')
    .format(),
  dateTo: moment()
    .add(1, 'day')
    .startOf('day')
    .format(),
}, {
  dateFrom: moment()
    .startOf('month')
    .format(),
  dateTo: moment()
    .endOf('month')
    .format(),
}, {
  dateTo: moment()
    .endOf('day')
    .format(),
}];

export const initialDateQueryParams = (fromName, toName) => ({
  [fromName]: moment()
    .subtract(6, 'days')
    .startOf('day')
    .format(),
  [toName]: moment()
    .add(1, 'day')
    .startOf('day')
    .format(),
});

export const initialPaymentQueryParams = (from, to, args) => ({
  ...initialDateQueryParams(from, to),
  detalization: detalization.PER_DAYS,
  additionalStatistics: defaultAdditionalStatistics,
  ...args,
});

export const getChartSelectOptions = [
  {
    label: I18n.t('DASHBOARD.CHART_SELECT_OPTIONS.LAST_7_DAYS'),
    value: moment()
      .subtract(6, 'days')
      .startOf('day')
      .format(),
    endDate: moment()
      .add(1, 'day')
      .startOf('day')
      .format(),
  },
  {
    label: I18n.t('DASHBOARD.CHART_SELECT_OPTIONS.CURRENT_WEEK'),
    value: moment()
      .startOf('week')
      .format(),
    endDate: moment()
      .add(1, 'day')
      .startOf('day')
      .format(),
  },
  {
    label: I18n.t('DASHBOARD.CHART_SELECT_OPTIONS.PAST_WEEK'),
    value: moment()
      .subtract(1, 'week')
      .startOf('week')
      .format(),
    endDate: moment()
      .startOf('week')
      .format(),
  },
  {
    label: I18n.t('DASHBOARD.CHART_SELECT_OPTIONS.LAST_MONTH'),
    value: moment()
      .subtract(1, 'month')
      .add(1, 'days')
      .startOf('day')
      .format(),
    endDate: moment()
      .add(1, 'day')
      .startOf('day')
      .format(),
  },
  {
    label: I18n.t('DASHBOARD.CHART_SELECT_OPTIONS.PAST_MONTH'),
    value: moment()
      .subtract(1, 'month')
      .startOf('month')
      .format(),
    endDate: moment()
      .startOf('month')
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
