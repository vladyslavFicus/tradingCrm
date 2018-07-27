import moment from 'moment';

const parseDateFieldNames = ['openTimeStart', 'openTimeEnd', 'closeTimeStart', 'closeTimeEnd'];

// INFO: convert date fields to Unix ms timestamp
export const getParsedToUnixDates = values => (
  Object
    .entries(values)
    .reduce((accum, [key, value]) => ({
      ...accum,
      [key]: parseDateFieldNames.indexOf(key) !== -1 && values[key] ? moment(value).format('x') : value,
    }), {})
);

export const getTypeColor = value => (
  value === 'OP_BALANCE' || value.includes('BUY')
    ? 'color-success'
    : 'color-danger'
);

export const currentDateInUnixMs = {
  openTimeStart: moment().startOf('day').format('x'),
  openTimeEnd: moment().endOf('day').format('x'),
};
