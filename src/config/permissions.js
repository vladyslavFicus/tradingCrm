export default {
  OPERATORS: {
    OPERATORS_LIST_VIEW: 'operator;GET;/operators',
    PROFILE_VIEW: 'operator;GET;/operators/{uuid}',
    CREATE: 'operator;POST;/operators',
    OPERATOR_SEND_INVITATION: 'operator;PUT;/operators/{uuid}/send/invitation',
    ADD_AUTHORITY: 'auth;POST;/credentials/{uuid}/authorities',
    DELETE_AUTHORITY: 'auth;DELETE;/credentials/{uuid}/authorities',
    UPDATE_PROFILE: 'operator;PUT;/operators/{uuid}',
    RESET_PASSWORD: 'auth;POST;/password/{brand}/{uuid}/reset/request',
    UPDATE_STATUS: 'operator;PUT;/operators/status',
    CHANGE_PASSWORD: 'auth;POST;/credentials/operator/{uuid}/password',
  },
  PARTNERS: {
    PARTNERS_LIST_VIEW: 'affiliate;POST;/affiliates/search',
    PROFILE_VIEW: 'affiliate;GET;/affiliates/{uuid}',
    CREATE: 'affiliate;POST;/affiliates',
    ADD_AUTHORITY: 'auth;POST;/credentials/{uuid}/authorities',
    DELETE_AUTHORITY: 'auth;DELETE;/credentials/{uuid}/authorities',
    UPDATE_PROFILE: 'affiliate;PUT;/affiliates/{uuid}/status',
    RESET_PASSWORD: 'auth;POST;/password/{brand}/{uuid}/reset/request',
    UPDATE_STATUS: 'affiliate;PUT;/affiliate/affiliates/status',
    CHANGE_PASSWORD: 'auth;POST;/credentials/affiliate/affiliates/{uuid}/password',
  },
  LEADS: {
    GET_LEADS: 'lead;POST;/leads/search',
    GET_LEAD_BY_ID: 'lead;GET;/lead/{id}',
  },
  HIERARCHY: {
    GET_TREE: 'hierarchy;GET;/branch/hierarchy/{uuid}',
    GET_DESKS: 'hierarchy;POST;/branch/hierarchy/user/{uuid}/desk',
    GET_TEAMS: 'hierarchy;POST;/branch/hierarchy/user/{uuid}/team',
    GET_OFFICES: 'hierarchy;POST;/branch/hierarchy/user/{uuid}/office',
    GET_OPERATORS: 'hierarchy;GET;/user/{uuid}/operators',
    GET_AFFILIATE_PARTNERS: 'hierarchy;GET;/user/{uuid}/affiliate-partners',
    GET_BRANCH_BY_ID: 'hierarchy;GET;/branch/{uuid}',
    CREATE_BRANCH: 'hierarchy-updater;POST;/branch',
  },
  SALES_RULES: {
    GET_RULES: 'rules-profile;GET;/',
  },
  USER_PROFILE: {
    GET_RESET_PASSWORD_TOKEN: 'auth;GET;/password/reset-token?playerUUID={playerUUID}',
    SUSPEND: 'profile;PUT;/profiles/{playerUUID}/suspend',
    STATUS: 'profile;PUT;/admin/profiles/{uuid}/status',
    PROLONG: 'profile;PUT;/profiles/{playerUUID}/suspend/prolong',
    REMOVE: 'profile;PUT;/profiles/{playerUUID}/resume',
    PROFILE_VIEW: 'profile;GET;/admin/profiles/{uuid}',
    PROFILE_DEVICES_VIEW: 'profile;GET;/profiles/{playerUUID}/devices',
    PROFILES_LIST: 'profile;GET;/profiles',
    ADD_TO_CAMPAIGN: 'promotion;PUT;/campaigns/{id}/players-list/{playerUUID}',
    ADD_PROMO_CODE_TO_PLAYER: 'promotion;PUT;/campaigns/{playerUUID}/by-promo-code/{promoCode}',
    ADD_TAG: 'profile;POST;/profiles/{playerUUID}/tags',
    DELETE_TAG: 'profile;DELETE;/profiles/{playerUUID}/tags/{tagId}',
    UNLOCK_LOGIN: 'auth;DELETE;/credentials/{playerUUID}/lock',
    GET_LOGIN_LOCK: 'auth;GET;/credentials/{uuid}/lock',
    UPDATE_MARKETING_SETTINGS: 'profile;PUT;/profiles/{playerUUID}/subscription',
    REQUEST_KYC: 'profile;POST;/kyc/{playerUUID}/request',
    KYC_VERIFY_ALL: 'profile;POST;/kyc/{playerUUID}/verify',
    KYC_VERIFY: 'profile;POST;/kyc/{playerUUID}/{type}/verify',
    KYC_REJECT: 'profile;DELETE;/kyc/{playerUUID}/{type}',
    UPDATE_PROFILE: 'profile;PUT;/profiles/{playerUUID}',
    UPDATE_PERSONAL_INFORMATION: 'profile;PUT;/admin/profiles/{uuid}/personal-information',
    UPDATE_ADDRESS: 'profile;PUT;/admin/profiles/{uuid}/address',
    UPDATE_CONTACTS: 'profile;PUT;/admin/profiles/{uuid}/contacts',
    UPDATE_EMAIL: 'profile;PUT;/profiles/{playerUUID}/email',
    VIEW_FILES: 'profile;GET;/files/{playerUUID}',
    VIEW_FILE: 'profile;GET;/kyc/download/{fileId}',
    KYC_LIST: 'profile;GET;/kyc/requests',
    UPLOAD_FILE: 'profile;POST;/files',
    VERIFY_FILE: 'profile;PUT;files/{uuid}/status/verify',
    REFUSE_FILE: 'profile;DELETE;files/{uuid}/status/refuse',
    DELETE_FILE: 'profile;DELETE;/files/{playerUUID}/{fileUUID}',
    VERIFY_PHONE: 'profile;POST;/admin/profiles/{uuid}/verification/phone',
    VERIFY_EMAIL: 'profile;POST;/admin/profiles/{uuid}/verification/email',
    CHANGE_PASSWORD: 'auth;POST;/credentials/{uuid}/password',
    MARK_IS_TEST: 'profile;POST;/profiles/{playerUUID}/is-test',
    CHANGE_ACQUISITION_STATUS: 'hierarchy-updater;PUT;/bulk/user/relationship/parent-user',
    CHANGE_CONFIGURATION: 'profile;PUT;/admin/profiles/{uuid}/configuration',
  },
  FILES: {
    UPLOAD_FILE: 'profile;POST;/files/confirm/{playerUUID}',
  },
  PAYMENT: {
    DEPOSIT: 'payment;POST;/deposit',
    WITHDRAW: 'payment;POST;/withdraw',
    CREDIT_IN: 'payment;POST;/credit_in',
    CREDIT_OUT: 'payment;POST;/credit_out',
    TRANSFER: 'payment;POST;/transfer',
    APPROVE: 'payment;PUT;/approve',
    REJECT: 'payment;PUT;/reject',
    CHANGE_STATUS: 'payment;PUT;/{paymentId}/status',
    CHANGE_METHOD: 'payment;PUT;/{paymentId}/method',
  },
  PAYMENTS: {
    PLAYER_PAYMENTS_LIST: 'payment;POST;/search',
  },
  AUDIT: {
    PLAYER_AUDIT_LOGS: 'audit;GET;/audit/logs/{playerUUID}',
  },
  TRADING_ACTIVITY: {
    CLIENT_TRADING_ACTIVITY: 'trading-activity;GET;/',
  },
  TRADING_ACCOUNT: {
    CREATE: 'mt4-updater;POST;/user',
    UPDATE_PASSWORD: 'mt4-updater;PUT;/user/password',
  },
  NOTES: {
    ADD_NOTE: 'note;POST;/',
    VIEW_NOTES: 'note;POST;/search',
    UPDATE_NOTE: 'note;PUT;/{noteId}',
    DELETE_NOTE: 'note;DELETE;/{noteId}',
  },
};
