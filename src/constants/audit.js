import keyMirror from 'keymirror';

const types = keyMirror({
  AFFILIATE_ACCOUNT_CREATED: null,
  LOG_IN: null,
  LOG_OUT: null,
  PLAYER_PROFILE_VERIFIED_EMAIL: null,
  PLAYER_PROFILE_VERIFIED_PHONE: null,
  KYC_ADDRESS_REFUSED: null,
  KYC_ADDRESS_VERIFIED: null,
  KYC_PERSONAL_REFUSED: null,
  KYC_PERSONAL_VERIFIED: null,
  PLAYER_PROFILE_KYC_CHANGED: null,
  PLAYER_PROFILE_ACQUISITION_CHANGED: null,
  PLAYER_PROFILE_STATUS_CHANGED: null,
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
  PLAYER_PROFILE_SELF_EXCLUDED: null,
  PLAYER_PROFILE_SELF_EXCLUSION_COOLOFF: null,
  PLAYER_PROFILE_RESUMED: null,
  ACCEPTED_TERMS: null,
  PROFILE_ASSIGN: null,
  CHANGE_LEVERAGE_REQUESTED: null,
  RISK_PROFILE_DATA_CREATED: null,
  PLAYER_PROFILE_TRANSFER_AVAILABILITY_CHANGED: null,
  ACCOUNT_CREATED: null,
  SHUFTIPRO_SENT: null,
  ATTACHMENT_ADDED: null,
  TRADING_ACCOUNT_READ_ONLY_UPDATED: null,
  NOTE_PROFILE_CREATED: null,
  NOTE_PROFILE_REMOVED: null,
  NOTE_PROFILE_UPDATED: null,
  CREDIT_IN: null,
  CREDIT_OUT: null,
  DEPOSIT: null,
  QUESTIONNAIRE_COMPLETED: null,
  TRADING_ACCOUNT_CREATED: null,
  CHANGE_LEVERAGE_REQUEST_CREATED: null,
  CHANGE_LEVERAGE_REQUEST_UPDATED: null,
  WITHDRAW: null,
  TRANSFER_IN: null,
  TRANSFER_OUT: null,
  FEE: null,
  INACTIVITY_FEE: null,
});
const typesLabels = {
  [types.AFFILIATE_ACCOUNT_CREATED]: 'CONSTANTS.AUDIT.TYPES.AFFILIATE_ACCOUNT_CREATED',
  [types.LOG_IN]: 'CONSTANTS.AUDIT.TYPES.LOG_IN',
  [types.LOG_OUT]: 'CONSTANTS.AUDIT.TYPES.LOG_OUT',
  [types.PLAYER_PROFILE_VERIFIED_EMAIL]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_VERIFIED_EMAIL',
  [types.PLAYER_PROFILE_VERIFIED_PHONE]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_VERIFIED_PHONE',
  [types.KYC_ADDRESS_REFUSED]: 'CONSTANTS.AUDIT.TYPES.KYC_ADDRESS_REFUSED',
  [types.KYC_ADDRESS_VERIFIED]: 'CONSTANTS.AUDIT.TYPES.KYC_ADDRESS_VERIFIED',
  [types.KYC_PERSONAL_REFUSED]: 'CONSTANTS.AUDIT.TYPES.KYC_PERSONAL_REFUSED',
  [types.KYC_PERSONAL_VERIFIED]: 'CONSTANTS.AUDIT.TYPES.KYC_PERSONAL_VERIFIED',
  [types.PLAYER_PROFILE_KYC_CHANGED]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_KYC_CHANGED',
  [types.PLAYER_PROFILE_ACQUISITION_CHANGED]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_ACQUISITION_CHANGED',
  [types.PLAYER_PROFILE_REGISTERED]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_REGISTERED',
  [types.PLAYER_PROFILE_CHANGED]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_CHANGED',
  [types.PLAYER_PROFILE_STATUS_CHANGED]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_STATUS_CHANGED',
  [types.PLAYER_PROFILE_SEARCH]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_SEARCH',
  [types.PLAYER_PROFILE_VIEWED]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_VIEWED',
  [types.NEW_OPERATOR_ACCOUNT_CREATED]: 'CONSTANTS.AUDIT.TYPES.NEW_OPERATOR_ACCOUNT_CREATED',
  [types.OPERATOR_ACCOUNT_CREATED]: 'CONSTANTS.AUDIT.TYPES.OPERATOR_ACCOUNT_CREATED',
  [types.FAILED_LOGIN_ATTEMPT]: 'CONSTANTS.AUDIT.TYPES.FAILED_LOGIN_ATTEMPT',
  [types.KYC_REQUESTED]: 'CONSTANTS.AUDIT.TYPES.KYC_REQUESTED',
  [types.KYC_CONFIRMATION]: 'CONSTANTS.AUDIT.TYPES.KYC_CONFIRMATION',
  [types.ROFUS_VERIFICATION]: 'CONSTANTS.AUDIT.TYPES.ROFUS_VERIFICATION',
  [types.PLAYER_PROFILE_BLOCKED]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_BLOCKED',
  [types.PLAYER_PROFILE_UNBLOCKED]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_UNBLOCKED',
  [types.RESET_PASSWORD]: 'CONSTANTS.AUDIT.TYPES.RESET_PASSWORD',
  [types.CHANGE_PASSWORD]: 'CONSTANTS.AUDIT.TYPES.CHANGE_PASSWORD',
  [types.NEM_ID_SIGN_IN]: 'CONSTANTS.AUDIT.TYPES.NEM_ID_SIGN_IN',
  [types.PLAYER_PROFILE_SELF_EXCLUDED]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_STATUS_CHANGED',
  [types.PLAYER_PROFILE_SELF_EXCLUSION_COOLOFF]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_STATUS_CHANGED',
  [types.PLAYER_PROFILE_RESUMED]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_STATUS_CHANGED',
  [types.ACCEPTED_TERMS]: 'CONSTANTS.AUDIT.TYPES.ACCEPTED_TERMS',
  [types.PROFILE_ASSIGN]: 'CONSTANTS.AUDIT.TYPES.PROFILE_ASSIGN',
  [types.CHANGE_LEVERAGE_REQUESTED]: 'CONSTANTS.AUDIT.TYPES.CHANGE_LEVERAGE_REQUESTED',
  [types.RISK_PROFILE_DATA_CREATED]: 'CONSTANTS.AUDIT.TYPES.RISK_PROFILE_DATA_CREATED',
  [types.PLAYER_PROFILE_TRANSFER_AVAILABILITY_CHANGED]:
    'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_TRANSFER_AVAILABILITY_CHANGED',
  [types.ACCOUNT_CREATED]: 'CONSTANTS.AUDIT.TYPES.ACCOUNT_CREATED',
  [types.SHUFTIPRO_SENT]: 'CONSTANTS.AUDIT.TYPES.SHUFTIPRO_SENT',
  [types.ATTACHMENT_ADDED]: 'CONSTANTS.AUDIT.TYPES.ATTACHMENT_ADDED',
  [types.TRADING_ACCOUNT_READ_ONLY_UPDATED]: 'CONSTANTS.AUDIT.TYPES.TRADING_ACCOUNT_READ_ONLY_UPDATED',
  [types.NOTE_PROFILE_CREATED]: 'CONSTANTS.AUDIT.TYPES.NOTE_PROFILE_CREATED',
  [types.NOTE_PROFILE_REMOVED]: 'CONSTANTS.AUDIT.TYPES.NOTE_PROFILE_REMOVED',
  [types.NOTE_PROFILE_UPDATED]: 'CONSTANTS.AUDIT.TYPES.NOTE_PROFILE_UPDATED',
  [types.CREDIT_IN]: 'CONSTANTS.AUDIT.TYPES.CREDIT_IN',
  [types.CREDIT_OUT]: 'CONSTANTS.AUDIT.TYPES.CREDIT_OUT',
  [types.DEPOSIT]: 'CONSTANTS.AUDIT.TYPES.DEPOSIT',
  [types.QUESTIONNAIRE_COMPLETED]: 'CONSTANTS.AUDIT.TYPES.QUESTIONNAIRE_COMPLETED',
  [types.TRADING_ACCOUNT_CREATED]: 'CONSTANTS.AUDIT.TYPES.TRADING_ACCOUNT_CREATED',
  [types.CHANGE_LEVERAGE_REQUEST_CREATED]: 'CONSTANTS.AUDIT.TYPES.CHANGE_LEVERAGE_REQUEST_CREATED',
  [types.CHANGE_LEVERAGE_REQUEST_UPDATED]: 'CONSTANTS.AUDIT.TYPES.CHANGE_LEVERAGE_REQUEST_UPDATED',
  [types.WITHDRAW]: 'CONSTANTS.AUDIT.TYPES.WITHDRAW',
  [types.TRANSFER_IN]: 'CONSTANTS.AUDIT.TYPES.TRANSFER_IN',
  [types.TRANSFER_OUT]: 'CONSTANTS.AUDIT.TYPES.TRANSFER_OUT',
  [types.FEE]: 'CONSTANTS.AUDIT.TYPES.FEE',
  [types.INACTIVITY_FEE]: 'CONSTANTS.AUDIT.TYPES.INACTIVITY_FEE',
};
const typesClassNames = {
  [types.AFFILIATE_ACCOUNT_CREATED]: 'green',
  [types.LOG_IN]: 'blue',
  [types.LOG_OUT]: '',
  [types.PLAYER_PROFILE_VERIFIED_EMAIL]: 'blue',
  [types.PLAYER_PROFILE_VERIFIED_PHONE]: 'blue',
  [types.KYC_ADDRESS_REFUSED]: 'red',
  [types.KYC_ADDRESS_VERIFIED]: 'green',
  [types.KYC_PERSONAL_REFUSED]: 'red',
  [types.KYC_PERSONAL_VERIFIED]: 'green',
  [types.PLAYER_PROFILE_ACQUISITION_CHANGED]: 'blue',
  [types.PLAYER_PROFILE_TRANSFER_AVAILABILITY_CHANGED]: 'blue',
  [types.PLAYER_PROFILE_REGISTERED]: 'blue',
  [types.PLAYER_PROFILE_CHANGED]: 'green',
  [types.PLAYER_PROFILE_SEARCH]: '',
  [types.NEW_OPERATOR_ACCOUNT_CREATED]: '',
  [types.OPERATOR_ACCOUNT_CREATED]: '',
  [types.FAILED_LOGIN_ATTEMPT]: 'red',
  [types.KYC_REQUESTED]: 'green',
  [types.KYC_CONFIRMATION]: 'green',
  [types.ROFUS_VERIFICATION]: 'green',
  [types.PLAYER_PROFILE_BLOCKED]: 'red',
  [types.PLAYER_PROFILE_UNBLOCKED]: 'blue',
  [types.RESET_PASSWORD]: 'blue',
  [types.CHANGE_PASSWORD]: 'blue',
  [types.NEM_ID_SIGN_IN]: 'blue',
  [types.PLAYER_PROFILE_SELF_EXCLUDED]: 'blue',
  [types.PLAYER_PROFILE_SELF_EXCLUSION_COOLOFF]: 'blue',
  [types.PLAYER_PROFILE_RESUMED]: 'blue',
  [types.ACCEPTED_TERMS]: 'blue',
  [types.PROFILE_ASSIGN]: 'blue',
  [types.CHANGE_LEVERAGE_REQUESTED]: 'blue',
  [types.RISK_PROFILE_DATA_CREATED]: 'green',
};

export {
  types,
  typesLabels,
  typesClassNames,
};
