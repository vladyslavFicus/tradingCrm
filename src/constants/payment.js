import keyMirror from 'keymirror';
import _ from 'lodash';
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

const paymentActions = {
  REJECT: 'refuse',
  CHARGEBACK: 'chargeback',
  APPROVE: 'approve',
};

const types = keyMirror({
  Deposit: null,
  Withdraw: null,
  Confiscate: null,
});

const manualTypesLabels = {
  [types.Deposit]: 'Manual deposit',
  [types.Withdraw]: 'Manual withdraw',
  [types.Confiscate]: 'Confiscate',
};

const statusesLabels = {
  [statuses.APPROVED.toLowerCase()]: _.startCase('Approved'),
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
  [types.Deposit]: 'Deposit',
  [types.Withdraw]: 'Withdraw',
  [types.Confiscate]: 'Confiscate',
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
};
