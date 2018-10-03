export default {
  REPORTS: {
    PLAYER_LIABILITY_VIEW: 'mga_report;GET;/reports/player-liability',
    PLAYER_LIABILITY_FILES_VIEW: 'mga_report;GET;/reports/player-liability/files',
    PLAYER_LIABILITY_FILE_VIEW: 'mga_report;GET;/reports/player-liability/files/{file}',
    VAT_VIEW: 'mga_report;GET;/reports/vat',
  },
  OPERATORS: {
    OPERATORS_LIST_VIEW: 'operator;GET;/operators',
    PROFILE_VIEW: 'operator;GET;/operators/{uuid}',
    CREATE: 'operator;POST;/operators',
    OPERATOR_SEND_INVITATION: 'operator;PUT;/operators/{uuid}/send/invitation',
    ADD_AUTHORITY: 'auth;POST;/credentials/{uuid}/authorities',
    DELETE_AUTHORITY: 'auth;DELETE;/credentials/{uuid}/authorities',
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
    DELETE_FILE: 'profile;DELETE;files/{playerUUID}/{fileUUID}',
    VERIFY_PHONE: 'profile;POST;/verification/{playerUUID}/phone',
    VERIFY_EMAIL: 'profile;POST;/verification/{playerUUID}',
    CHANGE_PASSWORD: 'auth;POST;/credentials/{uuid}/password',
  },
  PAYMENT: {
    PLAYER_LIMITS_LIST: 'payment;GET;/limits/{playerUUID}',
    PLAYER_ACCOUNT_LIST: 'payment;GET;/accounts/{playerUUID}',
    PAYMENT_METHODS_LIST: 'payment;GET;/methods',
    ACCOUNT_LOCK: 'payment;PUT;/accounts/{paymentAccountUUID}/lock',
  },
  PROMOTION: {
    LIST: 'promotion;GET;/campaigns',
    PLAYER_CAMPAIGN_ACTIVE_LIST: 'promotion;GET;/campaigns/{playerUUID}/active',
    PLAYER_CAMPAIGN_AVAILABLE_LIST: 'promotion;GET;/campaigns/{playerUUID}/available',
  },
  CAMPAIGNS: {
    LIST: 'campaign;GET;/',
    CREATE: 'campaign;POST;/',
    UPDATE: 'campaign;PUT;/{uuid}',
    VIEW: 'campaign;GET;/{uuid}',
    CLONE: 'campaign;POST;/{uuid}/clone',
    UPLOAD_PLAYERS: 'campaign;PUT;/{uuid}/player-list',
    UPLOAD_RESET_PLAYERS: 'campaign;PUT;/{uuid}/reset-player-states',
    UPLOAD_SOFT_RESET_PLAYERS: 'campaign;PUT;/{uuid}/add-soft-reset-player-states',
  },
  CAMPAIGN_AGGREGATOR: {
    OPT_IN: 'campaign_aggregator;PUT;/{uuid}/optin/{playerUUID}',
    OPT_OUT: 'campaign_aggregator;PUT;/{uuid}/optout/{playerUUID}',
  },
  WAGERING_FULFILLMENT: {
    LIST: 'wagering_fulfillment;GET;/',
    VIEW: 'wagering_fulfillment;GET;/{uuid}',
    CREATE: 'wagering_fulfillment;POST;/',
  },
  DEPOSIT_FULFILLMENT: {
    VIEW: 'deposit_fulfillment;GET;/{uuid}',
    CREATE: 'deposit_fulfillment;POST;/',
  },
  GAME_INFO: {
    GET_GAME_LIST_CSV: 'game_info;GET;/games',
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
  BONUS: {
    PLAYER_BONUSES_LIST: 'bonus;GET;/bonuses/{playerUUID}',
  },
  BONUS_TEMPLATE: {
    VIEW: 'bonus_template;GET;/templates/{uuid}',
    CREATE: 'bonus_template;POST;/templates',
  },
  FREE_SPIN_TEMPLATE: {
    VIEW: 'free_spin_template;GET;/templates/{aggregatorId}/{uuid}',
    CREATE: 'free_spin_template;POST;/templates/{aggregatorId}',
  },
  GAMING_ACTIVITY: {
    PLAYER_GAMING_ACTIVITY: 'gaming_activity;GET;/gaming/activity/{playerUUID}',
  },
  TRADING_ACTIVITY: {
    CLIENT_TRADING_ACTIVITY: 'trading_activity;GET;/',
  },
  FREE_SPIN: {
    PLAYER_FREE_SPIN_LIST: 'free_spin;GET;/free-spins/{playerUUID}',
  },
  TAGS: {
    ADD_TAG: 'tag;POST;/',
    VIEW_TAGS: 'tag;GET;/tags/{playerUUID}',
  },
  CMS_GAMES: {
    VIEW_LIST: 'cms_game;GET;/',
  },
};
