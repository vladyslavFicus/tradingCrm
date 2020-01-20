import { statuses as operatorStatuses } from 'constants/operators';
import { statuses as userStatuses } from 'constants/user';
import { statuses as paymentStatuses } from 'constants/payment';

const operatorStatusNames = {
  [operatorStatuses.INACTIVE]: 'inactive',
  [operatorStatuses.ACTIVE]: 'active',
  [operatorStatuses.CLOSED]: 'closed',
};

const userStatusNames = {
  [userStatuses.INACTIVE]: 'inactive',
  [userStatuses.ACTIVE]: 'active',
  [userStatuses.BLOCKED]: 'blocked',
  [userStatuses.DORMANT]: 'dormant',
  [userStatuses.SUSPENDED]: 'suspended',
  [userStatuses.COOLOFF]: 'cooloff',
};

// used only in Transaction Mini Profile, which is unused now
const paymentStatusNames = {
  [paymentStatuses.COMPLETED]: 'completed',
  [paymentStatuses.PENDING]: 'pending',
  [paymentStatuses.REFUSED]: 'refused',
  [paymentStatuses.FAILED]: 'failed',
};

export {
  operatorStatusNames,
  userStatusNames,
  paymentStatusNames,
};
