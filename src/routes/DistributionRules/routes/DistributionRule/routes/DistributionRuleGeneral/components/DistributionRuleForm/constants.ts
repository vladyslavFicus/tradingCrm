import moment, { Moment } from 'moment';

export const MAX_MIGRATED_CLIENTS = 10000;

export const periodInHours: Array<{ label: string, value: number }> = [
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.REGISTRATION_TIME.LAST_TWO_HOURS',
    value: 2,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.REGISTRATION_TIME.LAST_SIX_HOURS',
    value: 6,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.REGISTRATION_TIME.LAST_TWELVE_HOURS',
    value: 12,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.REGISTRATION_TIME.LAST_TWENTYFOUR_HOURS',
    value: 24,
  },
];

export const periodInDays: Array<{ label: string, value: { from: Moment, to: Moment } }> = [
  {
    label: 'DATE_PICKER.PERIOD_RESETS.LAST_7_DAYS',
    value: {
      from: moment().subtract(7, 'days'),
      to: moment(),
    },
  },
  {
    label: 'DATE_PICKER.PERIOD_RESETS.LAST_14_DAYS',
    value: {
      from: moment().subtract(14, 'days'),
      to: moment(),
    },
  },
];

export const executionTypes: Array<{ label: string, value: string }> = [
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.EXECUTION_TYPE.AUTO',
    value: 'AUTO',
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.EXECUTION_TYPE.MANUAL',
    value: 'MANUAL',
  },
];

export const baseUnits: Record<string, string> = {
  AMOUNT: 'CLIENTS_DISTRIBUTION.RULE.BASE_UNITS.AMOUNT',
  PERCENTAGE: 'CLIENTS_DISTRIBUTION.RULE.BASE_UNITS.PERCENTAGE',
};

export const sortTypes: Record<string, string> = {
  FIFO: 'CLIENTS_DISTRIBUTION.RULE.SORT_METHOD.FIFO',
  LIFO: 'CLIENTS_DISTRIBUTION.RULE.SORT_METHOD.LIFO',
  RANDOM: 'CLIENTS_DISTRIBUTION.RULE.SORT_METHOD.RANDOM',
};
