import keyMirror from 'keymirror';

const statuses = keyMirror({
  PENDING: null,
  REFUSED: null,
  FAILED: null,
  COMPLETED: null,
});

const statusesLabels = {
  [statuses.PENDING]: 'Pending',
  [statuses.REFUSED]: 'Refused',
  [statuses.FAILED]: 'Failed',
  [statuses.COMPLETED]: 'Completed',
};

const methods = keyMirror({
  paypal: null,
  creditCard: null,
});

const methodsLabels = {
  [methods.paypal]: 'Paypal',
  [methods.creditCard]: 'Adyen',
};

const types = keyMirror({
  Deposit: null,
  Withdraw: null,
});

const typesLabels = {
  [types.Deposit]: 'Deposit',
  [types.Withdraw]: 'Withdraw',
};

export {
  statuses,
  statusesLabels,
  methods,
  methodsLabels,
  types,
  typesLabels,
};
