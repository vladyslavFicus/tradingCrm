import keyMirror from 'keymirror';
import I18n from '../utils/fake-i18n';

const types = keyMirror({
  LOG_IN: null,
  LOG_OUT: null,
  PLAYER_PROFILE_VERIFIED_EMAIL: null,
  PLAYER_PROFILE_VERIFIED_PHONE: null,
  KYC_ADDRESS_REFUSED: null,
  KYC_ADDRESS_VERIFIED: null,
  KYC_PERSONAL_REFUSED: null,
  KYC_PERSONAL_VERIFIED: null,
  PLAYER_PROFILE_REGISTERED: null,
  PLAYER_PROFILE_CHANGED: null,
  PLAYER_PROFILE_SEARCH: null,
  PLAYER_PROFILE_VIEWED: null,
  NEW_OPERATOR_ACCOUNT_CREATED: null,
  OPERATOR_ACCOUNT_CREATED: null,
  FAILED_LOGIN_ATTEMPT: null,
  KYC_REQUESTED: null,
  KYC_CONFIRMATION: null,
  ROFUS_VERIFICATION: null,
  PLAYER_PROFILE_BLOCKED: null,
  PLAYER_PROFILE_UNBLOCKED: null,
  RESET_PASSWORD: null,
  CHANGE_PASSWORD: null,
  NEM_ID_SIGN_IN: null,
});
const typesLabels = {
  [types.LOG_IN]: I18n.t('CONSTANTS.AUDIT.TYPES.LOG_IN'),
  [types.LOG_OUT]: I18n.t('CONSTANTS.AUDIT.TYPES.LOG_OUT'),
  [types.PLAYER_PROFILE_VERIFIED_EMAIL]: I18n.t('CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_VERIFIED_EMAIL'),
  [types.PLAYER_PROFILE_VERIFIED_PHONE]: I18n.t('CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_VERIFIED_PHONE'),
  [types.KYC_ADDRESS_REFUSED]: I18n.t('CONSTANTS.AUDIT.TYPES.KYC_ADDRESS_REFUSED'),
  [types.KYC_ADDRESS_VERIFIED]: I18n.t('CONSTANTS.AUDIT.TYPES.KYC_ADDRESS_VERIFIED'),
  [types.KYC_PERSONAL_REFUSED]: I18n.t('CONSTANTS.AUDIT.TYPES.KYC_PERSONAL_REFUSED'),
  [types.KYC_PERSONAL_VERIFIED]: I18n.t('CONSTANTS.AUDIT.TYPES.KYC_PERSONAL_VERIFIED'),
  [types.PLAYER_PROFILE_REGISTERED]: I18n.t('CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_REGISTERED'),
  [types.PLAYER_PROFILE_CHANGED]: I18n.t('CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_CHANGED'),
  [types.PLAYER_PROFILE_SEARCH]: I18n.t('CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_SEARCH'),
  [types.PLAYER_PROFILE_VIEWED]: I18n.t('CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_VIEWED'),
  [types.NEW_OPERATOR_ACCOUNT_CREATED]: I18n.t('CONSTANTS.AUDIT.TYPES.NEW_OPERATOR_ACCOUNT_CREATED'),
  [types.OPERATOR_ACCOUNT_CREATED]: I18n.t('CONSTANTS.AUDIT.TYPES.OPERATOR_ACCOUNT_CREATED'),
  [types.FAILED_LOGIN_ATTEMPT]: I18n.t('CONSTANTS.AUDIT.TYPES.FAILED_LOGIN_ATTEMPT'),
  [types.KYC_REQUESTED]: I18n.t('CONSTANTS.AUDIT.TYPES.KYC_REQUESTED'),
  [types.KYC_CONFIRMATION]: I18n.t('CONSTANTS.AUDIT.TYPES.KYC_CONFIRMATION'),
  [types.ROFUS_VERIFICATION]: I18n.t('CONSTANTS.AUDIT.TYPES.ROFUS_VERIFICATION'),
  [types.PLAYER_PROFILE_BLOCKED]: I18n.t('CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_BLOCKED'),
  [types.PLAYER_PROFILE_UNBLOCKED]: I18n.t('CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_UNBLOCKED'),
  [types.RESET_PASSWORD]: I18n.t('CONSTANTS.AUDIT.TYPES.RESET_PASSWORD'),
  [types.CHANGE_PASSWORD]: I18n.t('CONSTANTS.AUDIT.TYPES.CHANGE_PASSWORD'),
  [types.NEM_ID_SIGN_IN]: I18n.t('CONSTANTS.AUDIT.TYPES.NEM_ID_SIGN_IN'),
};
const typesClassNames = {
  [types.LOG_IN]: 'feed-item_info-status__blue',
  [types.LOG_OUT]: '',
  [types.PLAYER_PROFILE_VERIFIED_EMAIL]: 'feed-item_info-status__blue',
  [types.PLAYER_PROFILE_VERIFIED_PHONE]: 'feed-item_info-status__blue',
  [types.KYC_ADDRESS_REFUSED]: 'feed-item_info-status__red',
  [types.KYC_ADDRESS_VERIFIED]: 'feed-item_info-status__green',
  [types.KYC_PERSONAL_REFUSED]: 'feed-item_info-status__red',
  [types.KYC_PERSONAL_VERIFIED]: 'feed-item_info-status__green',
  [types.PLAYER_PROFILE_REGISTERED]: 'feed-item_info-status__blue',
  [types.PLAYER_PROFILE_CHANGED]: 'feed-item_info-status__green',
  [types.PLAYER_PROFILE_SEARCH]: '',
  [types.NEW_OPERATOR_ACCOUNT_CREATED]: '',
  [types.OPERATOR_ACCOUNT_CREATED]: '',
  [types.FAILED_LOGIN_ATTEMPT]: 'feed-item_info-status__red',
  [types.KYC_REQUESTED]: 'feed-item_info-status__green',
  [types.KYC_CONFIRMATION]: 'feed-item_info-status__green',
  [types.ROFUS_VERIFICATION]: 'feed-item_info-status__green',
  [types.PLAYER_PROFILE_BLOCKED]: 'feed-item_info-status__red',
  [types.PLAYER_PROFILE_UNBLOCKED]: 'feed-item_info-status__blue',
  [types.RESET_PASSWORD]: 'feed-item_info-status__blue',
  [types.CHANGE_PASSWORD]: 'feed-item_info-status__blue',
  [types.NEM_ID_SIGN_IN]: 'feed-item_info-status__blue',
};

export {
  types,
  typesLabels,
  typesClassNames,
};
