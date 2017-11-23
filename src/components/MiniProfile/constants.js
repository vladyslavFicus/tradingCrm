import { statuses as operatorStatuses } from '../../constants/operators';
import { statuses as userStatuses } from '../../constants/user';
import { statuses as paymentStatuses, types as paymentTypes } from '../../constants/payment';

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

const paymentStatusNames = {
  [paymentStatuses.COMPLETED]: 'completed',
  [paymentStatuses.PENDING]: 'pending',
  [paymentStatuses.REFUSED]: 'refused',
  [paymentStatuses.CHARGEBACK]: 'chargeback',
  [paymentStatuses.FAILED]: 'failed',
};

const paymentTypesNames = {
  [paymentTypes.Deposit]: 'deposit',
  [paymentTypes.Withdraw]: 'withdraw',
  [paymentTypes.Confiscate]: 'confiscate',
};

export {
  operatorStatusNames,
  userStatusNames,
  paymentStatusNames,
  paymentTypesNames,
};
