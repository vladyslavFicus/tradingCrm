import I18n from 'i18n-js';
import { tradingTypes, tradingTypesLabelsWithColor } from 'constants/payment';
import permissions from 'config/permissions';

const TRANSFER = 'TRANSFER';

export const attributeLabels = {
  paymentType: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.TYPE'),
  amount: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.AMOUNT'),
  paymentMethod: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.PAYMENT_METHOD'),
  externalReference: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.EXTERNAL_REF'),
  expirationDate: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.EXPIRATION_DATE'),
  fromMt4Acc: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.FROM_MT4'),
  toMt4Acc: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.TO_MT4'),
};

export const paymentMethods = {
  ...Object.keys(tradingTypes)
    .filter(name => ([tradingTypes.TRANSFER_IN, tradingTypes.TRANSFER_OUT].indexOf(name) === -1))
    .reduce(
      (acc, curr) => ({ ...acc, [curr]: { name: curr, permission: permissions.PAYMENT[curr] } }),
      {},
    ),
  [TRANSFER]: { name: TRANSFER, permission: permissions.PAYMENT.TRANSFER },
};

export const paymentMethodsLabels = {
  ...tradingTypesLabelsWithColor,
  [TRANSFER]: { label: 'COMMON.PAYMENT_TYPE.TRANSFER' },
};
