import moment from 'moment';

export const selectOptions = () => ([
  {
    label: 'CLIENT_PROFILE.CLIENT.BALANCES.PERIOD_PRESETS.ALL_TIME',
    value: '',
  },
  {
    label: 'CLIENT_PROFILE.CLIENT.BALANCES.PERIOD_PRESETS.LAST_7_DAYS',
    value: moment()
      .subtract(6, 'days')
      .startOf('day')
      .format(),
  },
  {
    label: 'CLIENT_PROFILE.CLIENT.BALANCES.PERIOD_PRESETS.LAST_MONTH',
    value: moment()
      .subtract(1, 'month')
      .add(1, 'days')
      .startOf('day')
      .format(),
  },
  {
    label: 'CLIENT_PROFILE.CLIENT.BALANCES.PERIOD_PRESETS.LAST_3_MONTHS',
    value: moment()
      .subtract(3, 'month')
      .add(1, 'days')
      .startOf('day')
      .format(),
  },
]);
