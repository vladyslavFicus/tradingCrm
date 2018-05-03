import keyMirror from 'keymirror';
import config from '../config';
import I18n from '../utils/fake-i18n';
import { customValueFieldTypes } from '../constants/form';

const actions = keyMirror({
  ACTIVATE: null,
  CANCEL: null,
});
const actionLabels = {
  [actions.ACTIVATE]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.STATUS_ACTIONS_LABELS.ACTIVATE'),
  [actions.CANCEL]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.STATUS_ACTIONS_LABELS.CANCEL'),
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
const targetTypes = keyMirror({
  ALL: null,
  TARGET_LIST: null,
  LINKED_CAMPAIGN: null,
});
const targetTypesLabels = {
  [targetTypes.ALL]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.TARGET_TYPES.ALL'),
  [targetTypes.TARGET_LIST]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.TARGET_TYPES.TARGET_LIST'),
  [targetTypes.LINKED_CAMPAIGN]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.TARGET_TYPES.LINKED_CAMPAIGN'),
};
const statusesLabels = {
  [statuses.DRAFT]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.STATUSES.DRAFT'),
  [statuses.PENDING]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.STATUSES.PENDING'),
  [statuses.ACTIVE]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.STATUSES.ACTIVE'),
  [statuses.FINISHED]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.STATUSES.FINISHED'),
  [statuses.CANCELED]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.STATUSES.CANCELED'),
};
const statusesClassNames = {
  [statuses.DRAFT]: 'color-default',
  [statuses.PENDING]: 'color-primary',
  [statuses.ACTIVE]: 'color-success',
  [statuses.FINISHED]: 'color-black',
  [statuses.CANCELED]: 'color-danger',
};
const moneyTypeUsage = keyMirror({
  REAL_MONEY_FIRST: null,
  BONUS_MONEY_FIRST: null,
});
const moneyTypeUsageLabels = {
  [moneyTypeUsage.REAL_MONEY_FIRST]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.MONEY_TYPE_USAGE.REAL_MONEY'),
  [moneyTypeUsage.BONUS_MONEY_FIRST]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.MONEY_TYPE_USAGE.BONUS_MONEY'),
};
const lockAmountStrategy = keyMirror({
  LOCK_ALL: null,
  LOCK_PARTIAL: null,
  LOCK_BONUS: null,
});
const lockAmountStrategyLabels = {
  [lockAmountStrategy.LOCK_ALL]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.LOCK_AMOUNT_STRATEGY.LOCK_ALL'),
  [lockAmountStrategy.LOCK_PARTIAL]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.LOCK_AMOUNT_STRATEGY.LOCK_PARTIAL'),
  [lockAmountStrategy.LOCK_BONUS]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.LOCK_AMOUNT_STRATEGY.LOCK_BONUS'),
};

const cancelAction = {
  action: actions.CANCEL,
  submitButtonLabel: I18n.t('CONSTANTS.BONUS_CAMPAIGN.STATUS_ACTIONS.CANCEL_CAMPAIGN_BUTTON'),
  submitButtonClassName: 'btn-danger',
  className: 'color-danger',
  label: I18n.t('CONSTANTS.BONUS_CAMPAIGN.STATUS_ACTIONS.CANCEL_CAMPAIGN'),
  reasons: config.modules.bonusCampaign.cancelReasons,
  customReason: true,
};

const statusActions = {
  [statuses.DRAFT]: [
    {
      action: actions.ACTIVATE,
      submitButtonLabel: I18n.t('CONSTANTS.BONUS_CAMPAIGN.STATUS_ACTIONS.ACTIVATE_CAMPAIGN_BUTTON'),
      submitButtonClassName: 'btn-success',
      className: 'color-success',
      label: I18n.t('CONSTANTS.BONUS_CAMPAIGN.STATUS_ACTIONS.ACTIVATE_CAMPAIGN'),
    },
  ],
  [statuses.PENDING]: [cancelAction],
  [statuses.ACTIVE]: [cancelAction],
};
const fulfillmentTypes = keyMirror({
  DEPOSIT: null,
  PROFILE_COMPLETED: null,
  WITHOUT_FULFILMENT: null,
});
const rewardTypes = keyMirror({
  BONUS: null,
  FREE_SPIN: null,
});
const fulfillmentTypesLabels = {
  [fulfillmentTypes.DEPOSIT]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.CAMPAIGN_TYPE.DEPOSIT'),
  [fulfillmentTypes.PROFILE_COMPLETED]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.CAMPAIGN_TYPE.PROFILE_COMPLETED'),
  [fulfillmentTypes.WITHOUT_FULFILMENT]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.CAMPAIGN_TYPE.WITHOUT_FULFILLMENT'),
};
const rewardTypesLabels = {
  [rewardTypes.BONUS]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.REWARD_TYPE.BONUS'),
  [rewardTypes.FREE_SPIN]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.REWARD_TYPE.FREE_SPIN'),
};

const customValueFieldTypesByFulfillmentType = {
  [fulfillmentTypes.DEPOSIT]: [customValueFieldTypes.PERCENTAGE, customValueFieldTypes.ABSOLUTE],
  [fulfillmentTypes.PROFILE_COMPLETED]: [customValueFieldTypes.ABSOLUTE],
  [fulfillmentTypes.WITHOUT_FULFILMENT]: [customValueFieldTypes.ABSOLUTE],
};

const optInSelect = {
  true: I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.OPT_IN_REQUIRED'),
  false: I18n.t('COMMON.NON_OPT_IN'),
};

const countryStrategies = keyMirror({
  INCLUDE: null,
  EXCLUDE: null,
});

export {
  actions,
  actionLabels,
  statuses,
  statusActions,
  statusesReasons,
  statusesLabels,
  statusesClassNames,
  fulfillmentTypes,
  rewardTypes,
  rewardTypesLabels,
  fulfillmentTypesLabels,
  targetTypes,
  targetTypesLabels,
  customValueFieldTypesByFulfillmentType,
  moneyTypeUsage,
  moneyTypeUsageLabels,
  optInSelect,
  lockAmountStrategy,
  lockAmountStrategyLabels,
  countryStrategies,
};
