import { statuses as operatorStatuses } from '../../constants/operators';
import { statuses as userStatuses } from '../../constants/user';
import { statuses as paymentStatuses, types as paymentTypes } from '../../constants/payment';
import { statuses as campaignStatuses } from '../../constants/bonus-campaigns';

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

const campaignStatusClassNames = {
  [campaignStatuses.DRAFT]: 'draft',
  [campaignStatuses.PENDING]: 'pending',
  [campaignStatuses.ACTIVE]: 'active',
  [campaignStatuses.FINISHED]: 'finished',
  [campaignStatuses.CANCELED]: 'canceled',
};

export {
  operatorStatusNames,
  userStatusNames,
  paymentStatusNames,
  paymentTypesNames,
  campaignStatusClassNames,
};
