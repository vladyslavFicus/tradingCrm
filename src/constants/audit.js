import keyMirror from 'keymirror';
import I18n from '../utils/fake-i18n';

const types = keyMirror({
  LOG_IN: null,
  LOG_OUT: null,
  PLAYER_PROFILE_VERIFIED_EMAIL: null,
  KYC_ADDRESS_REFUSED: null,
  KYC_ADDRESS_VERIFIED: null,
  KYC_PERSONAL_REFUSED: null,
  KYC_PERSONAL_VERIFIED: null,
  PLAYER_PROFILE_REGISTERED: null,
  PLAYER_PROFILE_CHANGED: null,
  PLAYER_PROFILE_SEARCH: null,
  NEW_OPERATOR_ACCOUNT_CREATED: null,
  OPERATOR_ACCOUNT_CREATED: null,
});
const typesLabels = {
  [types.LOG_IN]: I18n.t('CONSTANTS.AUDIT.TYPES.LOG_IN'),
  [types.LOG_OUT]: I18n.t('CONSTANTS.AUDIT.TYPES.LOG_OUT'),
  [types.PLAYER_PROFILE_VERIFIED_EMAIL]: I18n.t('CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_VERIFIED_EMAIL'),
  [types.KYC_ADDRESS_REFUSED]: I18n.t('CONSTANTS.AUDIT.TYPES.KYC_ADDRESS_REFUSED'),
  [types.KYC_ADDRESS_VERIFIED]: I18n.t('CONSTANTS.AUDIT.TYPES.KYC_ADDRESS_VERIFIED'),
  [types.KYC_PERSONAL_REFUSED]: I18n.t('CONSTANTS.AUDIT.TYPES.KYC_PERSONAL_REFUSED'),
  [types.KYC_PERSONAL_VERIFIED]: I18n.t('CONSTANTS.AUDIT.TYPES.KYC_PERSONAL_VERIFIED'),
  [types.PLAYER_PROFILE_REGISTERED]: I18n.t('CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_REGISTERED'),
  [types.PLAYER_PROFILE_CHANGED]: I18n.t('CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_CHANGED'),
  [types.PLAYER_PROFILE_SEARCH]: I18n.t('CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_SEARCH'),
  [types.NEW_OPERATOR_ACCOUNT_CREATED]: I18n.t('CONSTANTS.AUDIT.TYPES.NEW_OPERATOR_ACCOUNT_CREATED'),
  [types.OPERATOR_ACCOUNT_CREATED]: I18n.t('CONSTANTS.AUDIT.TYPES.OPERATOR_ACCOUNT_CREATED'),
};
const typesClassNames = {
  [types.LOG_IN]: 'feed-item_info-status__blue',
  [types.LOG_OUT]: '',
  [types.PLAYER_PROFILE_VERIFIED_EMAIL]: 'feed-item_info-status__blue',
  [types.KYC_ADDRESS_REFUSED]: 'feed-item_info-status__red',
  [types.KYC_ADDRESS_VERIFIED]: 'feed-item_info-status__green',
  [types.KYC_PERSONAL_REFUSED]: 'feed-item_info-status__red',
  [types.KYC_PERSONAL_VERIFIED]: 'feed-item_info-status__green',
  [types.PLAYER_PROFILE_REGISTERED]: 'feed-item_info-status__blue',
  [types.PLAYER_PROFILE_CHANGED]: 'feed-item_info-status__green',
  [types.PLAYER_PROFILE_SEARCH]: '',
  [types.NEW_OPERATOR_ACCOUNT_CREATED]: '',
  [types.OPERATOR_ACCOUNT_CREATED]: '',
};

export {
  types,
  typesLabels,
  typesClassNames,
};
