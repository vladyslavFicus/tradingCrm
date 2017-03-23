import keyMirror from 'keymirror';

const actions = keyMirror({
  VERIFY: null,
  REFUSE: null,
});

const categories = keyMirror({
  KYC_PERSONAL: null,
  KYC_ADDRESS: null,
});

const categoriesLabels = {
  [categories.KYC_PERSONAL]: 'KYC - Personal',
  [categories.KYC_ADDRESS]: 'KYC - Address',
};

const statuses = keyMirror({
  UNDER_REVIEW: null,
  VERIFIED: null,
  REFUSED: null,
});
const statusActions = {
  [statuses.UNDER_REVIEW]: [
    {
      action: actions.VERIFY,
      label: 'Verify',
    },
    {
      action: actions.REFUSE,
      label: 'Refuse',
    },
  ],
};
const statusesColorNames = {
  [statuses.UNDER_REVIEW]: 'color-default',
  [statuses.VERIFIED]: 'color-success',
  [statuses.REFUSED]: 'color-danger',
};
const statusesLabels = {
  [statuses.UNDER_REVIEW]: 'Under review',
  [statuses.VERIFIED]: 'Verified',
  [statuses.REFUSED]: 'Refused',
};

export {
  actions,
  categories,
  categoriesLabels,
  statuses,
  statusActions,
  statusesColorNames,
  statusesLabels,
};
