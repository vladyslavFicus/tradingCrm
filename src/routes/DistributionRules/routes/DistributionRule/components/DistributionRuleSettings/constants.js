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

export const executionPeriodInHours = [
  {
    label: '3 hours',
    value: 3,
  },
  {
    label: '6 hours',
    value: 6,
  },
  {
    label: '12 hours',
    value: 12,
  },
  {
    label: '18 hours',
    value: 18,
  },
  {
    label: '1 Day',
    value: 24,
  },
  {
    label: '2 Day ',
    value: 48,
  },
  {
    label: '3 Day ',
    value: 72,
  },
  {
    label: '4 Day ',
    value: 96,
  },
  {
    label: '5 Day ',
    value: 120,
  },
  {
    label: 'Last week',
    value: 168,
  },
  {
    label: 'Last 2 weeks',
    value: 336,
  },
];

export const registrationPeriodInHours = [
  {
    label: 'Last 2 hours',
    value: 2,
  },
  {
    label: 'Last 6 hours',
    value: 6,
  },
  {
    label: 'Last 12 hours',
    value: 12,
  },
  {
    label: 'Last day',
    value: 24,
  },
  {
    label: 'Last 3 days',
    value: 72,
  },
  {
    label: 'Last week',
    value: 168,
  },
  {
    label: 'Last 2 weeks',
    value: 336,
  },
];

export const executionType = [
  {
    label: I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS.EXECUTION_TYPE.AUTO'),
    value: 'AUTO',
  },
  {
    label: I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS.EXECUTION_TYPE.MANUAL'),
    value: 'MANUAL',
  },
];
