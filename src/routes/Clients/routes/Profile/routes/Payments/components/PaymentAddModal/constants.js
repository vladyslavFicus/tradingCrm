import { tradingTypes, tradingTypesLabelsWithColor } from 'constants/payment';
import permissions from 'config/permissions';

const TRANSFER = 'TRANSFER';

export const paymentMethods = {
  ...Object.keys(tradingTypes)
    .filter(name => ([tradingTypes.TRANSFER_IN, tradingTypes.TRANSFER_OUT].indexOf(name) === -1))
    .reduce(
      (acc, curr) => ({ ...acc, [curr]: { name: curr, permission: permissions.PAYMENT[curr] } }),
      {}
    ),
  [TRANSFER]: { name: TRANSFER, permission: permissions.PAYMENT.TRANSFER },
};

export const paymentMethodsLabels = {
  ...tradingTypesLabelsWithColor,
  [TRANSFER]: { label: 'COMMON.PAYMENT_TYPE.TRANSFER' },
};
