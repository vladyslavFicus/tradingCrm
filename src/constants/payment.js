import keyMirror from 'keymirror';
import I18n from '../utils/fake-i18n';

const statuses = keyMirror({
  APPROVED: null,
  PENDING: null,
  REFUSED: null,
  FAILED: null,
  COMPLETED: null,
  CHARGEBACK: null,
});

const methods = keyMirror({
  fakepal: null,
  qiwi: null,
  visa: null,
  card: null,
  mastercard: null,
  yamoney: null,
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

const chargebackReasons = {
  'PAYMENT.DEPOSIT_CHARGEBACK.REASONS.STOLEN_LOST_CC':
    I18n.t('PAYMENT.DEPOSIT_CHARGEBACK.REASONS.STOLEN_LOST_CC'),
  'PAYMENT.DEPOSIT_CHARGEBACK.REASONS.CUSTOMER_NOT_SATISFIED':
    I18n.t('PAYMENT.DEPOSIT_CHARGEBACK.REASONS.CUSTOMER_NOT_SATISFIED'),
};

const rejectReasons = {
  'PAYMENT.WITHDRAW_REJECT.REASONS.USING_DIFFERENT_PM':
    I18n.t('PAYMENT.WITHDRAW_REJECT.REASONS.USING_DIFFERENT_PM'),
  'PAYMENT.WITHDRAW_REJECT.REASONS.USING_3RD_PARTY_PM':
    I18n.t('PAYMENT.WITHDRAW_REJECT.REASONS.USING_3RD_PARTY_PM'),
  'PAYMENT.WITHDRAW_REJECT.REASONS.CUSTOMER_REQUEST':
    I18n.t('PAYMENT.WITHDRAW_REJECT.REASONS.CUSTOMER_REQUEST'),
};

const paymentActions = {
  REJECT: 'refuse',
  CHARGEBACK: 'chargeback',
  APPROVE: 'approve',
};

const types = keyMirror({
  Deposit: null,
  DEPOSIT_BY_PAYMENT_METHOD: null,
  WITHDRAW_BY_PAYMENT_METHOD: null,
  Withdraw: null,
  Confiscate: null,
});

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
  [types.WITHDRAW_BY_PAYMENT_METHOD]: 'Withdraw by payment method',
  [types.DEPOSIT_BY_PAYMENT_METHOD]: 'Deposit by payment method',
  [types.Withdraw]: 'Manual withdraw',
  [types.Confiscate]: 'Confiscate',
};

const statusesLabels = {
  [statuses.APPROVED]: 'Approved',
  [statuses.PENDING]: 'Pending',
  [statuses.REFUSED]: 'Refused',
  [statuses.FAILED]: 'Failed',
  [statuses.COMPLETED]: 'Completed',
  [statuses.CHARGEBACK]: 'Chargeback',
};

const methodsLabels = {
  [methods.fakepla]: I18n.t('CONSTANTS.PAYMENT.PAYMENT_METHODS.FAKEPAL'),
  [methods.qiwi]: I18n.t('CONSTANTS.PAYMENT.PAYMENT_METHODS.QIWI'),
  [methods.visa]: I18n.t('CONSTANTS.PAYMENT.PAYMENT_METHODS.VISA'),
  [methods.card]: I18n.t('CONSTANTS.PAYMENT.PAYMENT_METHODS.CARD'),
  [methods.mastercard]: I18n.t('CONSTANTS.PAYMENT.PAYMENT_METHODS.MASTERCARD'),
  [methods.yamoney]: I18n.t('CONSTANTS.PAYMENT.PAYMENT_METHODS.YANDEX_MONEY'),
};

const methodsStatusesLabels = {
  [methodStatuses.ACTIVE]: 'Active',
  [methodStatuses.INACTIVE]: 'Inactive',
};

const typesLabels = {
  [types.Deposit]: I18n.t('COMMON.PAYMENT.TYPE.DEPOSIT'),
  [types.Withdraw]: I18n.t('COMMON.PAYMENT.TYPE.WITHDRAW'),
  [types.Confiscate]: I18n.t('COMMON.PAYMENT.TYPE.CONFISCATE'),
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
  [statuses.APPROVED]: 'color-success',
  [statuses.PENDING]: 'color-info',
  [statuses.REFUSED]: 'color-warning',
  [statuses.FAILED]: 'color-danger',
  [statuses.COMPLETED]: 'color-success',
  [statuses.CHARGEBACK]: 'color-secondary',
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
  statusesLabels,
  methods,
  methodStatuses,
  methodsStatusesLabels,
  methodsLabels,
  types,
  customTypes,
  customTypesLabels,
  customTypesProps,
  manualTypesLabels,
  typesLabels,
  typesProps,
  statusesColor,
  methodStatusesColor,
  methodStatusActions,
  paymentActions,
  initiators,
  initiatorsLabels,
  accountStatuses,
  accountStatusLabels,
  accountStatusColors,
  accountStatusActions,
  chargebackReasons,
  rejectReasons,
};
