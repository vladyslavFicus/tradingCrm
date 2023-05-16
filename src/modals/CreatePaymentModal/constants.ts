import I18n from 'i18n-js';
import { PaymentTypeDetails, tradingTypes, tradingTypesLabels } from 'constants/payment';
import permissions from 'config/permissions';

const TRANSFER = 'TRANSFER';

export const attributeLabels: Record<string, string> = {
  paymentType: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.TYPE'),
  amount: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.AMOUNT'),
  paymentMethod: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.PAYMENT_METHOD'),
  paymentSystem: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.PAYMENT_SYSTEM'),
  paymentSystemName: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.PAYMENT_SYSTEM_NAME'),
  externalReference: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.EXTERNAL_REF'),
  expirationDate: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.EXPIRATION_DATE'),
  fromAcc: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.FROM_ACC'),
  toAcc: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.TO_ACC'),
};

export const paymentTypes: Record<string, PaymentTypeDetails> = {
  ...Object.keys(tradingTypes)
    .filter(
      name => ([
        tradingTypes.TRANSFER_IN,
        tradingTypes.TRANSFER_OUT,
        tradingTypes.INACTIVITY_FEE,
        tradingTypes.INTEREST_RATE,
      ].indexOf(name as tradingTypes) === -1),
    )
    .reduce(
      (acc, curr) => ({ ...acc, [curr]: { name: curr, permission: permissions.PAYMENT[curr] } }),
      {},
    ),
  [TRANSFER]: { name: TRANSFER, permission: permissions.PAYMENT.TRANSFER },
};

export const paymentTypesLabels: Record<string, string> = {
  ...tradingTypesLabels,
  [TRANSFER]: 'COMMON.PAYMENT_TYPE.TRANSFER',
};
