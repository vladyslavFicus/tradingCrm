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
  },
  LEADS: {
    GET_LEADS: 'trading_lead;POST;/leads/search',
    GET_LEAD_BY_ID: 'trading_lead;GET;/lead/{id}',
  },
  HIERARCHY: {
    GET_TREE: 'trading_hierarchy;GET;/branch/hierarchy/{uuid}',
    GET_DESKS: 'trading_hierarchy;POST;/branch/hierarchy/user/{uuid}/desk',
    GET_TEAMS: 'trading_hierarchy;POST;/branch/hierarchy/user/{uuid}/team',
    GET_OFFICES: 'trading_hierarchy;POST;/branch/hierarchy/user/{uuid}/office',
    GET_OPERATORS: 'trading_hierarchy;GET;/user/{uuid}/operators',
    GET_AFFILIATE_PARTNERS: 'trading_hierarchy;GET;/user/{uuid}/affiliate-partners',
    GET_BRANCH_BY_ID: 'trading_hierarchy;GET;/branch/{uuid}',
    CREATE_BRANCH: 'trading_hierarchy_updater;POST;/branch',
  },
  USER_PROFILE: {
    SEND_ACTIVATION_LINK: 'profile;POST;/profiles/{playerUUID}/send-activation-link',
    GET_RESET_PASSWORD_TOKEN: 'auth;GET;/password/reset-token?playerUUID={playerUUID}',
    SUSPEND: 'profile;PUT;/profiles/{playerUUID}/suspend',
    BLOCK: 'profile;PUT;/profiles/{playerUUID}/block',
    UNBLOCK: 'profile;PUT;/profiles/{playerUUID}/unblock',
    PROLONG: 'profile;PUT;/profiles/{playerUUID}/suspend/prolong',
    REMOVE: 'profile;PUT;/profiles/{playerUUID}/resume',
    PROFILE_VIEW: 'profile;GET;/profiles/{playerUUID}',
    PROFILE_DEVICES_VIEW: 'profile;GET;/profiles/{playerUUID}/devices',
    PROFILES_LIST: 'profile;GET;/profiles',
    ADD_TO_CAMPAIGN: 'promotion;PUT;/campaigns/{id}/players-list/{playerUUID}',
    ADD_PROMO_CODE_TO_PLAYER: 'promotion;PUT;/campaigns/{playerUUID}/by-promo-code/{promoCode}',
    ADD_TAG: 'profile;POST;/profiles/{playerUUID}/tags',
    DELETE_TAG: 'profile;DELETE;/profiles/{playerUUID}/tags/{tagId}',
    LOCK_DEPOSIT: 'payment;POST;/lock/deposit',
    LOCK_WITHDRAW: 'payment;POST;/lock/withdraw',
    UNLOCK_DEPOSIT: 'payment;POST;/lock/{playerUUID}/deposit',
    UNLOCK_WITHDRAW: 'payment;POST;/lock/{playerUUID}/withdraw',
    UNLOCK_LOGIN: 'auth;DELETE;/credentials/{playerUUID}/lock',
    GET_LOGIN_LOCK: 'auth;GET;/credentials/{uuid}/lock',
    GET_PAYMENT_LOCKS: 'payment;GET;/lock/{uuid}',
    UPDATE_MARKETING_SETTINGS: 'profile;PUT;/profiles/{playerUUID}/subscription',
    REQUEST_KYC: 'profile;POST;/kyc/{playerUUID}/request',
    KYC_VERIFY_ALL: 'profile;POST;/kyc/{playerUUID}/verify',
    KYC_VERIFY: 'profile;POST;/kyc/{playerUUID}/{type}/verify',
    KYC_REJECT: 'profile;DELETE;/kyc/{playerUUID}/{type}',
    UPDATE_PROFILE: 'profile;PUT;/profiles/{playerUUID}',
    UPDATE_EMAIL: 'profile;PUT;/profiles/{playerUUID}/email',
    VIEW_FILES: 'profile;GET;/files/{playerUUID}',
    VIEW_FILE: 'profile;GET;/kyc/download/{fileId}',
    KYC_LIST: 'profile;GET;/kyc/requests',
    UPLOAD_FILE: 'profile;POST;/files',
    VERIFY_FILE: 'profile;PUT;files/{uuid}/status/verify',
    REFUSE_FILE: 'profile;DELETE;files/{uuid}/status/refuse',
    DELETE_FILE: 'profile;DELETE;/files/{playerUUID}/{fileUUID}',
    VERIFY_PHONE: 'profile;POST;/verification/{playerUUID}/phone',
    VERIFY_EMAIL: 'profile;POST;/verification/{playerUUID}/email',
    CHANGE_PASSWORD: 'auth;POST;/credentials/{uuid}/password',
    MARK_IS_TEST: 'profile;POST;/profiles/{playerUUID}/is-test',
    CHANGE_ACQUISITION_STATUS: 'trading_hierarchy_updater;PUT;/bulk/user/relationship/parent-user',
    CHANGE_FATCA_STATUS: 'trading_profile;PUT;/regulated',
  },
  FILES: {
    UPLOAD_FILE: 'profile;POST;/files/confirm/{playerUUID}',
  },
  PAYMENT: {
    PLAYER_ACCOUNT_LIST: 'payment;GET;/accounts/{playerUUID}',
    PAYMENT_METHODS_LIST: 'payment;GET;/methods',
    ACCOUNT_LOCK: 'payment;PUT;/accounts/{paymentAccountUUID}/lock',
    DEPOSIT: 'trading_payment;POST;/deposit',
    WITHDRAW: 'trading_payment;POST;/withdraw',
    CREDIT_IN: 'trading_payment;POST;/credit_in',
    CREDIT_OUT: 'trading_payment;POST;/credit_out',
    TRANSFER: 'trading_payment;POST;/transfer',
    APPROVE: 'trading_payment;PUT;/approve',
    REJECT: 'trading_payment;PUT;/reject',
    CHANGE_STATUS: 'trading_payment;PUT;/{paymentId}/status',
    CHANGE_METHOD: 'trading_payment;PUT;/{paymentId}/method',
  },
  PAYMENT_VIEW: {
    PAYMENT_REPORT: 'payment_view;GET;/payments/payment_report',
  },
  PAYMENTS: {
    PLAYER_PAYMENTS_LIST: 'payment;GET;/payments/{playerUUID}',
    LIST: 'payment;GET;/payments',
    APPROVE_WITHDRAW: 'payment;POST;/payments/{playerUUID}/{paymentId}/approve',
    REFUSE_WITHDRAW: 'payment;POST;/payments/{playerUUID}/{paymentId}/refuse',
    CHARGEBACK_DEPOSIT: 'payment;POST;/payments/{playerUUID}/{paymentId}/chargeback',
  },
  AUDIT: {
    PLAYER_AUDIT_LOGS: 'audit;GET;/audit/logs/{playerUUID}',
  },
  TRADING_ACTIVITY: {
    CLIENT_TRADING_ACTIVITY: 'trading_activity;GET;/',
  },
  TRADING_ACCOUNT: {
    CREATE: 'trading_mt4_updater;POST;/user',
    UPDATE_PASSWORD: 'trading_mt4_updater;PUT;/user/password',
  },
  TAGS: {
    ADD_TAG: 'tag;POST;/',
    VIEW_TAGS: 'tag;GET;/tags/{playerUUID}',
    NOTES: {
      UPDATE_NOTE: 'tag;PUT;/note/{noteId}',
      DELETE_NOTE: 'tag;DELETE;/note/{noteId}',
    },
  },
  SETTINGS: {
    CHANGE_LIMIT: 'payment;POST;/methods/{uuid}/{limitUUID}',
    ENABLE_METHOD: 'payment;POST;/methods/{uuid}/{limitUUID}/enable',
    DISABLE_METHOD: 'payment;POST;/methods/{uuid}/{limitUUID}/disable',
    CHANGE_STATUS: 'payment;POST;/methods/{uuid}',
  },
};
