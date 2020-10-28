import I18n from 'i18n-js';

export const MAX_MIGRATED_CLIENTS = 10000;

export const baseUnits = {
  AMOUNT: I18n.t('CLIENTS_DISTRIBUTION.RULE.BASE_UNITS.AMOUNT'),
  PERCENTAGE: I18n.t('CLIENTS_DISTRIBUTION.RULE.BASE_UNITS.PERCENTAGE'),
};

export const sortTypes = {
  FIFO: I18n.t('CLIENTS_DISTRIBUTION.RULE.SORT_METHOD.FIFO'),
  LIFO: I18n.t('CLIENTS_DISTRIBUTION.RULE.SORT_METHOD.LIFO'),
  RANDOM: I18n.t('CLIENTS_DISTRIBUTION.RULE.SORT_METHOD.RANDOM'),
};

export const modalFieldsNames = {
  brand: 'CLIENTS_DISTRIBUTION.RULE.MODAL.BRAND',
  quantity: 'CLIENTS_DISTRIBUTION.RULE.MODAL.QUANTITY',
  quantityPercentage: 'CLIENTS_DISTRIBUTION.RULE.MODAL.QUANTITY_PERCENTAGE',
};
