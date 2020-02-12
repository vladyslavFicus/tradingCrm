import moment from 'moment';

export const PRESETS = [{
  title: 'DATE_PICKER.PERIOD_RESETS.PREVIOUS_WEEK',
  start: moment().subtract(1, 'weeks').startOf('isoWeek'),
  end: moment().subtract(1, 'weeks').endOf('isoWeek'),
},
{
  title: 'DATE_PICKER.PERIOD_RESETS.THIS_WEEK',
  start: moment().startOf('isoWeek'),
  end: moment().endOf('isoWeek'),
},
{
  title: 'DATE_PICKER.PERIOD_RESETS.PREVIOUS_MONTH',
  start: moment().subtract(1, 'months').startOf('month'),
  end: moment().subtract(1, 'months').endOf('month'),
},
{
  title: 'DATE_PICKER.PERIOD_RESETS.THIS_MONTH',
  start: moment().startOf('month'),
  end: moment().endOf('month'),
},
{
  title: 'DATE_PICKER.PERIOD_RESETS.LAST_7_DAYS',
  start: moment().subtract(7, 'days'),
  end: moment(),
},
{
  title: 'DATE_PICKER.PERIOD_RESETS.LAST_14_DAYS',
  start: moment().subtract(14, 'days'),
  end: moment(),
},
{
  title: 'DATE_PICKER.PERIOD_RESETS.THIS_YEAR',
  start: moment().startOf('year'),
  end: moment().endOf('year'),
},
];
