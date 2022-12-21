import I18n from 'i18n-js';
import { LabelValue } from 'types';

const paymentAccounts: Array<LabelValue> = [
  {
    label: I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.SYSTEM'),
    value: 'SYSTEM',
  },
  {
    label: I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.CREDIT_CARD'),
    value: 'CREDIT_CARD',
  },
  {
    label: I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.WIRE'),
    value: 'WIRE',
  },
  {
    label: I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.EXTERNAL'),
    value: 'EXTERNAL',
  },
  {
    label: I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.MIGRATION'),
    value: 'MIGRATION',
  },
  {
    label: I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.INTERNAL_TRANSFER'),
    value: 'INTERNAL_TRANSFER',
  },
  {
    label: I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.CASHIER'),
    value: 'CASHIER',
  },
];

export default paymentAccounts;
