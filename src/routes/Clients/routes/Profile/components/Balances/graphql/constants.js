import moment from 'moment';

export const initialQueryParams = (paymentType, paymentStatus, dateFrom) => ({
  dateFrom: moment(dateFrom).utc().format(),
  dateTo: moment()
    .utc()
    .add(2, 'day')
    .startOf('day')
    .format(),
  paymentType,
  paymentStatus,
  detalization: 'PER_DAYS',
  additionalStatistics: [],
});
