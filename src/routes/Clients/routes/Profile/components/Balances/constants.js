import moment from 'moment';

export const formName = 'balanceForm';

export const selectItems = [{
  label: 'CLIENT_PROFILE.CLIENT.BALANCES.PERIOD_PRESETS.LAST_7_DAYS',
  value: moment()
    .subtract(6, 'days')
    .startOf('day')
    .format(),
}, {
  label: 'CLIENT_PROFILE.CLIENT.BALANCES.PERIOD_PRESETS.LAST_MONTH',
  value: moment()
    .subtract(1, 'month')
    .add(1, 'days')
    .startOf('day')
    .format(),
}, {
  label: 'CLIENT_PROFILE.CLIENT.BALANCES.PERIOD_PRESETS.LAST_3_MONTHS',
  value: moment()
    .subtract(3, 'month')
    .add(1, 'days')
    .startOf('day')
    .format(),
}];

export const initialQueryParams = (paymentType, paymentStatus) => ({
  dateFrom: moment()
    .subtract(6, 'days')
    .startOf('day')
    .format(),
  dateTo: moment()
    .add(1, 'day')
    .startOf('day')
    .format(),
  paymentType,
  paymentStatus,
  detalization: 'PER_DAYS',
});

export const moneyObj = { totalAmount: 0, totalCount: 0 };
