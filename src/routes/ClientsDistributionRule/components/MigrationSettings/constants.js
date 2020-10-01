import I18n from 'i18n-js';
import { salesStatuses } from 'constants/salesStatuses';
import countryList from 'utils/countryList';

export const salesStatus = Object.keys(salesStatuses).map(value => ({
  value,
  label: I18n.t(salesStatuses[value]),
}));

export const migrationStatus = salesStatus;

export const countries = Object.keys(countryList).map(value => ({
  value,
  label: countryList[value],
}));

export const executionTime = [
  {
    label: '3 hours',
    value: '1',
  },
  {
    label: '6 hours',
    value: '2',
  },
  {
    label: '12 hours',
    value: '3',
  },
  {
    label: '18 hours',
    value: '4',
  },
  {
    label: '1 Day',
    value: '5',
  },
  {
    label: '2 Day ',
    value: '6',
  },
  {
    label: '3 Day ',
    value: '7',
  },
  {
    label: '4 Day ',
    value: '8',
  },
  {
    label: '5 Day ',
    value: '9',
  },
  {
    label: 'Last week',
    value: '0',
  },
  {
    label: 'Last 2 weeks',
    value: '',
  },
];

export const registrationDate = [
  {
    label: 'Last 6 hours',
    value: '1',
  },
  {
    label: 'Last 12 hours',
    value: '2',
  },
  {
    label: 'Last day',
    value: '3',
  },
  {
    label: 'Last 3 days',
    value: '4',
  },
  {
    label: 'Last week',
    value: '5',
  },
  {
    label: 'Last 2 weeks',
    value: '6',
  },
];

export const executionType = [
  {
    label: 'Manual',
    value: 'MANUAL',
  },
  {
    label: 'Daily',
    value: 'DAILY',
  },
];
