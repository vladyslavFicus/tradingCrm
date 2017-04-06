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
  },
  USER_PROFILE: {
    SEND_ACTIVATION_LINK: 'profile;POST;/profiles/{playerUUID}/send-activation-link',
  },
  PAYMENTS: {
    APPROVE_WITHDRAW: 'payment;POST;/approve/{paymentId}',
  },
};
