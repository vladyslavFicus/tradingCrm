import keyMirror from 'keymirror';
import permissions from '../config/permissions';
import Permissions from '../utils/permissions';

const actions = keyMirror({
  VERIFY: null,
  REFUSE: null,
});
const actionsColorNames = {
  [actions.VERIFY]: 'color-success',
  [actions.REFUSE]: 'color-red',
};

const categories = keyMirror({
  PAYMENT_ACCOUNT: null,
  KYC_PERSONAL: null,
  KYC_ADDRESS: null,
  OTHER: null,
});

const categoriesLabels = {
  [categories.PAYMENT_ACCOUNT]: 'KYC - Payment account',
  [categories.KYC_PERSONAL]: 'KYC - Personal',
  [categories.KYC_ADDRESS]: 'KYC - Address',
  [categories.OTHER]: 'Other',
};

const statuses = keyMirror({
  PENDING: null,
  VERIFIED: null,
  REFUSED: null,
});
const statusActions = {
  [statuses.PENDING]: [
    {
      action: actions.VERIFY,
      label: 'Verify',
      permissions: new Permissions(permissions.USER_PROFILE.VERIFY_FILE),
    },
    {
      action: actions.REFUSE,
      label: 'Refuse',
      permissions: new Permissions(permissions.USER_PROFILE.REFUSE_FILE),
    },
  ],
  [statuses.VERIFIED]: [
    {
      action: actions.REFUSE,
      label: 'Refuse',
      permissions: new Permissions(permissions.USER_PROFILE.REFUSE_FILE),
    },
  ],
  [statuses.REFUSED]: [
    {
      action: actions.VERIFY,
      label: 'Verify',
      permissions: new Permissions(permissions.USER_PROFILE.VERIFY_FILE),
    },
  ],
};
const statusesColorNames = {
  [statuses.PENDING]: 'color-default',
  [statuses.VERIFIED]: 'color-success',
  [statuses.REFUSED]: 'color-red',
};
const statusesLabels = {
  [statuses.PENDING]: 'Under review',
  [statuses.VERIFIED]: 'Verified',
  [statuses.REFUSED]: 'Refused',
};

export {
  actions,
  actionsColorNames,
  categories,
  categoriesLabels,
  statuses,
  statusActions,
  statusesColorNames,
  statusesLabels,
};
