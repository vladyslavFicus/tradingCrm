export enum auditTypes {
  AFFILIATE_ACCOUNT_CREATED = 'AFFILIATE_ACCOUNT_CREATED',
  AFFILIATE_STATUS_UPDATED = 'AFFILIATE_STATUS_UPDATED',
  AFFILIATE_UPDATED = 'AFFILIATE_UPDATED',
  AFFILIATE_FTD_CREATED = 'AFFILIATE_FTD_CREATED',
  AFFILIATE_FTD_UPDATED = 'AFFILIATE_FTD_UPDATED',
  BRAND_DOCUMENT_ADDED = 'BRAND_DOCUMENT_ADDED',
  BRAND_DOCUMENT_DELETED = 'BRAND_DOCUMENT_DELETED',
  BRAND_DOCUMENT_UPDATED = 'BRAND_DOCUMENT_UPDATED',
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
  CDE_MIGRATION_STARTED= 'CDE_MIGRATION_STARTED',
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
  FAVOURITE_PAYMENT_SYSTEM_ADDED = 'FAVOURITE_PAYMENT_SYSTEM_ADDED',
  FAVOURITE_PAYMENT_SYSTEM_DELETED = 'FAVOURITE_PAYMENT_SYSTEM_DELETED'
}

export const auditTypesLabels: Record<string, string> = {
  [auditTypes.AFFILIATE_ACCOUNT_CREATED]: 'CONSTANTS.AUDIT.TYPES.AFFILIATE_ACCOUNT_CREATED',
  [auditTypes.AFFILIATE_STATUS_UPDATED]: 'CONSTANTS.AUDIT.TYPES.AFFILIATE_STATUS_UPDATED',
  [auditTypes.AFFILIATE_UPDATED]: 'CONSTANTS.AUDIT.TYPES.AFFILIATE_UPDATED',
  [auditTypes.AFFILIATE_FTD_CREATED]: 'CONSTANTS.AUDIT.TYPES.AFFILIATE_FTD_CREATED',
  [auditTypes.AFFILIATE_FTD_UPDATED]: 'CONSTANTS.AUDIT.TYPES.AFFILIATE_FTD_UPDATED',
  [auditTypes.BRAND_DOCUMENT_ADDED]: 'CONSTANTS.AUDIT.TYPES.BRAND_DOCUMENT_ADDED',
  [auditTypes.BRAND_DOCUMENT_DELETED]: 'CONSTANTS.AUDIT.TYPES.BRAND_DOCUMENT_DELETED',
  [auditTypes.BRAND_DOCUMENT_UPDATED]: 'CONSTANTS.AUDIT.TYPES.BRAND_DOCUMENT_UPDATED',
  [auditTypes.LOG_IN]: 'CONSTANTS.AUDIT.TYPES.LOG_IN',
  [auditTypes.LOG_OUT]: 'CONSTANTS.AUDIT.TYPES.LOG_OUT',
  [auditTypes.PLAYER_PROFILE_VERIFIED_EMAIL]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_VERIFIED_EMAIL',
  [auditTypes.PLAYER_PROFILE_VERIFIED_PHONE]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_VERIFIED_PHONE',
  [auditTypes.KYC_ADDRESS_REFUSED]: 'CONSTANTS.AUDIT.TYPES.KYC_ADDRESS_REFUSED',
  [auditTypes.KYC_ADDRESS_VERIFIED]: 'CONSTANTS.AUDIT.TYPES.KYC_ADDRESS_VERIFIED',
  [auditTypes.KYC_PERSONAL_REFUSED]: 'CONSTANTS.AUDIT.TYPES.KYC_PERSONAL_REFUSED',
  [auditTypes.KYC_PERSONAL_VERIFIED]: 'CONSTANTS.AUDIT.TYPES.KYC_PERSONAL_VERIFIED',
  [auditTypes.PLAYER_PROFILE_KYC_CHANGED]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_KYC_CHANGED',
  [auditTypes.PLAYER_PROFILE_ACQUISITION_CHANGED]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_ACQUISITION_CHANGED',
  [auditTypes.PLAYER_PROFILE_REGISTERED]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_REGISTERED',
  [auditTypes.PLAYER_PROFILE_CHANGED]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_CHANGED',
  [auditTypes.PLAYER_PROFILE_STATUS_CHANGED]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_STATUS_CHANGED',
  [auditTypes.PLAYER_PROFILE_SEARCH]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_SEARCH',
  [auditTypes.PLAYER_PROFILE_VIEWED]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_VIEWED',
  [auditTypes.NEW_OPERATOR_ACCOUNT_CREATED]: 'CONSTANTS.AUDIT.TYPES.NEW_OPERATOR_ACCOUNT_CREATED',
  [auditTypes.OPERATOR_ACCOUNT_CREATED]: 'CONSTANTS.AUDIT.TYPES.OPERATOR_ACCOUNT_CREATED',
  [auditTypes.FAILED_LOGIN_ATTEMPT]: 'CONSTANTS.AUDIT.TYPES.FAILED_LOGIN_ATTEMPT',
  [auditTypes.KYC_REQUESTED]: 'CONSTANTS.AUDIT.TYPES.KYC_REQUESTED',
  [auditTypes.KYC_CONFIRMATION]: 'CONSTANTS.AUDIT.TYPES.KYC_CONFIRMATION',
  [auditTypes.ROFUS_VERIFICATION]: 'CONSTANTS.AUDIT.TYPES.ROFUS_VERIFICATION',
  [auditTypes.PLAYER_PROFILE_BLOCKED]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_BLOCKED',
  [auditTypes.PLAYER_PROFILE_UNBLOCKED]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_UNBLOCKED',
  [auditTypes.RESET_PASSWORD]: 'CONSTANTS.AUDIT.TYPES.RESET_PASSWORD',
  [auditTypes.CHANGE_PASSWORD]: 'CONSTANTS.AUDIT.TYPES.CHANGE_PASSWORD',
  [auditTypes.NEM_ID_SIGN_IN]: 'CONSTANTS.AUDIT.TYPES.NEM_ID_SIGN_IN',
  [auditTypes.PLAYER_PROFILE_SELF_EXCLUDED]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_STATUS_CHANGED',
  [auditTypes.PLAYER_PROFILE_SELF_EXCLUSION_COOLOFF]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_STATUS_CHANGED',
  [auditTypes.PLAYER_PROFILE_RESUMED]: 'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_STATUS_CHANGED',
  [auditTypes.ACCEPTED_TERMS]: 'CONSTANTS.AUDIT.TYPES.ACCEPTED_TERMS',
  [auditTypes.PROFILE_ASSIGN]: 'CONSTANTS.AUDIT.TYPES.PROFILE_ASSIGN',
  [auditTypes.CHANGE_LEVERAGE_REQUESTED]: 'CONSTANTS.AUDIT.TYPES.CHANGE_LEVERAGE_REQUESTED',
  [auditTypes.RISK_PROFILE_DATA_CREATED]: 'CONSTANTS.AUDIT.TYPES.RISK_PROFILE_DATA_CREATED',
  [auditTypes.PLAYER_PROFILE_TRANSFER_AVAILABILITY_CHANGED]:
    'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_TRANSFER_AVAILABILITY_CHANGED',
  [auditTypes.ACCOUNT_CREATED]: 'CONSTANTS.AUDIT.TYPES.ACCOUNT_CREATED',
  [auditTypes.ACCOUNT_UPDATED]: 'CONSTANTS.AUDIT.TYPES.ACCOUNT_UPDATED',
  [auditTypes.SHUFTIPRO_SENT]: 'CONSTANTS.AUDIT.TYPES.SHUFTIPRO_SENT',
  [auditTypes.ATTACHMENT_ADDED]: 'CONSTANTS.AUDIT.TYPES.ATTACHMENT_ADDED',
  [auditTypes.TRADING_ACCOUNT_READ_ONLY_UPDATED]: 'CONSTANTS.AUDIT.TYPES.TRADING_ACCOUNT_READ_ONLY_UPDATED',
  [auditTypes.NOTE_CREATED]: 'CONSTANTS.AUDIT.TYPES.NOTE_CREATED',
  [auditTypes.NOTE_REMOVED]: 'CONSTANTS.AUDIT.TYPES.NOTE_REMOVED',
  [auditTypes.NOTE_UPDATED]: 'CONSTANTS.AUDIT.TYPES.NOTE_UPDATED',
  [auditTypes.CREDIT_IN]: 'CONSTANTS.AUDIT.TYPES.CREDIT_IN',
  [auditTypes.CREDIT_OUT]: 'CONSTANTS.AUDIT.TYPES.CREDIT_OUT',
  [auditTypes.CORRECTION_IN]: 'CONSTANTS.AUDIT.TYPES.CORRECTION_IN',
  [auditTypes.CORRECTION_OUT]: 'CONSTANTS.AUDIT.TYPES.CORRECTION_OUT',
  [auditTypes.ACCOUNT_ENABLED_CHANGED]: 'CONSTANTS.AUDIT.TYPES.ACCOUNT_ENABLED_CHANGED',
  [auditTypes.DEPOSIT]: 'CONSTANTS.AUDIT.TYPES.DEPOSIT',
  [auditTypes.TRADING_ACCOUNT_CREATED]: 'CONSTANTS.AUDIT.TYPES.TRADING_ACCOUNT_CREATED',
  [auditTypes.CHANGE_LEVERAGE_REQUEST_CREATED]: 'CONSTANTS.AUDIT.TYPES.CHANGE_LEVERAGE_REQUEST_CREATED',
  [auditTypes.CHANGE_LEVERAGE_REQUEST_UPDATED]: 'CONSTANTS.AUDIT.TYPES.CHANGE_LEVERAGE_REQUEST_UPDATED',
  [auditTypes.WITHDRAW]: 'CONSTANTS.AUDIT.TYPES.WITHDRAW',
  [auditTypes.TRANSFER_IN]: 'CONSTANTS.AUDIT.TYPES.TRANSFER_IN',
  [auditTypes.TRANSFER_OUT]: 'CONSTANTS.AUDIT.TYPES.TRANSFER_OUT',
  [auditTypes.FEE]: 'CONSTANTS.AUDIT.TYPES.FEE',
  [auditTypes.INACTIVITY_FEE]: 'CONSTANTS.AUDIT.TYPES.INACTIVITY_FEE',
  [auditTypes.TRADING_ACCOUNT_NAME_UPDATED]: 'CONSTANTS.AUDIT.TYPES.TRADING_ACCOUNT_NAME_UPDATED',
  [auditTypes.TRADING_ACCOUNT_ARCHIVED]: 'CONSTANTS.AUDIT.TYPES.TRADING_ACCOUNT_ARCHIVED',
  [auditTypes.TRADING_ACCOUNT_LEVERAGE_UPDATED]: 'CONSTANTS.AUDIT.TYPES.TRADING_ACCOUNT_LEVERAGE_UPDATED',
  [auditTypes.INTEREST_RATE]: 'CONSTANTS.AUDIT.TYPES.INTEREST_RATE',
  [auditTypes.PROFILE_ACQUISITION_UPDATED]: 'CONSTANTS.AUDIT.TYPES.PROFILE_ACQUISITION_UPDATED',
  [auditTypes.ACQUISITION_UPDATED]: 'CONSTANTS.AUDIT.TYPES.ACQUISITION_UPDATED',
  [auditTypes.EMAIL_SENT]: 'CONSTANTS.AUDIT.TYPES.EMAIL_SENT',
  [auditTypes.CDE_RULE_CREATED]: 'CONSTANTS.AUDIT.TYPES.CDE_RULE_CREATED_EVENT',
  [auditTypes.CDE_RULE_UPDATED]: 'CONSTANTS.AUDIT.TYPES.CDE_RULE_UPDATED_EVENT',
  [auditTypes.CDE_MIGRATION_STARTED]: 'CONSTANTS.AUDIT.TYPES.CDE_MIGRATION_STARTED',
  [auditTypes.MARKET_ORDER_CREATED]: 'CONSTANTS.AUDIT.TYPES.MARKET_ORDER_CREATED',
  [auditTypes.PENDING_ORDER_CREATED]: 'CONSTANTS.AUDIT.TYPES.PENDING_ORDER_CREATED',
  [auditTypes.ORDER_UPDATED]: 'CONSTANTS.AUDIT.TYPES.ORDER_UPDATED',
  [auditTypes.ORDER_CANCELED]: 'CONSTANTS.AUDIT.TYPES.ORDER_CANCELED',
  [auditTypes.ORDER_CLOSED]: 'CONSTANTS.AUDIT.TYPES.ORDER_CLOSED',
  [auditTypes.WHITELIST_IP_CREATED]: 'CONSTANTS.AUDIT.TYPES.WHITELIST_IP_CREATED',
  [auditTypes.WHITELIST_IP_DELETED]: 'CONSTANTS.AUDIT.TYPES.WHITELIST_IP_DELETED',
  [auditTypes.WHITELIST_IP_UPDATED]: 'CONSTANTS.AUDIT.TYPES.WHITELIST_IP_UPDATED',
  [auditTypes.PLAYER_PROFILE_DEPOSIT_AVAILABILITY_CHANGED]:
    'CONSTANTS.AUDIT.TYPES.PLAYER_PROFILE_DEPOSIT_AVAILABILITY_CHANGED',
  [auditTypes.TRADING_ACCOUNT_STATUS_CHANGED]: 'CONSTANTS.AUDIT.TYPES.TRADING_ACCOUNT_STATUS_CHANGED',
  [auditTypes.OPERATOR_AUTHORITY_ADDED]: 'CONSTANTS.AUDIT.TYPES.OPERATOR_AUTHORITY_ADDED',
  [auditTypes.OPERATOR_AUTHORITY_DELETED]: 'CONSTANTS.AUDIT.TYPES.OPERATOR_AUTHORITY_DELETED',
  [auditTypes.OPERATOR_TYPE_UPDATED]: 'CONSTANTS.AUDIT.TYPES.OPERATOR_TYPE_UPDATED',
  [auditTypes.OPERATOR_BRANCH_ADDED]: 'CONSTANTS.AUDIT.TYPES.OPERATOR_BRANCH_ADDED',
  [auditTypes.OPERATOR_BRANCH_DELETED]: 'CONSTANTS.AUDIT.TYPES.OPERATOR_BRANCH_DELETED',
  [auditTypes.LEAD_CREATED]: 'CONSTANTS.AUDIT.TYPES.LEAD_CREATED',
  [auditTypes.FAVOURITE_PAYMENT_SYSTEM_ADDED]: 'CONSTANTS.AUDIT.TYPES.FAVOURITE_PAYMENT_SYSTEM_ADDED',
  [auditTypes.FAVOURITE_PAYMENT_SYSTEM_DELETED]: 'CONSTANTS.AUDIT.TYPES.FAVOURITE_PAYMENT_SYSTEM_DELETED',
};
