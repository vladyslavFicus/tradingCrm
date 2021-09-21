import keyMirror from 'keymirror';

const statuses = keyMirror({
  APPROVED: null,
  CANCELED: null,
  COMPLETED: null,
  FAILED: null,
  PENDING: null,
  REJECTED: null,
});

const tradingStatuses = keyMirror({
  PAYMENT_PENDING: null,
  PAYMENT_FAILED: null,
  PAYMENT_REFUSED: null,
  PAYMENT_CHARGEBACK: null,
  PAYMENT_COMPLETED: null,
  TRANSACTION_FAILED: null,
  TRANSACTION_COMPLETED: null,
  PAYMENT_CANCELED: null,
  PAYMENT_APPROVED: null,
});

const statusMapper = {
  [statuses.COMPLETED]: [
    tradingStatuses.PAYMENT_COMPLETED,
  ],
  [statuses.APPROVED]: [
    tradingStatuses.PAYMENT_APPROVED,
  ],
  [statuses.FAILED]: [
    tradingStatuses.PAYMENT_FAILED,
    tradingStatuses.TRANSACTION_FAILED,
  ],
  [statuses.PENDING]: [
    tradingStatuses.PAYMENT_PENDING,
  ],
  [statuses.REJECTED]: [tradingStatuses.PAYMENT_REFUSED],
  [statuses.CANCELED]: [tradingStatuses.PAYMENT_CANCELED],
};

const methods = keyMirror({
  CREDIT_CARD: null,
  PAYPAL: null,
  PAYTRIO: null,
  SKRILL: null,
  ENFINS: null,
  CASHIER: null,
  VOGUEPAY: null,
  CHARGEBACK: null,
  CRYPTOCURRENCY_EXTERNAL: null,
});

const aggregators = keyMirror({
  MANUAL: null,
  CASHIER: null,
  INTERNAL: null,
});

