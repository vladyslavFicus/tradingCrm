import keyMirror from 'keymirror';

const statuses = keyMirror({
  INACTIVE: null,
  IN_PROGRESS: null,
  WAGERING_COMPLETE: null,
  CONSUMED: null,
  CANCELLED: null,
  EXPIRED: null,
});
const types = keyMirror({
  FIRST_DEPOSIT: null,
  PROFILE_COMPLETED: null,
  Manual: null,
});
const assign = keyMirror({
  manual: null,
  campaign: null,
});

const statusesLabels = {
  [statuses.INACTIVE]: 'In active',
  [statuses.IN_PROGRESS]: 'Active',
  [statuses.WAGERING_COMPLETE]: 'Wagering complete',
  [statuses.CONSUMED]: 'Consumed',
  [statuses.CANCELLED]: 'Cancelled',
  [statuses.EXPIRED]: 'Expired',
};
const typesLabels = {
  [types.FIRST_DEPOSIT]: 'Welcome',
  [types.PROFILE_COMPLETED]: 'Profile completed',
  [types.Manual]: 'No deposit',
};
const assignLabels = {
  [assign.manual]: 'Operator',
  [assign.campaign]: 'Campaign',
};

const statusesProps = {
  [statuses.INACTIVE]: {
    className: 'color-default font-weight-600 text-uppercase',
  },
  [statuses.IN_PROGRESS]: {
    className: 'color-success font-weight-600 text-uppercase',
  },
  [statuses.WAGERING_COMPLETE]: {
    className: 'color-warning font-weight-600 text-uppercase',
  },
  [statuses.CONSUMED]: {
    className: 'color-primary font-weight-600 text-uppercase',
  },
  [statuses.CANCELLED]: {
    className: 'color-danger font-weight-600 text-uppercase',
  },
  [statuses.EXPIRED]: {
    className: 'color-primary font-weight-600 text-uppercase',
  },
};
const typesProps = {
  [types.FirstDeposit]: {
    className: 'color-primary font-weight-600 text-uppercase',
  },
  [types.Manual]: {
    className: 'color-success font-weight-600 text-uppercase',
  },
};

export {
  statuses,
  statusesLabels,
  statusesProps,
  types,
  typesLabels,
  typesProps,
  assign,
  assignLabels,
};
