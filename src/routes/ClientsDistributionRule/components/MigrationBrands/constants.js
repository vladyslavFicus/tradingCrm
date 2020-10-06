import { brandsConfig } from 'constants/brands';

export const brands = Object.keys(brandsConfig).map(value => ({
  value,
  label: brandsConfig[value].name,
}));

export const baseUnits = [
  {
    value: 'AMOUNT',
    label: 'clients',
  },
  {
    value: 'PERCENTAGE',
    label: '%',
  },
];

export const sortTypes = [
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
