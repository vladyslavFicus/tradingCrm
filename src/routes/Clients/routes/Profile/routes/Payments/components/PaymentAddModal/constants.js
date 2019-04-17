import { tradingTypes, tradingTypesLabelsWithColor } from 'constants/payment';

const TRANSFER = 'TRANSFER';

export const paymentMethods = {
  ...Object.keys(tradingTypes)
    .filter(i => [tradingTypes.TRANSFER_IN, tradingTypes.TRANSFER_OUT].indexOf(i) === -1)
    .reduce((acc, curr) => ({ ...acc, [curr]: curr }), {}),
  TRANSFER,
};

export const paymentMethodsLabels = {
  ...Object
    .entries(tradingTypesLabelsWithColor)
    .reduce((acc, [key, { label }]) => ({
      ...acc,
      [key]: label,
    }), {}),
  [TRANSFER]: 'COMMON.PAYMENT_TYPE.TRANSFER',
};
