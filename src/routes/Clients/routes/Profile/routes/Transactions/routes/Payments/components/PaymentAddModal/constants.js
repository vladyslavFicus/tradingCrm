import { types } from '../../../../../../../../../../constants/payment';

export const paymentTypes = {
  ...types,
  Transfer: 'Transfer',
};

export const paymentAccounts = [{
  label: 'System',
  value: 'SYSTEM',
}, {
  label: 'Credit Card',
  value: 'CREDIT_CARD',
}, {
  label: 'Wire',
  value: 'WIRE',
}, {
  label: 'External',
  value: 'EXTERNAL',
}, {
  label: 'Migration',
  value: 'MIGRATION',
}, {
  label: 'Internal Transfer',
  value: 'INTERNAL_TRANSFER',
}];
