import keyMirror from 'keymirror';

const actions = keyMirror({
  VERIFY: null,
  REFUSE: null,
});

const categories = keyMirror({
  PAYMENT_ACCOUNT: null,
  KYC_PERSONAL: null,
  KYC_ADDRESS: null,
  OTHER: null,
});

const categoriesLabels = {
  [categories.PAYMENT_ACCOUNT]: 'FILES.CATEGORIES.KYC_PAYMENT_ACCOUNT',
  [categories.KYC_PERSONAL]: 'FILES.CATEGORIES.KYC_PERSONAL',
  [categories.KYC_ADDRESS]: 'FILES.CATEGORIES.KYC_ADDRESS',
  [categories.OTHER]: 'FILES.CATEGORIES.KYC_OTHER',
};

const statuses = keyMirror({
  NEW: null,
  APPROVED: null,
  REJECTED: null,
  NOT_VERIFIED: null,
  NOT_VERIFIED_APPROVED: null,
  DELETED: null,
  OTHER: null,
});

const statusesLabels = {
  [statuses.NEW]: 'FILES.STATUSES.NEW',
  [statuses.APPROVED]: 'FILES.STATUSES.APPROVED',
  [statuses.REJECTED]: 'FILES.STATUSES.REJECTED',
  [statuses.NOT_VERIFIED]: 'FILES.STATUSES.NOT_VERIFIED',
  [statuses.NOT_VERIFIED_APPROVED]: 'FILES.STATUSES.NOT_VERIFIED_APPROVED',
  [statuses.DELETED]: 'FILES.STATUSES.DELETED',
  [statuses.OTHER]: 'FILES.STATUSES.OTHER',
};

export {
  actions,
  categories,
  categoriesLabels,
  statuses,
  statusesLabels,
};
