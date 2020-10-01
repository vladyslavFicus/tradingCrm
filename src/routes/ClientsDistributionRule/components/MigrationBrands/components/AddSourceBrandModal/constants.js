import { brandsConfig } from 'constants/brands';

export const brands = Object.keys(brandsConfig).map(value => ({
  value,
  label: brandsConfig[value].name,
}));

export const units = [
  {
    value: '',
    label: 'clients',
  },
  {
    value: 'percent',
    label: '%',
  },
];

export const sortMethods = [
  {
    value: 'FIFO',
    label: 'FIFO',
  },
  {
    value: 'LIFO',
    label: 'LIFO',
  },
  {
    value: 'RANDOM',
    label: 'Random',
  },
];
