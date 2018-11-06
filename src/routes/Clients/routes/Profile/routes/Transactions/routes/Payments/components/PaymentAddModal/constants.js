import { I18n } from 'react-redux-i18n';
import { types } from '../../../../../../../../../../constants/payment';

export const paymentTypes = {
  ...types,
  Transfer: 'Transfer',
};

export const paymentAccounts = [{
  label: I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.SYSTEM'),
  value: 'SYSTEM',
}, {
  label: I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.CREDIT_CARD'),
  value: 'CREDIT_CARD',
}, {
  label: I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.WIRE'),
  value: 'WIRE',
}, {
  label: I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.EXTERNAL'),
  value: 'EXTERNAL',
}, {
  label: I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.MIGRATION'),
  value: 'MIGRATION',
}, {
  label: I18n.t('CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.INTERNAL_TRANSFER'),
  value: 'INTERNAL_TRANSFER',
}];
