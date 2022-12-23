export enum types {
  AFFILIATE_ACCOUNT_CREATED = 'AFFILIATE_ACCOUNT_CREATED',
  AFFILIATE_STATUS_UPDATED = 'AFFILIATE_STATUS_UPDATED',
  AFFILIATE_UPDATED = 'AFFILIATE_UPDATED',
  AFFILIATE_FTD_CREATED = 'AFFILIATE_FTD_CREATED',
  AFFILIATE_FTD_UPDATED = 'AFFILIATE_FTD_UPDATED',
  LOG_IN = 'LOG_IN',
  LOG_OUT = 'LOG_OUT',
  PLAYER_PROFILE_VERIFIED_EMAIL = 'PLAYER_PROFILE_VERIFIED_EMAIL',
  PLAYER_PROFILE_VERIFIED_PHONE = 'PLAYER_PROFILE_VERIFIED_PHONE',
  KYC_ADDRESS_REFUSED = 'KYC_ADDRESS_REFUSED',
  KYC_ADDRESS_VERIFIED = 'KYC_ADDRESS_VERIFIED',
  KYC_PERSONAL_REFUSED = 'KYC_PERSONAL_REFUSED',
  KYC_PERSONAL_VERIFIED = 'KYC_PERSONAL_VERIFIED',
  PLAYER_PROFILE_KYC_CHANGED = 'PLAYER_PROFILE_KYC_CHANGED',
  PLAYER_PROFILE_ACQUISITION_CHANGED = 'PLAYER_PROFILE_ACQUISITION_CHANGED',
  PLAYER_PROFILE_STATUS_CHANGED = 'PLAYER_PROFILE_STATUS_CHANGED',
  PLAYER_PROFILE_REGISTERED = 'PLAYER_PROFILE_REGISTERED',
  PLAYER_PROFILE_CHANGED = 'PLAYER_PROFILE_CHANGED',
  PLAYER_PROFILE_SEARCH = 'PLAYER_PROFILE_SEARCH',
  PLAYER_PROFILE_VIEWED = 'PLAYER_PROFILE_VIEWED',
  NEW_OPERATOR_ACCOUNT_CREATED = 'NEW_OPERATOR_ACCOUNT_CREATED',
  OPERATOR_ACCOUNT_CREATED = 'OPERATOR_ACCOUNT_CREATED',
  FAILED_LOGIN_ATTEMPT = 'FAILED_LOGIN_ATTEMPT',
  KYC_REQUESTED = 'KYC_REQUESTED',
  KYC_CONFIRMATION = 'KYC_CONFIRMATION',
  ROFUS_VERIFICATION = 'ROFUS_VERIFICATION',
  PLAYER_PROFILE_BLOCKED = 'PLAYER_PROFILE_BLOCKED',
  PLAYER_PROFILE_UNBLOCKED = 'PLAYER_PROFILE_UNBLOCKED',
  RESET_PASSWORD = 'RESET_PASSWORD',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  NEM_ID_SIGN_IN = 'NEM_ID_SIGN_IN',
  PLAYER_PROFILE_SELF_EXCLUDED = 'PLAYER_PROFILE_SELF_EXCLUDED',
  PLAYER_PROFILE_SELF_EXCLUSION_COOLOFF = 'PLAYER_PROFILE_SELF_EXCLUSION_COOLOFF',
  PLAYER_PROFILE_RESUMED = 'PLAYER_PROFILE_RESUMED',
  ACCEPTED_TERMS = 'ACCEPTED_TERMS',
  PROFILE_ASSIGN = 'PROFILE_ASSIGN',
  CHANGE_LEVERAGE_REQUESTED = 'CHANGE_LEVERAGE_REQUESTED',
  RISK_PROFILE_DATA_CREATED = 'RISK_PROFILE_DATA_CREATED',
  PLAYER_PROFILE_TRANSFER_AVAILABILITY_CHANGED = 'PLAYER_PROFILE_TRANSFER_AVAILABILITY_CHANGED',
  ACCOUNT_CREATED = 'ACCOUNT_CREATED',
  ACCOUNT_UPDATED = 'ACCOUNT_UPDATED',
  SHUFTIPRO_SENT = 'SHUFTIPRO_SENT',
  ATTACHMENT_ADDED = 'ATTACHMENT_ADDED',
  TRADING_ACCOUNT_READ_ONLY_UPDATED = 'TRADING_ACCOUNT_READ_ONLY_UPDATED',
  NOTE_CREATED = 'NOTE_CREATED',
  NOTE_REMOVED = 'NOTE_REMOVED',
  NOTE_UPDATED = 'NOTE_UPDATED',
  CREDIT_IN = 'CREDIT_IN',
  CREDIT_OUT = 'CREDIT_OUT',
  CORRECTION_IN = 'CORRECTION_IN',
  CORRECTION_OUT = 'CORRECTION_OUT',
  ACCOUNT_ENABLED_CHANGED = 'ACCOUNT_ENABLED_CHANGED',
  DEPOSIT = 'DEPOSIT',
  TRADING_ACCOUNT_CREATED = 'TRADING_ACCOUNT_CREATED',
  CHANGE_LEVERAGE_REQUEST_CREATED = 'CHANGE_LEVERAGE_REQUEST_CREATED',
  CHANGE_LEVERAGE_REQUEST_UPDATED = 'CHANGE_LEVERAGE_REQUEST_UPDATED',
  WITHDRAW = 'WITHDRAW',
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  FEE = 'FEE',
  INACTIVITY_FEE = 'INACTIVITY_FEE',
  TRADING_ACCOUNT_NAME_UPDATED = 'TRADING_ACCOUNT_NAME_UPDATED',
  TRADING_ACCOUNT_ARCHIVED = 'TRADING_ACCOUNT_ARCHIVED',
  TRADING_ACCOUNT_LEVERAGE_UPDATED = 'TRADING_ACCOUNT_LEVERAGE_UPDATED',
  INTEREST_RATE = 'INTEREST_RATE',
  PROFILE_ACQUISITION_UPDATED = 'PROFILE_ACQUISITION_UPDATED',
  ACQUISITION_UPDATED = 'ACQUISITION_UPDATED',
  EMAIL_SENT = 'EMAIL_SENT',
  MARKET_ORDER_CREATED = 'MARKET_ORDER_CREATED',
  PENDING_ORDER_CREATED = 'PENDING_ORDER_CREATED',
  ORDER_UPDATED = 'ORDER_UPDATED',
  ORDER_CANCELED = 'ORDER_CANCELED',
  ORDER_CLOSED = 'ORDER_CLOSED',
  CDE_RULE_CREATED = 'CDE_RULE_CREATED',
  CDE_RULE_UPDATED = 'CDE_RULE_UPDATED',
  WHITELIST_IP_CREATED = 'WHITELIST_IP_CREATED',
  WHITELIST_IP_DELETED = 'WHITELIST_IP_DELETED',
  WHITELIST_IP_UPDATED = 'WHITELIST_IP_UPDATED',
  PLAYER_PROFILE_DEPOSIT_AVAILABILITY_CHANGED = 'PLAYER_PROFILE_DEPOSIT_AVAILABILITY_CHANGED',
  TRADING_ACCOUNT_STATUS_CHANGED = 'TRADING_ACCOUNT_STATUS_CHANGED',
  OPERATOR_AUTHORITY_ADDED = 'OPERATOR_AUTHORITY_ADDED',
  OPERATOR_AUTHORITY_DELETED = 'OPERATOR_AUTHORITY_DELETED',
  OPERATOR_TYPE_UPDATED = 'OPERATOR_TYPE_UPDATED',
  OPERATOR_BRANCH_ADDED = 'OPERATOR_BRANCH_ADDED',
  OPERATOR_BRANCH_DELETED = 'OPERATOR_BRANCH_DELETED',
  LEAD_CREATED = 'LEAD_CREATED',
}

