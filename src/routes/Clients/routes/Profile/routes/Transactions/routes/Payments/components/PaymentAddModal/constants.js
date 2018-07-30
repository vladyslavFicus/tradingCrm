import { types } from '../../../../../../../../../../constants/payment';

export const paymentTypes = {
  ...types,
  Transfer: 'Transfer',
};

export const paymentAccounts = ['System', 'Credit Card', 'Wire', 'External', 'Migration', 'Internal Transfer'];
