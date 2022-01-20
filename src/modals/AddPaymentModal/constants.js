import I18n from 'i18n-js';
import { tradingTypes, tradingTypesLabelsWithColor } from 'constants/payment';
import permissions from 'config/permissions';

const TRANSFER = 'TRANSFER';

export const attributeLabels = {
  paymentType: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.TYPE'),
  amount: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.AMOUNT'),
  paymentMethod: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.PAYMENT_METHOD'),
  paymentSystem: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.PAYMENT_SYSTEM'),
  externalReference: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.EXTERNAL_REF'),
  expirationDate: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.EXPIRATION_DATE'),
  fromAcc: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.FROM_ACC'),
  toAcc: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.TO_ACC'),
};

export const paymentTypes = {
  ...Object.keys(tradingTypes)
    .filter(
      name => ([
        tradingTypes.TRANSFER_IN,
        tradingTypes.TRANSFER_OUT,
        tradingTypes.INACTIVITY_FEE,
        tradingTypes.INTEREST_RATE,
      ].indexOf(name) === -1),
    )
    .reduce(
      (acc, curr) => ({ ...acc, [curr]: { name: curr, permission: permissions.PAYMENT[curr] } }),
      {},
    ),
  [TRANSFER]: { name: TRANSFER, permission: permissions.PAYMENT.TRANSFER },
};

export const paymentTypesLabels = {
  ...tradingTypesLabelsWithColor,
  [TRANSFER]: { label: 'COMMON.PAYMENT_TYPE.TRANSFER' },
};
