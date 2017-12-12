import moment from 'moment';

const today = moment();

const presets = [{
  text: 'Previous week',
  start: moment().subtract(1, 'weeks').startOf('isoWeek'),
  end: moment().subtract(1, 'weeks').endOf('isoWeek'),
},
{
  text: 'This week',
  start: moment().startOf('isoWeek'),
  end: moment().endOf('isoWeek'),
},
{
  text: 'Previous month',
  start: moment().subtract(1, 'months').startOf('month'),
  end: moment().subtract(1, 'months').endOf('month'),
},
{
  text: 'This month',
  start: moment().startOf('month'),
  end: moment().endOf('month'),
},
{
  text: 'Last 7 days',
  start: moment().subtract(7, 'days'),
  end: today,
},
{
  text: 'Last 14 days',
  start: moment().subtract(14, 'days'),
  end: today,
},
{
  text: 'This year',
  start: moment().startOf('year'),
  end: moment().endOf('year'),
},
];

export {
  presets,
};
