import keyMirror from 'keymirror';
import I18n from 'utils/fake-i18n';

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
  [categories.PAYMENT_ACCOUNT]: I18n.t('FILES.CATEGORIES.KYC_PAYMENT_ACCOUNT'),
  [categories.KYC_PERSONAL]: I18n.t('FILES.CATEGORIES.KYC_PERSONAL'),
  [categories.KYC_ADDRESS]: I18n.t('FILES.CATEGORIES.KYC_ADDRESS'),
  [categories.OTHER]: I18n.t('FILES.CATEGORIES.KYC_OTHER'),
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
  [statuses.NEW]: I18n.t('FILES.STATUSES.NEW'),
  [statuses.APPROVED]: I18n.t('FILES.STATUSES.APPROVED'),
  [statuses.REJECTED]: I18n.t('FILES.STATUSES.REJECTED'),
  [statuses.NOT_VERIFIED]: I18n.t('FILES.STATUSES.NOT_VERIFIED'),
  [statuses.NOT_VERIFIED_APPROVED]: I18n.t('FILES.STATUSES.NOT_VERIFIED_APPROVED'),
  [statuses.DELETED]: I18n.t('FILES.STATUSES.DELETED'),
  [statuses.OTHER]: I18n.t('FILES.STATUSES.OTHER'),
};

export {
  actions,
  categories,
  categoriesLabels,
  statuses,
  statusesLabels,
};
