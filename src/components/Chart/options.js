/* eslint-disable newline-per-chained-call */
import moment from 'moment';

export default [{
  label: 'Today',
  value: moment().startOf('day').format(),
  endDate: moment().format(),
}, {
  label: 'Yesterday',
  value: moment().subtract(1, 'day').startOf('day').format(),
  endDate: moment().subtract(1, 'day').endOf('day').format(),
}, {
  label: 'Last 7 days',
  value: moment().subtract(6, 'days').startOf('day').format(),
  endDate: moment().add(1, 'day').startOf('day').format(),
}, {
  label: 'Past week',
  value: moment().subtract(1, 'week').startOf('week').format(),
  endDate: moment().startOf('week').format(),
}];
