import keyMirror from 'keymirror';
import I18n from 'utils/fake-i18n';
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
  [categories.PAYMENT_ACCOUNT]: I18n.t('FILES.CATEGORIES.KYC_PAYMENT_ACCOUNT'),
  [categories.KYC_PERSONAL]: I18n.t('FILES.CATEGORIES.KYC_PERSONAL'),
  [categories.KYC_ADDRESS]: I18n.t('FILES.CATEGORIES.KYC_ADDRESS'),
  [categories.OTHER]: I18n.t('FILES.CATEGORIES.KYC_OTHER'),
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
      label: I18n.t('FILES.ACTIONS.VERIFY'),
      permissions: new Permissions(permissions.USER_PROFILE.VERIFY_FILE),
    },
    {
      action: actions.REFUSE,
      label: I18n.t('FILES.ACTIONS.REFUSE'),
      permissions: new Permissions(permissions.USER_PROFILE.REFUSE_FILE),
    },
  ],
  [statuses.VERIFIED]: [
    {
      action: actions.REFUSE,
      label: I18n.t('FILES.ACTIONS.REFUSE'),
      permissions: new Permissions(permissions.USER_PROFILE.REFUSE_FILE),
    },
  ],
  [statuses.REFUSED]: [
    {
      action: actions.VERIFY,
      label: I18n.t('FILES.ACTIONS.VERIFY'),
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
  [statuses.PENDING]: I18n.t('FILES.STATUSES.UNDER_REVIEW'),
  [statuses.VERIFIED]: I18n.t('FILES.STATUSES.VERIFIED'),
  [statuses.REFUSED]: I18n.t('FILES.STATUSES.REFUSED'),
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
