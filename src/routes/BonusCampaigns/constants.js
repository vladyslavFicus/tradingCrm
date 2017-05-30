import keyMirror from 'keymirror';
import I18n from '../../utils/fake-i18n';

const statuses = keyMirror({
  DRAFT: null,
  PENDING: null,
  ACTIVE: null,
  FINISHED: null,
  CANCELED: null,
});
const amountTypes = keyMirror({
  ABSOLUTE: null,
  PERCENTAGE: null,
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
  [statuses.ACTIVE]: 'color-green',
  [statuses.FINISHED]: 'color-black',
  [statuses.CANCELED]: 'color-danger',
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

export {
  statuses,
  statusesLabels,
  statusesClassNames,
  campaignTypes,
  campaignTypesLabels,
  amountTypes,
  targetTypes,
  targetTypesLabels,
};
