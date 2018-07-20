import moment from 'moment';

export const selectItems = [{
  label: 'Last 7 days',
  value: moment().subtract(7, 'days').format(),
}, {
  label: 'Last month',
  value: moment().subtract(1, 'month').format(),
}, {
  label: 'Last 3 month',
  value: moment().subtract(3, 'month').format(),
}];

export const formName = 'balanceForm';

export const initialQueryParams = {
  limit: '9999',
  startDate: moment().subtract(7, 'days'),
  endDate: moment().format(),
};
