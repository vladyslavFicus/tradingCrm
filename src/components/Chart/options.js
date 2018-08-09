/* eslint-disable newline-per-chained-call */
import moment from 'moment';
import { I18n } from 'react-redux-i18n';

export default [{
  label: I18n.t('DASHBOARD.CHART_SELECT_OPTIONS.TODAY'),
  value: moment().startOf('day').format(),
  endDate: moment().format(),
}, {
  label: I18n.t('DASHBOARD.CHART_SELECT_OPTIONS.YESTERDAY'),
  value: moment().subtract(1, 'day').startOf('day').format(),
  endDate: moment().subtract(1, 'day').endOf('day').format(),
}, {
  label: I18n.t('DASHBOARD.CHART_SELECT_OPTIONS.LAST_7_DAYS'),
  value: moment().subtract(6, 'days').startOf('day').format(),
  endDate: moment().add(1, 'day').startOf('day').format(),
}, {
  label: I18n.t('DASHBOARD.CHART_SELECT_OPTIONS.PAST_WEEK'),
  value: moment().subtract(1, 'week').startOf('week').format(),
  endDate: moment().startOf('week').format(),
}];
