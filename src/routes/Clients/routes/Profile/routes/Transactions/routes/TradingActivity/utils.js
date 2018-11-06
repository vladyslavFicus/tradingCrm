import moment from 'moment';

export const getTypeColor = value => (
  value === 'OP_BALANCE' || value.includes('BUY')
    ? 'color-success'
    : 'color-danger'
);

export const currentDateInUnixMs = {
  openTimeStart: moment().startOf('day').format('x'),
  openTimeEnd: moment().endOf('day').format('x'),
};
