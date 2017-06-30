import keyMirror from 'keymirror';
import config from '../config';
import I18n from '../utils/fake-i18n';

const actions = keyMirror({
  ACTIVATE: null,
  CANCEL: null,
});
const actionLabels = {
  [actions.ACTIVATE]: I18n.t('CONSTANTS.FREE_SPIN.STATUS_ACTIONS_LABELS.ACTIVATE'),
  [actions.CANCEL]: I18n.t('CONSTANTS.FREE_SPIN.STATUS_ACTIONS_LABELS.CANCEL'),
};
const statuses = keyMirror({
  DRAFT: null,
  PENDING: null,
  ACTIVE: null,
  FINISHED: null,
  CANCELED: null,
});
const statusesReasons = keyMirror({
  CANCELED: null,
});
const statusesLabels = {
  [statuses.DRAFT]: I18n.t('CONSTANTS.FREE_SPIN.STATUSES.DRAFT'),
  [statuses.PENDING]: I18n.t('CONSTANTS.FREE_SPIN.STATUSES.PENDING'),
  [statuses.ACTIVE]: I18n.t('CONSTANTS.FREE_SPIN.STATUSES.ACTIVE'),
  [statuses.FINISHED]: I18n.t('CONSTANTS.FREE_SPIN.STATUSES.FINISHED'),
  [statuses.CANCELED]: I18n.t('CONSTANTS.FREE_SPIN.STATUSES.CANCELED'),
};
const statusesClassNames = {
  [statuses.DRAFT]: 'color-default',
  [statuses.PENDING]: 'color-primary',
  [statuses.ACTIVE]: 'color-success',
  [statuses.FINISHED]: 'color-black',
  [statuses.CANCELED]: 'color-danger',
};

const cancelAction = {
  action: actions.CANCEL,
  submitButtonLabel: I18n.t('CONSTANTS.FREE_SPIN.STATUS_ACTIONS.CANCEL_CAMPAIGN_BUTTON'),
  submitButtonClassName: 'btn-danger',
  className: 'color-danger',
  label: I18n.t('CONSTANTS.FREE_SPIN.STATUS_ACTIONS.CANCEL_CAMPAIGN'),
  reasons: config.modules.bonusCampaign.cancelReasons,
  customReason: true,
};

const statusActions = {
  [statuses.DRAFT]: [
    {
      action: actions.ACTIVATE,
      submitButtonLabel: I18n.t('CONSTANTS.FREE_SPIN.STATUS_ACTIONS.ACTIVATE_CAMPAIGN_BUTTON'),
      submitButtonClassName: 'btn-success',
      className: 'color-success',
      label: I18n.t('CONSTANTS.FREE_SPIN.STATUS_ACTIONS.ACTIVATE_CAMPAIGN'),
    },
  ],
  [statuses.PENDING]: [cancelAction],
  [statuses.ACTIVE]: [cancelAction],
};

export {
  actions,
  actionLabels,
  statuses,
  statusActions,
  statusesReasons,
  statusesLabels,
  statusesClassNames,
};
