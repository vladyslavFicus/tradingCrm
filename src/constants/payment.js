import keyMirror from 'keymirror';
import I18n from '../utils/fake-i18n';

const statuses = keyMirror({
  REJECTED: null,
  PENDING: null,
  FAILED: null,
  COMPLETED: null,
});

const tradingStatuses = keyMirror({
  PAYMENT_PENDING: null,
  PAYMENT_FAILED: null,
  PAYMENT_REFUSED: null,
  PAYMENT_CHARGEBACK: null,
  PAYMENT_COMPLETED: null,
  TRANSACTION_FAILED: null,
  TRANSACTION_COMPLETED: null,
  MT4_FAILED: null,
  MT4_COMPLETED: null,
});

const statusMapper = {
  [statuses.COMPLETED]: [tradingStatuses.MT4_COMPLETED],
  [statuses.FAILED]: [
    tradingStatuses.MT4_FAILED,
    tradingStatuses.PAYMENT_FAILED,
    tradingStatuses.TRANSACTION_FAILED,
  ],
  [statuses.PENDING]: [
    tradingStatuses.PAYMENT_PENDING,
    tradingStatuses.PAYMENT_COMPLETED,
    tradingStatuses.TRANSACTION_COMPLETED,
    tradingStatuses.PAYMENT_FAILED,
    tradingStatuses.TRANSACTION_FAILED,
  ],
  [statuses.REJECTED]: [tradingStatuses.PAYMENT_REFUSED],
};

const methods = keyMirror({
  SKRILL: null,
  PAYPAL: null,
  CREDIT_CARD: null,
  B2CRYPTO: null,
  PAYRETAILERS: null,
  PAYTRIO: null,
  WIRECAPITAL: null,
  EFTPAY: null,
});

const aggregators = keyMirror({
  CASHIER: null,
  MANUAL: null,
  NASPAY: null,
});

const manualPaymentMethods = keyMirror({
  SYSTEM: null,
  CREDIT_CARD: null,
  WIRE: null,
  EXTERNAL: null,
  MIGRATION: null,
  INTERNAL_TRANSFER: null,
});

const methodStatuses = keyMirror({
  ACTIVE: null,
  INACTIVE: null,
});

const accountStatuses = keyMirror({
  ACTIVE: null,
  LOCKED: null,
});

const accountStatusLabels = {
  [accountStatuses.ACTIVE]: I18n.t('CONSTANTS.PAYMENT.PAYMENT_ACCOUNT.STATUS.ACTIVE'),
  [accountStatuses.LOCKED]: I18n.t('CONSTANTS.PAYMENT.PAYMENT_ACCOUNT.STATUS.LOCKED'),
};

const accountStatusColors = {
  [accountStatuses.ACTIVE]: 'color-success',
  [accountStatuses.LOCKED]: 'color-danger',
};

const methodStatusActions = {
  [methodStatuses.ACTIVE]: [
    {
      action: methodStatuses.INACTIVE,
      label: 'Deactivate',
    },
  ],
  [methodStatuses.INACTIVE]: [
    {
      action: methodStatuses.ACTIVE,
      label: 'Activate',
    },
  ],
};

const accountStatusActions = {
  [accountStatuses.ACTIVE]: [
    {
      action: accountStatuses.LOCKED,
      label: I18n.t('CONSTANTS.PAYMENT.PAYMENT_ACCOUNT.ACTION.LOCK'),
    },
  ],
  [accountStatuses.LOCKED]: [
    {
      action: accountStatuses.ACTIVE,
      label: I18n.t('CONSTANTS.PAYMENT.PAYMENT_ACCOUNT.ACTION.ACTIVATE'),
    },
  ],
};

const types = keyMirror({
  Deposit: null,
  Withdraw: null,
  // Confiscate: null,
  Transfer: null,
  CREDIT_IN: null,
  CREDIT_OUT: null,
});

const tradingTypes = keyMirror({
  DEPOSIT: null,
  WITHDRAW: null,
  CONFISCATE: null,
  TRANSFER_IN: null,
  TRANSFER_OUT: null,
  CREDIT_IN: null,
  CREDIT_OUT: null,
});

const tradingTypesLabelsWithColor = {
  [tradingTypes.DEPOSIT]: {
    label: 'COMMON.PAYMENT_TYPE.DEPOSIT',
    color: 'color-success',
  },
  [tradingTypes.WITHDRAW]: {
    label: 'COMMON.PAYMENT_TYPE.WITHDRAW',
    color: 'color-danger',
  },
  [tradingTypes.CONFISCATE]: {
    label: 'COMMON.PAYMENT_TYPE.CONFISCATE',
    color: 'color-danger',
  },
  [tradingTypes.TRANSFER_IN]: {
    label: 'COMMON.PAYMENT_TYPE.TRANSFER_IN',
    color: 'color-info',
  },
  [tradingTypes.TRANSFER_OUT]: {
    label: 'COMMON.PAYMENT_TYPE.TRANSFER_OUT',
    color: 'color-info',
  },
  [tradingTypes.CREDIT_IN]: {
    label: 'COMMON.PAYMENT_TYPE.CREDIT_IN',
    color: 'color-warning',
  },
  [tradingTypes.CREDIT_OUT]: {
    label: 'COMMON.PAYMENT_TYPE.CREDIT_OUT',
    color: 'color-warning',
  },
};

const customTypes = keyMirror({
  NORMAL: null,
  TIP: null,
  CASH_BACK: null,
});

