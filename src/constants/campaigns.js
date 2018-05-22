import keyMirror from 'keymirror';
import I18n from '../utils/fake-i18n';

const statuses = keyMirror({
  ACTIVE: null,
  DRAFT: null,
});
const statusesLabels = {
  [statuses.ACTIVE]: I18n.t('CONSTANTS.CAMPAIGNS.STATUSES.ACTIVE'),
  [statuses.DRAFT]: I18n.t('CONSTANTS.CAMPAIGNS.STATUSES.DRAFT'),
};

const fulfillmentTypes = keyMirror({
  WAGERING: null,
  DEPOSIT: null,
});
const fulfillmentTypesLabels = {
  [fulfillmentTypes.WAGERING]: I18n.t('CONSTANTS.CAMPAIGNS.FULFILLMENT_TYPES.WAGERING'),
  [fulfillmentTypes.DEPOSIT]: I18n.t('CONSTANTS.CAMPAIGNS.FULFILLMENT_TYPES.DEPOSIT'),
};

const rewardTypes = keyMirror({
  BONUS: null,
  FREE_SPIN: null,
});
const rewardTypesLabels = {
  [rewardTypes.BONUS]: I18n.t('CONSTANTS.CAMPAIGNS.REWARD_TYPES.BONUS'),
  [rewardTypes.FREE_SPIN]: I18n.t('CONSTANTS.CAMPAIGNS.REWARD_TYPES.FREE_SPIN'),
};

export {
  statuses,
  statusesLabels,
  fulfillmentTypes,
  fulfillmentTypesLabels,
  rewardTypes,
  rewardTypesLabels,
};
