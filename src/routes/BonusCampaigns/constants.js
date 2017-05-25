import keyMirror from 'keymirror';
import I18n from '../../utils/fake-i18n';

const statuses = keyMirror({
  DRAFT: null,
  PENDING: null,
  ACTIVE: null,
  FINISHED: null,
  CANCELED: null,
});
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
const eventTypes = keyMirror({
  FIRST_DEPOSIT: null,
  DEPOSIT: null,
  PROFILE_COMPLETED: null,
});
const eventTypesLabels = {
  [eventTypes.FIRST_DEPOSIT]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.EVENT_TYPE.FIRST_DEPOSIT'),
  [eventTypes.DEPOSIT]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.EVENT_TYPE.DEPOSIT'),
  [eventTypes.PROFILE_COMPLETED]: I18n.t('CONSTANTS.BONUS_CAMPAIGN.EVENT_TYPE.PROFILE_COMPLETED'),
};

export {
  statuses,
  statusesLabels,
  statusesClassNames,
  eventTypes,
  eventTypesLabels,
};
