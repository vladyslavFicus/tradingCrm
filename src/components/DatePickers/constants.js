import moment from 'moment';

export const DATE_USER_STRING_FORMAT = 'DD.MM.YYYY';
export const DATE_BASE_FORMAT = 'YYYY-MM-DD';
export const DATE_TIME_USER_STRING_FORMAT = 'DD.MM.YYYY HH:mm';
export const DATE_TIME_BASE_FORMAT = 'YYYY-MM-DDTHH:mm:ss[Z]';

// # Must be removed after backend change all data in filter-sets to DATE_TIME_BASE_FORMAT
export const DATE_TIME_OLD_BASE_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

export const defaultAdditionalOptions = () => ([
  {
    label: 'DATE_PICKER.PERIOD_RESETS.CURRENT_DAY',
    value: {
      from: moment().startOf('day'),
      to: moment().endOf('day'),
    },
  },
  {
    label: 'DATE_PICKER.PERIOD_RESETS.PREVIOUS_DAY',
    value: {
      from: moment().subtract(1, 'days').startOf('day'),
      to: moment().subtract(1, 'days').endOf('day'),
    },
  },
  {
    label: 'DATE_PICKER.PERIOD_RESETS.CURRENT_WEEK',
    value: {
      from: moment().startOf('isoWeek'),
      to: moment().endOf('isoWeek'),
    },
  },
  {
    label: 'DATE_PICKER.PERIOD_RESETS.PREVIOUS_WEEK',
    value: {
      from: moment().subtract(1, 'weeks').startOf('isoWeek'),
      to: moment().subtract(1, 'weeks').endOf('isoWeek'),
    },
  },
  {
    label: 'DATE_PICKER.PERIOD_RESETS.CURRENT_MONTH',
    value: {
      from: moment().startOf('month'),
      to: moment().endOf('month'),
    },
  },
  {
    label: 'DATE_PICKER.PERIOD_RESETS.PREVIOUS_MONTH',
    value: {
      from: moment().subtract(1, 'months').startOf('month'),
      to: moment().subtract(1, 'months').endOf('month'),
    },
  },
  {
    label: 'DATE_PICKER.PERIOD_RESETS.CURRENT_YEAR',
    value: {
      from: moment().startOf('year'),
      to: moment().endOf('year'),
    },
  },
  {
    label: 'DATE_PICKER.PERIOD_RESETS.PREVIOUS_YEAR',
    value: {
      from: moment().subtract(1, 'years').startOf('year'),
      to: moment().subtract(1, 'years').endOf('year'),
    },
  },
]);
