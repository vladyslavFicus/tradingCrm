import keyMirror from 'keymirror';

const statuses = keyMirror({
  PENDING: null,
  REFUSED: null,
  FAILED: null,
  COMPLETED: null,
});

const methods = keyMirror({
  PAYPAL: null,
  CREDIT_CARD: null,
});

const types = keyMirror({
  Deposit: null,
  Withdraw: null,
});

const statusesLabels = {
  [statuses.PENDING]: 'Pending',
  [statuses.REFUSED]: 'Refused',
  [statuses.FAILED]: 'Failed',
  [statuses.COMPLETED]: 'Completed',
};

const methodsLabels = {
  [methods.PAYPAL]: 'Paypal',
  [methods.CREDIT_CARD]: 'Adyen',
};

const typesLabels = {
  [types.Deposit]: 'Deposit',
  [types.Withdraw]: 'Withdraw',
};

const typesProps = {
  [types.Deposit]: {
    className: 'text-uppercase color-primary',
  },
  [types.Withdraw]: {
    className: 'text-uppercase color-danger',
  },
};

const statusesColor = {
  [statuses.PENDING]: 'color-info',
  [statuses.REFUSED]: 'color-warning',
  [statuses.FAILED]: 'color-danger',
  [statuses.COMPLETED]: 'color-success',
};

export {
  statuses,
  statusesLabels,
  methods,
  methodsLabels,
  types,
  typesLabels,
  typesProps,
  statusesColor,
};
