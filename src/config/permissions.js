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
    SUSPEND: 'profile;PUT;/profiles/{playerUUID}/suspend',
    BLOCK: 'profile;PUT;/profiles/{playerUUID}/block',
    UNBLOCK: 'profile;PUT;/profiles/{playerUUID}/unblock',
    PROLONG: 'profile;PUT;/profiles/{playerUUID}/suspend/prolong',
    REMOVE: 'profile;PUT;/profiles/{playerUUID}/resume',
  },
  PAYMENTS: {
    APPROVE_WITHDRAW: 'payment;POST;/payments/{playerUUID}/{paymentId}/approve',
    REFUSE_WITHDRAW: 'payment;POST;/payments/{playerUUID}/{paymentId}/refuse',
    CHARGEBACK_DEPOSIT: 'payment;POST;/payments/{playerUUID}/{paymentId}/chargeback',
  },
};
