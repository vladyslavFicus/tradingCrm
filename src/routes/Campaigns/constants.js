import keyMirror from 'keymirror';
import I18n from '../../utils/fake-i18n';

const attributeLabels = {
  campaignName: I18n.t('CAMPAIGNS.CAMPAIGN_NAME'),
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

export {
  attributeLabels,
  rewardTemplateTypes,
  fulfillmentTypes,
  rewardTypesLabels,
  fulfillmentTypesLabels,
  nodeGroups,
  nodeGroupsAlias,
  nodeGroupValidateMessage,
};

export default attributeLabels;
