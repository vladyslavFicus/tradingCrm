import keyMirror from 'keymirror';

const actions = keyMirror({
  VERIFY: null,
  REFUSE: null,
});

const categories = keyMirror({
  KYC_ADDRESS: null,
  KYC_PERSONAL: null,
  OTHER: null,
  PAYMENT_ACCOUNT: null,
});

const categoriesLabels = {
  [categories.KYC_ADDRESS]: 'FILES.CATEGORIES.KYC_ADDRESS',
  [categories.KYC_PERSONAL]: 'FILES.CATEGORIES.KYC_PERSONAL',
  [categories.OTHER]: 'FILES.CATEGORIES.KYC_OTHER',
  [categories.PAYMENT_ACCOUNT]: 'FILES.CATEGORIES.KYC_PAYMENT_ACCOUNT',
};

const statuses = keyMirror({
  APPROVED: null,
  DELETED: null,
  NEW: null,
  NOT_VERIFIED: null,
  NOT_VERIFIED_APPROVED: null,
  OTHER: null,
  REJECTED: null,
});

const statusesLabels = {
  [statuses.APPROVED]: 'FILES.STATUSES.APPROVED',
  [statuses.DELETED]: 'FILES.STATUSES.DELETED',
  [statuses.NEW]: 'FILES.STATUSES.NEW',
  [statuses.NOT_VERIFIED]: 'FILES.STATUSES.NOT_VERIFIED',
  [statuses.NOT_VERIFIED_APPROVED]: 'FILES.STATUSES.NOT_VERIFIED_APPROVED',
  [statuses.OTHER]: 'FILES.STATUSES.OTHER',
  [statuses.REJECTED]: 'FILES.STATUSES.REJECTED',
};

export {
  actions,
  categories,
  categoriesLabels,
  statuses,
  statusesLabels,
};
