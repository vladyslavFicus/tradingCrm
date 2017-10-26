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
});
const targetTypesLabels = {
  [targetTypes.ALL]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.TARGET_TYPES.ALL'),
  [targetTypes.TARGET_LIST]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.TARGET_TYPES.TARGET_LIST'),
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
});
const lockAmountStrategyLabels = {
  [lockAmountStrategy.LOCK_ALL]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.LOCK_AMOUNT_STRATEGY.LOCK_ALL'),
  [lockAmountStrategy.LOCK_PARTIAL]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.LOCK_AMOUNT_STRATEGY.LOCK_PARTIAL'),
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
const campaignTypes = keyMirror({
  FIRST_DEPOSIT: null,
  DEPOSIT: null,
  PROFILE_COMPLETED: null,
});
const campaignTypesLabels = {
  [campaignTypes.FIRST_DEPOSIT]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.CAMPAIGN_TYPE.FIRST_DEPOSIT'),
  [campaignTypes.DEPOSIT]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.CAMPAIGN_TYPE.DEPOSIT'),
  [campaignTypes.PROFILE_COMPLETED]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.CAMPAIGN_TYPE.PROFILE_COMPLETED'),
};

const customValueFieldTypesByCampaignType = {
  [campaignTypes.FIRST_DEPOSIT]: [customValueFieldTypes.PERCENTAGE, customValueFieldTypes.ABSOLUTE],
  [campaignTypes.DEPOSIT]: [customValueFieldTypes.PERCENTAGE, customValueFieldTypes.ABSOLUTE],
  [campaignTypes.PROFILE_COMPLETED]: [customValueFieldTypes.ABSOLUTE],
};

const optInSelect = {
  true: I18n.t('COMMON.OPT_IN'),
  false: I18n.t('COMMON.NON_OPT_IN'),
};

const fulfillmentSelect = {
  registration: I18n.t('BONUS_CAMPAIGNS.FULFILLMENTS.REGISTRATION_FULFILLMENT'),
  deposit: I18n.t('BONUS_CAMPAIGNS.FULFILLMENTS.DEPOSIT_FULFILLMENT'),
  profileCompleted: 'Profile completed',
  wagering: I18n.t('BONUS_CAMPAIGNS.FULFILLMENTS.WAGERING_FULFILLMENT'),
  login: I18n.t('BONUS_CAMPAIGNS.FULFILLMENTS.LOGIN_FULFILLMENT'),
  campaign: I18n.t('BONUS_CAMPAIGNS.FULFILLMENTS.CAMPAIGN_FULFILLMENT'),
  email: I18n.t('BONUS_CAMPAIGNS.FULFILLMENTS.EMAIL_VERIFICATION_FULFILLMENT'),
  phone: I18n.t('BONUS_CAMPAIGNS.FULFILLMENTS.PHONE_VERIFICATION_FULFILLMENT'),
};

const rewardSelect = {
  bonus: I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS'),
  freeSpins: I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPINS'),
};

const wageredAmount = {
  allGames: I18n.t('BONUS_CAMPAIGNS.FULFILLMENTS.WAGERED_AMOUNT_ALL_GAMES'),
  oneGame: I18n.t('BONUS_CAMPAIGNS.FULFILLMENTS.WAGERED_AMOUNT_ONE_GAME'),
};

const multipliersTypes = {
  bonus: I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS'),
  deposit: I18n.t('BONUS_CAMPAIGNS.REWARDS.DEPOSIT'),
  bonusDeposit: I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS_DEPOSIT'),
};

const moneyTypePrior = {
  realMoney: I18n.t('BONUS_CAMPAIGNS.REWARDS.REAL_MONEY_FIRST'),
  bonusMoney: I18n.t('BONUS_CAMPAIGNS.REWARDS.BONUS_MONEY_FIRST'),
};

export {
  actions,
  actionLabels,
  statuses,
  statusActions,
  statusesReasons,
  statusesLabels,
  statusesClassNames,
  campaignTypes,
  campaignTypesLabels,
  targetTypes,
  targetTypesLabels,
  customValueFieldTypesByCampaignType,
  moneyTypeUsage,
  moneyTypeUsageLabels,
  optInSelect,
  fulfillmentSelect,
  wageredAmount,
  rewardSelect,
  multipliersTypes,
  moneyTypePrior,
  lockAmountStrategy,
  lockAmountStrategyLabels,
};
