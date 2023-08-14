import I18n from 'i18n-js';
import { Config, Constants } from '@crm/common';

const TRANSFER = 'TRANSFER';

export const attributeLabels: Record<string, string> = {
  paymentType: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.TYPE'),
  amount: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.AMOUNT'),
  paymentMethod: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.PAYMENT_METHOD'),
  commissionCurrency: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.COMMISSION_CURRENCY'),
  paymentSystem: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.PAYMENT_SYSTEM'),
  paymentSystemName: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.PAYMENT_SYSTEM_NAME'),
  externalReference: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.EXTERNAL_REF'),
  expirationDate: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.EXPIRATION_DATE'),
  fromAcc: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.FROM_ACC'),
  toAcc: I18n.t('CLIENT_PROFILE.TRANSACTIONS.MODAL_CREATE.TO_ACC'),
};

export const paymentTypes: Record<string, Constants.Payment.PaymentTypeDetails> = {
  ...Object.keys(Constants.Payment.tradingTypes)
    .filter(
      name => ([
        Constants.Payment.tradingTypes.TRANSFER_IN,
        Constants.Payment.tradingTypes.TRANSFER_OUT,
        Constants.Payment.tradingTypes.INACTIVITY_FEE,
        Constants.Payment.tradingTypes.INTEREST_RATE,
      ].indexOf(name as Constants.Payment.tradingTypes) === -1),
    )
    .reduce(
      (acc, curr) => ({ ...acc, [curr]: { name: curr, permission: Config.permissions.PAYMENT[curr] } }),
      {},
    ),
  [TRANSFER]: { name: TRANSFER, permission: Config.permissions.PAYMENT.TRANSFER },
};

export const paymentTypesLabels: Record<string, string> = {
  ...Constants.Payment.tradingTypesLabels,
  [TRANSFER]: 'COMMON.PAYMENT_TYPE.TRANSFER',
};