const manualPaymentMethods = keyMirror({
  BONUS: null,
  CHARGEBACK: null,
  CREDIT_CARD: null,
  ELECTRONIC: null,
  EXTERNAL: null,
  INTERNAL_TRANSFER: null,
  MIGRATION: null,
  PAYRETAILERS: null,
  RECALL: null,
  SYSTEM: null,
  WIRE: null,
  REFERRAL_BONUS: null,
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
  [accountStatuses.ACTIVE]: 'CONSTANTS.PAYMENT.PAYMENT_ACCOUNT.STATUS.ACTIVE',
  [accountStatuses.LOCKED]: 'CONSTANTS.PAYMENT.PAYMENT_ACCOUNT.STATUS.LOCKED',
};

const accountStatusColors = {
  [accountStatuses.ACTIVE]: 'color-success',
  [accountStatuses.LOCKED]: 'color-danger',
};

const methodStatusActions = {
  [methodStatuses.ACTIVE]: [
    {
      action: methodStatuses.INACTIVE,
      label: 'PAYMENT_METHODS.ACTIONS.DEACTIVATE',
    },
  ],
  [methodStatuses.INACTIVE]: [
    {
      action: methodStatuses.ACTIVE,
      label: 'PAYMENT_METHODS.ACTIONS.ACTIVE',
    },
  ],
};

const accountStatusActions = {
  [accountStatuses.ACTIVE]: [
    {
      action: accountStatuses.LOCKED,
      label: 'CONSTANTS.PAYMENT.PAYMENT_ACCOUNT.ACTION.LOCK',
    },
  ],
  [accountStatuses.LOCKED]: [
    {
      action: accountStatuses.ACTIVE,
      label: 'CONSTANTS.PAYMENT.PAYMENT_ACCOUNT.ACTION.ACTIVATE',
    },
  ],
};

const tradingTypes = keyMirror({
  CREDIT_IN: null,
  CREDIT_OUT: null,
  DEPOSIT: null,
  INACTIVITY_FEE: null,
  INTEREST_RATE: null,
  TRANSFER_IN: null,
  TRANSFER_OUT: null,
  WITHDRAW: null,
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
  [tradingTypes.INTEREST_RATE]: {
    label: 'COMMON.PAYMENT_TYPE.INTEREST_RATE',
    color: 'color-info',
  },
  DEMO_DEPOSIT: {
    label: 'COMMON.PAYMENT_TYPE.DEPOSIT',
    color: 'color-success',
  },
  // Special type for transaction with type FEE
  FEE: {
    label: 'COMMON.PAYMENT_TYPE.FEE',
    color: 'color-success',
  },
  [tradingTypes.INACTIVITY_FEE]: {
    label: 'COMMON.PAYMENT_TYPE.INACTIVITY_FEE',
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
  [customTypes.TIP]: 'COMMON.PAYMENT.TYPE.TIP',
  [customTypes.CASH_BACK]: 'COMMON.PAYMENT.TYPE.CASH_BACK',
};

const customTypesProps = {
  [customTypes.TIP]: {
    className: 'text-uppercase font-weight-700 color-secondary',
  },
  [customTypes.CASH_BACK]: {
    className: 'text-uppercase font-weight-700 color-primary',
  },
};

const statusesLabels = {
  [statuses.PENDING]: 'COMMON.PAYMENT_STATUS.PENDING',
  [statuses.APPROVED]: 'COMMON.PAYMENT_STATUS.APPROVED',
  [statuses.REJECTED]: 'COMMON.PAYMENT_STATUS.REJECTED',
  [statuses.CANCELED]: 'COMMON.PAYMENT_STATUS.CANCELED',
  [statuses.FAILED]: 'COMMON.PAYMENT_STATUS.FAILED',
  [statuses.COMPLETED]: 'COMMON.PAYMENT_STATUS.COMPLETED',
};

const methodsLabels = {
  [methods.SKRILL]: 'CONSTANTS.PAYMENT.PAYMENT_METHODS.SKRILL',
  [methods.PAYPAL]: 'CONSTANTS.PAYMENT.PAYMENT_METHODS.PAYPAL',
  [methods.CREDIT_CARD]: 'CONSTANTS.PAYMENT.PAYMENT_METHODS.CREDIT_CARD',
  [methods.PAYTRIO]: 'CONSTANTS.PAYMENT.PAYMENT_METHODS.PAYTRIO',
  [methods.CASHIER]: 'CONSTANTS.PAYMENT.PAYMENT_METHODS.CASHIER',
  [methods.CRYPTOCURRENCY_EXTERNAL]: 'CONSTANTS.PAYMENT.PAYMENT_METHODS.CRYPTOCURRENCY_EXTERNAL',
  [methods.ENFINS]: 'CONSTANTS.PAYMENT.PAYMENT_METHODS.ENFINS',
  [methods.VOGUEPAY]: 'CONSTANTS.PAYMENT.PAYMENT_METHODS.VOGUEPAY',
  [methods.B2CRYPTO]: 'CONSTANTS.PAYMENT.PAYMENT_METHODS.B2CRYPTO',
  [methods.PAYRETAILERS]: 'CONSTANTS.PAYMENT.PAYMENT_METHODS.PAYRETAILERS',
  [methods.WIRECAPITAL]: 'CONSTANTS.PAYMENT.PAYMENT_METHODS.WIRECAPITAL',
  [methods.EFTPAY]: 'CONSTANTS.PAYMENT.PAYMENT_METHODS.EFTPAY',
};

const aggregatorsLabels = {
  [aggregators.MANUAL]: 'CONSTANTS.PAYMENT.PAYMENT_AGGREGATORS.MANUAL',
  [aggregators.CASHIER]: 'CONSTANTS.PAYMENT.PAYMENT_AGGREGATORS.CASHIER',
  [aggregators.INTERNAL]: 'CONSTANTS.PAYMENT.PAYMENT_AGGREGATORS.INTERNAL',
};

const manualPaymentMethodsLabels = {
  [manualPaymentMethods.SYSTEM]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.SYSTEM',
  [manualPaymentMethods.CREDIT_CARD]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.CREDIT_CARD',
  [manualPaymentMethods.WIRE]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.WIRE',
  [manualPaymentMethods.EXTERNAL]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.EXTERNAL',
  [manualPaymentMethods.MIGRATION]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.MIGRATION',
  [manualPaymentMethods.INTERNAL_TRANSFER]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.INTERNAL_TRANSFER',
  [manualPaymentMethods.ELECTRONIC]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.ELECTRONIC',
  [manualPaymentMethods.BONUS]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.BONUS',
  [manualPaymentMethods.PAYRETAILERS]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.PAYRETAILERS',
  [manualPaymentMethods.RECALL]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.RECALL',
  [manualPaymentMethods.CHARGEBACK]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.CHARGEBACK',
  [manualPaymentMethods.REFERRAL_BONUS]: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.PAYMENT_ACCOUNTS.REFERRAL_BONUS',
};

const methodsStatusesLabels = {
  [methodStatuses.ACTIVE]: 'PAYMENT_METHODS.STATUSES.ACTIVE',
  [methodStatuses.INACTIVE]: 'PAYMENT_METHODS.STATUSES.INACTIVE',
};

const statusesColor = {
  [statuses.APPROVED]: 'color-info',
  [statuses.PENDING]: 'color-info',
  [statuses.REJECTED]: 'color-danger',
  [statuses.CANCELED]: 'color-danger',
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

const withdrawStatuses = keyMirror({
  CREATED: null,
  CANCELED: null,
  REJECTED: null,
  EXECUTED: null,
});

const withdrawStatusesLabels = {
  [withdrawStatuses.CREATED]: 'COMMON.WITHDRAWAL_STATUSES.CREATED',
  [withdrawStatuses.CANCELED]: 'COMMON.WITHDRAWAL_STATUSES.CANCELED',
  [withdrawStatuses.REJECTED]: 'COMMON.WITHDRAWAL_STATUSES.REJECTED',
  [withdrawStatuses.EXECUTED]: 'COMMON.WITHDRAWAL_STATUSES.EXECUTED',
};

const withdrawStatusesColors = {
  [withdrawStatuses.CREATED]: 'color-success',
  [withdrawStatuses.CANCELED]: 'color-error',
  [withdrawStatuses.REJECTED]: 'color-error',
  [withdrawStatuses.EXECUTED]: 'color-success',
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
  customTypes,
  customTypesLabels,
  customTypesProps,
  aggregatorsLabels,
  manualPaymentMethodsLabels,
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
  withdrawStatusesLabels,
  withdrawStatusesColors,
};
