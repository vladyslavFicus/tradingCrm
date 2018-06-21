import keyMirror from 'keymirror';
import I18n from '../../utils/fake-i18n';

const attributeLabels = {
  campaignName: I18n.t('CAMPAIGNS.SETTINGS.LABEL.CAMPAIGN_NAME'),
  targetType: I18n.t('CAMPAIGNS.SETTINGS.LABEL.TARGET_TYPE'),
  optIn: I18n.t('CAMPAIGNS.SETTINGS.LABEL.OPT_IN'),
  promoCode: I18n.t('CAMPAIGNS.SETTINGS.LABEL.PROMO_CODE'),
  fulfillmentPeriod: I18n.t('CAMPAIGNS.SETTINGS.FULFILLMENT_PERIOD'),
  fulfillmentPeriodTimeUnit: I18n.t('CAMPAIGNS.SETTINGS.PERIOD'),
  optInPeriod: I18n.t('CAMPAIGNS.SETTINGS.OPT_IN_PERIOD'),
  optInPeriodTimeUnit: I18n.t('CAMPAIGNS.SETTINGS.PERIOD'),
};

const rewardTemplateTypes = keyMirror({
  BONUS: null,
  FREE_SPIN: null,
});

const fulfillmentTypes = keyMirror({
  WAGERING: null,
  DEPOSIT: null,
});

const nodeGroups = keyMirror({
  FULFILLMENTS: null,
  REWARDS: null,
});

const nodeGroupsAlias = {
  [nodeGroups.FULFILLMENTS]: 'fulfillments',
  [nodeGroups.REWARDS]: 'rewards',
};

const nodeGroupValidateMessage = {
  [nodeGroups.FULFILLMENTS]: I18n.t('CAMPAIGNS.NODE_VALIDATION.FULFILLMENTS'),
  [nodeGroups.REWARDS]: I18n.t('CAMPAIGNS.NODE_VALIDATION.REWARDS'),
};

const rewardTypesLabels = {
  [rewardTemplateTypes.BONUS]: I18n.t('CAMPAIGNS.BONUS_TEMPLATE'),
  [rewardTemplateTypes.FREE_SPIN]: I18n.t('CAMPAIGNS.FREE_SPIN_TEMPLATE'),
};

const fulfillmentTypesLabels = {
  [fulfillmentTypes.WAGERING]: I18n.t('CAMPAIGNS.WAGERING_FULFILLMENT'),
  [fulfillmentTypes.DEPOSIT]: I18n.t('CAMPAIGNS.DEPOSIT_FULFILLMENT'),
};

const optInSelect = {
  true: I18n.t('CAMPAIGNS.SETTINGS.LABEL.OPT_IN_REQUIRED'),
  false: I18n.t('COMMON.NON_OPT_IN'),
};

const periods = keyMirror({
  HOURS: null,
  DAYS: null,
  WEEKS: null,
});

const periodsLabels = {
  [periods.HOURS]: I18n.t('COMMON.HOURS'),
  [periods.DAYS]: I18n.t('COMMON.DAYS'),
  [periods.WEEKS]: I18n.t('COMMON.WEEKS'),
};

export {
  attributeLabels,
  rewardTemplateTypes,
  fulfillmentTypes,
  rewardTypesLabels,
  fulfillmentTypesLabels,
  nodeGroups,
  nodeGroupsAlias,
  nodeGroupValidateMessage,
  optInSelect,
  periods,
  periodsLabels,
};

export default attributeLabels;