const customTypesLabels = {
  [customTypes.TIP]: I18n.t('COMMON.PAYMENT.TYPE.TIP'),
  [customTypes.CASH_BACK]: I18n.t('COMMON.PAYMENT.TYPE.CASH_BACK'),
};

const customTypesProps = {
  [customTypes.TIP]: {
    className: 'text-uppercase font-weight-700 color-secondary',
  },
  [customTypes.CASH_BACK]: {
    className: 'text-uppercase font-weight-700 color-primary',
  },
};

const manualTypesLabels = {
  [types.Deposit]: 'Manual deposit',
  [types.Withdraw]: 'Manual withdraw',
  [types.Confiscate]: 'Confiscate',
};

const statusesLabels = {
  [statuses.PENDING]: 'COMMON.PAYMENT_STATUS.PENDING',
  [statuses.REJECTED]: 'COMMON.PAYMENT_STATUS.REJECTED',
  [statuses.FAILED]: 'COMMON.PAYMENT_STATUS.FAILED',
  [statuses.COMPLETED]: 'COMMON.PAYMENT_STATUS.COMPLETED',
};

const methodsLabels = {
  [methods.SKRILL]: I18n.t('CONSTANTS.PAYMENT.PAYMENT_METHODS.SKRILL'),
  [methods.PAYPAL]: I18n.t('CONSTANTS.PAYMENT.PAYMENT_METHODS.PAYPAL'),
  [methods.CREDIT_CARD]: I18n.t('CONSTANTS.PAYMENT.PAYMENT_METHODS.CREDIT_CARD'),
  [methods.B2CRYPTO]: I18n.t('CONSTANTS.PAYMENT.PAYMENT_METHODS.B2CRYPTO'),
  [methods.PAYRETAILERS]: I18n.t('CONSTANTS.PAYMENT.PAYMENT_METHODS.PAYRETAILERS'),
  [methods.WIRECAPITAL]: I18n.t('CONSTANTS.PAYMENT.PAYMENT_METHODS.WIRECAPITAL'),
  [methods.EFTPAY]: I18n.t('CONSTANTS.PAYMENT.PAYMENT_METHODS.EFTPAY'),
};

const aggregatorsLabels = {
  [aggregators.CASHIER]: 'CONSTANTS.PAYMENT.PAYMENT_AGGREGATORS.CASHIER',
  [aggregators.MANUAL]: 'CONSTANTS.PAYMENT.PAYMENT_AGGREGATORS.MANUAL',
  [aggregators.NASPAY]: 'CONSTANTS.PAYMENT.PAYMENT_AGGREGATORS.NASPAY',
};

const manualPaymentMethodsLabels = {
  [manualPaymentMethods.SYSTEM]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.SYSTEM',
  [manualPaymentMethods.CREDIT_CARD]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.CREDIT_CARD',
  [manualPaymentMethods.WIRE]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.WIRE',
  [manualPaymentMethods.EXTERNAL]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.EXTERNAL',
  [manualPaymentMethods.MIGRATION]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.MIGRATION',
  [manualPaymentMethods.INTERNAL_TRANSFER]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.INTERNAL_TRANSFER',
};

const methodsStatusesLabels = {
  [methodStatuses.ACTIVE]: 'Active',
  [methodStatuses.INACTIVE]: 'Inactive',
};

const typesLabels = {
  [types.Deposit]: I18n.t('COMMON.PAYMENT.TYPE.DEPOSIT'),
  [types.Withdraw]: I18n.t('COMMON.PAYMENT.TYPE.WITHDRAW'),
  [types.Confiscate]: I18n.t('COMMON.PAYMENT.TYPE.CONFISCATE'),
  [types.Transfer]: I18n.t('COMMON.PAYMENT.TYPE.TRANSFER'),
  [types.CREDIT_IN]: I18n.t('COMMON.PAYMENT.TYPE.CREDIT_IN'),
  [types.CREDIT_OUT]: I18n.t('COMMON.PAYMENT.TYPE.CREDIT_OUT'),
};

const typesProps = {
  [types.Deposit]: {
    className: 'text-uppercase font-weight-700 color-primary',
  },
  [types.Withdraw]: {
    className: 'text-uppercase font-weight-700 color-danger',
  },
  [types.Confiscate]: {
    className: 'text-uppercase font-weight-700 color-danger',
  },
};

const statusesColor = {
  [statuses.PENDING]: 'color-info',
  [statuses.REJECTED]: 'color-danger',
  [statuses.FAILED]: 'color-danger',
  [statuses.COMPLETED]: 'color-success',
};

const methodStatusesColor = {
  [methodStatuses.ACTIVE]: 'color-success',
  [methodStatuses.INACTIVE]: 'color-default',
};

const initiators = keyMirror({
  PLAYER: null,
  OPERATOR: null,
});

const initiatorsLabels = {
  [initiators.PLAYER]: 'Player',
  [initiators.OPERATOR]: 'Operator',
};

export {
  statuses,
  tradingStatuses,
  statusesLabels,
  statusMapper,
  methods,
  aggregators,
  manualPaymentMethods,
  methodStatuses,
  methodsStatusesLabels,
  methodsLabels,
  types,
  customTypes,
  customTypesLabels,
  customTypesProps,
  manualTypesLabels,
  aggregatorsLabels,
  manualPaymentMethodsLabels,
  typesLabels,
  typesProps,
  statusesColor,
  methodStatusesColor,
  methodStatusActions,
  initiators,
  initiatorsLabels,
  accountStatuses,
  accountStatusLabels,
  accountStatusColors,
  accountStatusActions,
  tradingTypes,
  tradingTypesLabelsWithColor,
};