export const typesLabels: Record<string, string> = {
  [types.AFFILIATE_ACCOUNT_CREATED]: 'CONSTANTS.AUDIT.TYPES.AFFILIATE_ACCOUNT_CREATED',
  [types.AFFILIATE_STATUS_UPDATED]: 'CONSTANTS.AUDIT.TYPES.AFFILIATE_STATUS_UPDATED',
  [types.AFFILIATE_UPDATED]: 'CONSTANTS.AUDIT.TYPES.AFFILIATE_UPDATED',
  [types.AFFILIATE_FTD_CREATED]: 'CONSTANTS.AUDIT.TYPES.AFFILIATE_FTD_CREATED',
  [types.AFFILIATE_FTD_UPDATED]: 'CONSTANTS.AUDIT.TYPES.AFFILIATE_FTD_UPDATED',
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
  [types.ACCOUNT_UPDATED]: 'CONSTANTS.AUDIT.TYPES.ACCOUNT_UPDATED',
  [types.SHUFTIPRO_SENT]: 'CONSTANTS.AUDIT.TYPES.SHUFTIPRO_SENT',
  [types.ATTACHMENT_ADDED]: 'CONSTANTS.AUDIT.TYPES.ATTACHMENT_ADDED',
  [types.TRADING_ACCOUNT_READ_ONLY_UPDATED]: 'CONSTANTS.AUDIT.TYPES.TRADING_ACCOUNT_READ_ONLY_UPDATED',
  [types.NOTE_CREATED]: 'CONSTANTS.AUDIT.TYPES.NOTE_CREATED',
  [types.NOTE_REMOVED]: 'CONSTANTS.AUDIT.TYPES.NOTE_REMOVED',
  [types.NOTE_UPDATED]: 'CONSTANTS.AUDIT.TYPES.NOTE_UPDATED',
  [types.CREDIT_IN]: 'CONSTANTS.AUDIT.TYPES.CREDIT_IN',
  [types.CREDIT_OUT]: 'CONSTANTS.AUDIT.TYPES.CREDIT_OUT',
  [types.CORRECTION_IN]: 'CONSTANTS.AUDIT.TYPES.CORRECTION_IN',
  [types.CORRECTION_OUT]: 'CONSTANTS.AUDIT.TYPES.CORRECTION_OUT',
  [types.ACCOUNT_ENABLED_CHANGED]: 'CONSTANTS.AUDIT.TYPES.ACCOUNT_ENABLED_CHANGED',
  [types.DEPOSIT]: 'CONSTANTS.AUDIT.TYPES.DEPOSIT',
  [types.TRADING_ACCOUNT_CREATED]: 'CONSTANTS.AUDIT.TYPES.TRADING_ACCOUNT_CREATED',
  [types.CHANGE_LEVERAGE_REQUEST_CREATED]: 'CONSTANTS.AUDIT.TYPES.CHANGE_LEVERAGE_REQUEST_CREATED',
  [types.CHANGE_LEVERAGE_REQUEST_UPDATED]: 'CONSTANTS.AUDIT.TYPES.CHANGE_LEVERAGE_REQUEST_UPDATED',
  [types.WITHDRAW]: 'CONSTANTS.AUDIT.TYPES.WITHDRAW',
  [types.TRANSFER_IN]: 'CONSTANTS.AUDIT.TYPES.TRANSFER_IN',
  [types.TRANSFER_OUT]: 'CONSTANTS.AUDIT.TYPES.TRANSFER_OUT',
  [types.FEE]: 'CONSTANTS.AUDIT.TYPES.FEE',
  [types.INACTIVITY_FEE]: 'CONSTANTS.AUDIT.TYPES.INACTIVITY_FEE',
  [types.TRADING_ACCOUNT_NAME_UPDATED]: 'CONSTANTS.AUDIT.TYPES.TRADING_ACCOUNT_NAME_UPDATED',
  [types.TRADING_ACCOUNT_ARCHIVED]: 'CONSTANTS.AUDIT.TYPES.TRADING_ACCOUNT_ARCHIVED',
  [types.TRADING_ACCOUNT_LEVERAGE_UPDATED]: 'CONSTANTS.AUDIT.TYPES.TRADING_ACCOUNT_LEVERAGE_UPDATED',
  [types.INTEREST_RATE]: 'CONSTANTS.AUDIT.TYPES.INTEREST_RATE',
  [types.PROFILE_ACQUISITION_UPDATED]: 'CONSTANTS.AUDIT.TYPES.PROFILE_ACQUISITION_UPDATED',
  [types.ACQUISITION_UPDATED]: 'CONSTANTS.AUDIT.TYPES.ACQUISITION_UPDATED',
  [types.EMAIL_SENT]: 'CONSTANTS.AUDIT.TYPES.EMAIL_SENT',
  [types.CDE_RULE_CREATED]: 'CONSTANTS.AUDIT.TYPES.CDE_RULE_CREATED_EVENT',
  [types.CDE_RULE_UPDATED]: 'CONSTANTS.AUDIT.TYPES.CDE_RULE_UPDATED_EVENT',
  [types.MARKET_ORDER_CREATED]: 'CONSTANTS.AUDIT.TYPES.MARKET_ORDER_CREATED',
  [types.PENDING_ORDER_CREATED]: 'CONSTANTS.AUDIT.TYPES.PENDING_ORDER_CREATED',
  [types.ORDER_UPDATED]: 'CONSTANTS.AUDIT.TYPES.ORDER_UPDATED',
  [types.ORDER_CANCELED]: 'CONSTANTS.AUDIT.TYPES.ORDER_CANCELED',
  [types.ORDER_CLOSED]: 'CONSTANTS.AUDIT.TYPES.ORDER_CLOSED',
  [types.WHITELIST_IP_CREATED]: 'CONSTANTS.AUDIT.TYPES.WHITELIST_IP_CREATED',
  [types.WHITELIST_IP_DELETED]: 'CONSTANTS.AUDIT.TYPES.WHITELIST_IP_DELETED',
  [types.WHITELIST_IP_UPDATED]: 'CONSTANTS.AUDIT.TYPES.WHITELIST_IP_UPDATED',
  [types.PLAYER_PROFILE_DEPOSIT_AVAILABILITY_CHANGED]:
    'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_DEPOSIT_AVAILABILITY_CHANGED',
  [types.TRADING_ACCOUNT_STATUS_CHANGED]: 'CONSTANTS.AUDIT.TYPES.TRADING_ACCOUNT_STATUS_CHANGED',
  [types.OPERATOR_AUTHORITY_ADDED]: 'CONSTANTS.AUDIT.TYPES.OPERATOR_AUTHORITY_ADDED',
  [types.OPERATOR_AUTHORITY_DELETED]: 'CONSTANTS.AUDIT.TYPES.OPERATOR_AUTHORITY_DELETED',
  [types.OPERATOR_TYPE_UPDATED]: 'CONSTANTS.AUDIT.TYPES.OPERATOR_TYPE_UPDATED',
  [types.OPERATOR_BRANCH_ADDED]: 'CONSTANTS.AUDIT.TYPES.OPERATOR_BRANCH_ADDED',
  [types.OPERATOR_BRANCH_DELETED]: 'CONSTANTS.AUDIT.TYPES.OPERATOR_BRANCH_DELETED',
  [types.LEAD_CREATED]: 'CONSTANTS.AUDIT.TYPES.LEAD_CREATED',
};