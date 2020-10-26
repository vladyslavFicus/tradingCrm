import I18n from 'i18n-js';
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

export const registrationPeriodInHours = [
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.REGISTRATION_TIME.LAST_N_HOURS',
    value: 2,
    i18nValue: 2,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.REGISTRATION_TIME.LAST_N_HOURS',
    value: 6,
    i18nValue: 6,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.REGISTRATION_TIME.LAST_N_HOURS',
    value: 12,
    i18nValue: 12,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.REGISTRATION_TIME.LAST_DAY',
    value: 24,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.REGISTRATION_TIME.LAST_N_DAYS',
    value: 72,
    i18nValue: 3,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.REGISTRATION_TIME.LAST_WEEK',
    value: 168,
  },
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.REGISTRATION_TIME.LAST_N_WEEKS',
    value: 336,
    i18nValue: 2,
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
