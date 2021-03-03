import I18n from 'i18n-js';
import moment from 'moment';
import { salesStatuses as originalSalesStatuses } from 'constants/salesStatuses';
import countryList from 'utils/countryList';

export const salesStatuses = Object.keys(originalSalesStatuses).map(value => ({
  value,
  label: I18n.t(originalSalesStatuses[value]),
}));

export const countries = Object.keys(countryList).map(value => ({
  value,
  label: countryList[value],
}));

export const periodInHours = [
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

export const periodInDays = [
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.REGISTRATION_TIME.3_DAYS_AGO',
    value: {
      from: moment().subtract(3, 'days').startOf('days'),
      to: moment().subtract(3, 'days').endOf('days'),
    },
  },
];

export const executionTypes = [
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.EXECUTION_TYPE.AUTO',
    value: 'AUTO',
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.EXECUTION_TYPE.MANUAL',
    value: 'MANUAL',
  },
];
