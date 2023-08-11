import { Constants } from '@crm/common';

const operatorStatusNames = {
  [Constants.Operator.statuses.INACTIVE]: 'inactive',
  [Constants.Operator.statuses.ACTIVE]: 'active',
  [Constants.Operator.statuses.CLOSED]: 'closed',
};

const userStatusNames = {
  [Constants.User.statuses.NOT_VERIFIED]: 'not verified',
  [Constants.User.statuses.VERIFIED]: 'verified',
  [Constants.User.statuses.BLOCKED]: 'blocked',

  // Used only for Mini prifile
  DORMANT: 'dormant',
  SUSPENDED: 'suspended',
  COOLOFF: 'cooloff',
};

// Used only in Transaction Mini Profile, which is unused now
const paymentStatusNames = {
  [Constants.Payment.statuses.COMPLETED]: 'completed',
  [Constants.Payment.statuses.PENDING]: 'pending',
  [Constants.Payment.statuses.FAILED]: 'failed',

  // Used only for Mini prifile
  REFUSED: 'refused',
};

export {
  operatorStatusNames,
  userStatusNames,
  paymentStatusNames,
};
