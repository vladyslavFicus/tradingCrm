import moment from 'moment';

export const PRESETS = [
  {
    title: 'DATE_PICKER.PERIOD_RESETS.TODAY',
    startDate: moment(),
    endDate: moment(),
  },
  {
    title: 'DATE_PICKER.PERIOD_RESETS.LAST_7_DAYS',
    startDate: moment().subtract(7, 'days'),
    endDate: moment(),
  },
  {
    title: 'DATE_PICKER.PERIOD_RESETS.LAST_14_DAYS',
    startDate: moment().subtract(14, 'days'),
    endDate: moment(),
  },
  {
    title: 'DATE_PICKER.PERIOD_RESETS.THIS_WEEK',
    startDate: moment().startOf('isoWeek'),
    endDate: moment().endOf('isoWeek'),
  },
  {
    title: 'DATE_PICKER.PERIOD_RESETS.PREVIOUS_WEEK',
    startDate: moment().subtract(1, 'weeks').startOf('isoWeek'),
    endDate: moment().subtract(1, 'weeks').endOf('isoWeek'),
  },
  {
    title: 'DATE_PICKER.PERIOD_RESETS.THIS_MONTH',
    startDate: moment().startOf('month'),
    endDate: moment().endOf('month'),
  },
  {
    title: 'DATE_PICKER.PERIOD_RESETS.PREVIOUS_MONTH',
    startDate: moment().subtract(1, 'months').startOf('month'),
    endDate: moment().subtract(1, 'months').endOf('month'),
  },
  {
    title: 'DATE_PICKER.PERIOD_RESETS.THIS_YEAR',
    startDate: moment().startOf('year'),
    endDate: moment().endOf('year'),
  },
];
