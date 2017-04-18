import keyMirror from 'keymirror';

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
});

const typesLabels = {
  [types.LOG_IN]: 'Logged in',
  [types.LOG_OUT]: 'Logged out',
  [types.PLAYER_PROFILE_VERIFIED_EMAIL]: 'Personal info - Email verified',
  [types.KYC_ADDRESS_REFUSED]: 'KYC - Address - rejected',
  [types.KYC_ADDRESS_VERIFIED]: 'KYC - Address - verified',
  [types.KYC_PERSONAL_REFUSED]: 'KYC - Identity - rejected',
  [types.KYC_PERSONAL_VERIFIED]: 'KYC - Identity - verified',
  [types.PLAYER_PROFILE_REGISTERED]: 'Registration',
  [types.PLAYER_PROFILE_CHANGED]: 'Personal details change',
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
};

export {
  types,
  typesLabels,
  typesClassNames,
};
