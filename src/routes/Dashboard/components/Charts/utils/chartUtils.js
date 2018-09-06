import moment from 'moment';
import { I18n } from 'react-redux-i18n';

export const initialQueryParams = (fromName, toName) => ({
  [fromName]: moment()
    .subtract(6, 'days')
    .startOf('day')
    .format(),
  [toName]: moment()
    .add(1, 'day')
    .startOf('day')
    .format(),
});

export const getChartSelectOptions = () => [
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
