import moment from 'moment';

export const initialQueryParams = (paymentType, paymentStatus, dateFrom) => ({
  dateFrom,
  dateTo: moment()
    .add(2, 'day')
    .startOf('day')
    .format(),
  paymentType,
  paymentStatus,
  detalization: 'PER_DAYS',
});
