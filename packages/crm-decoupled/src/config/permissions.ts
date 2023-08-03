type Permission = Record<string, string>;

type Permissions = Record<string, Permission>;

const permissions: Permissions = {
  AUTH: {
    GET_AUTHORITIES: 'auth2.getAuthorities',
    UPDATE_ACTIONS: 'auth2.updateActions',
  },
  OPERATORS: {
    OPERATORS_LIST_VIEW: 'operator.searchOperators',
    CREATE: 'operator.createOperator',
    PROFILE_VIEW: 'operator.getOperatorProfileByUuid',
    ADD_AUTHORITY: 'auth2.addUserAuthority',
    DELETE_AUTHORITY: 'auth2.deleteUserAuthority',
    UPDATE_PROFILE: 'operator.editOperatorProfile',
    UPDATE_STATUS: 'operator.changeOperatorStatus',
    CHANGE_PASSWORD: 'auth2.operator.changePassword',
    RESET_PASSWORD: 'auth2.user.resetPassword',
  },
  PARTNERS: {
    AFFILIATE_REFERRALS: 'profile.admin.getAllBrandAffiliateReferrals',
    PARTNERS_LIST_VIEW: 'affiliate.searchAffiliate',
    PROFILE_VIEW: 'affiliate.getAffiliate',
    CREATE: 'affiliate.createAffiliate',
    ADD_AUTHORITY: 'auth2.addUserAuthority',
    DELETE_AUTHORITY: 'auth2.deleteUserAuthority',
    UPDATE_PROFILE: 'affiliate.updateAffiliate',
    UPDATE_STATUS: 'affiliate.changeAffiliateStatus',
    BULK_CHANGE_AFFILIATES_STATUSES: 'affiliate.bulkChangeAffiliatesStatuses',
    BULK_CHANGE_AFFILIATES_COUNTRIES: 'affiliate.bulkModifyForbiddenCountries',
    CHANGE_PASSWORD: 'auth2.operator.changePassword',
  },
  LEADS: {
    GET_LEADS: 'lead.searchLeads',
    GET_LEAD_BY_ID: 'lead.getLeadById',
    PROMOTE_LEAD: 'profile.admin.createProfile',
    UPLOAD_LEADS_FROM_FILE: 'lead-updater.uploadLeadsFromFile',
  },
  HIERARCHY: {
    GET_TREE: 'hierarchy.branch.getBranchTree',
    GET_DESKS: 'hierarchy.branch.searchDesk',
    GET_TEAMS: 'hierarchy.branch.searchTeam',
    GET_OFFICES: 'hierarchy.branch.searchOffice',
    GET_OPERATORS: 'hierarchy.user.getSubordinateOperators',
    GET_BRANCH_BY_ID: 'hierarchy.branch.getBranchByUuid',
    CREATE_BRANCH: 'hierarchy-updater.branch.createBranch',
    UPDATE_BRANCH: 'hierarchy-updater.branch.updateBranch',
    DELETE_BRANCH: 'hierarchy-updater.branch.deleteBranch',
    ADD_BRAND_MANAGER: 'hierarchy-updater.branch.addBranchManager',
    REMOVE_BRAND_MANAGER: 'hierarchy-updater.branch.removeBranchManager',
    UPDATE_USER_BRANCH: 'hierarchy-updater.user.updateUserBranch',
    GET_ACQUISITION_STATUSES: 'hierarchy-updater.acquisition.getStatuses',
    CREATE_ACQUISITION_STATUS: 'hierarchy-updater.acquisition.addStatusForBrand',
    DELETE_ACQUISITION_STATUS: 'hierarchy-updater.acquisition.deleteStatusForBrand',
  },
  SALES_RULES: {
    GET_RULES: 'rules-profile.searchRules',
    CREATE_RULE: 'rules-profile.createOrUpdateRule',
    REMOVE_RULE: 'rules-profile.deleteRule',
  },
  USER_PROFILE: {
    STATUS: 'profile.admin.changeProfileStatus',
    PROFILES_LIST: 'profileview.admin.pageableSearch',
    BALANCE: 'backoffice-graphql.profile.field.balance',
    KYC_UPDATE: 'profile.admin.updateKycStatus',
    UPDATE_PERSONAL_INFORMATION: 'profile.admin.updateProfilePersonalInformation',
    UPDATE_ADDRESS: 'profile.admin.updateProfileAddress',
    UPDATE_CONTACTS: 'profile.admin.updateProfileContacts',
    UPDATE_EMAIL: 'profile.admin.updateProfileEmail',
    VERIFY_PHONE: 'profile.admin.verifyPhone',
    VERIFY_EMAIL: 'profile.admin.verifyEmail',
    DEPOSIT_ENABLED_CONFIG: 'profile.admin.updateDepositEnabledConfig',
    RESET_PASSWORD: 'auth2.user.resetPassword',
    CHANGE_PASSWORD: 'auth2.client.changePassword',
    CHANGE_ACQUISITION: 'hierarchy-updater.user.bulkUpdateAcquisition',
    CHANGE_ACQUISITION_STATUS: 'hierarchy-updater.user.bulkUpdateAcquisitionStatus',
    CHANGE_CONFIGURATION: 'profile.admin.updateProfileConfiguration',
    VIEW_FILES: 'attachments.getUserAttachments',
    VIEW_FILE: 'attachments.downloadFile',
    GET_FILES: 'attachments.getUserVerificationStatus',
    UPLOAD_FILE: 'attachments.updateAttachment',
    DELETE_FILE: 'attachments.deleteAttachment',
    REFERRER_STATISTICS: 'referral.getReferrerStatistics',
    REFERRALS_HISTORY: 'referral.getReferrerIntroducedReferrals',
    FIELD_PHONE: 'backoffice-graphql.profile.field.phone',
    FIELD_ADDITIONAL_PHONE: 'backoffice-graphql.profile.field.additionalPhone',
    FIELD_EMAIL: 'backoffice-graphql.profile.field.email',
    FIELD_ADDITIONAL_EMAIL: 'backoffice-graphql.profile.field.additionalEmail',
    FIELD_CONVERTED_FROM_LEAD_UUID: 'backoffice-graphql.profile.field.convertedFromLeadUuid',
    AFFILIATE_FIELD_UUID: 'backoffice-graphql.profile.affiliate.field.uuid',
    AFFILIATE_FIELD_SOURCE: 'backoffice-graphql.profile.affiliate.field.source',
    AFFILIATE_FIELD_REFERRAL: 'backoffice-graphql.profile.affiliate.field.referral',
    AFFILIATE_FIELD_CAMPAIGN_ID: 'backoffice-graphql.profile.affiliate.field.campaignId',
    AFFILIATE_FIELD_SMS: 'backoffice-graphql.profile.affiliate.field.sms',
    CALLBACKS_LIST: 'callback.searchClientCallbacks',
    CREATE_CALLBACK: 'callback.createClientCallback',
    DELETE_CALLBACK: 'callback.updateClientCallback',
    UPDATE_CALLBACK: 'callback.deleteClientCallback',
  },
  LEAD_PROFILE: {
    FIELD_PHONE: 'backoffice-graphql.lead.field.phone',
    FIELD_MOBILE: 'backoffice-graphql.lead.field.mobile',
    FIELD_EMAIL: 'backoffice-graphql.lead.field.email',
    CALLBACKS_LIST: 'callback.searchLeadCallbacks',
    CREATE_CALLBACK: 'callback.createLeadCallback',
    UPDATE_CALLBACK: 'callback.updateLeadCallback',
    DELETE_CALLBACK: 'callback.deleteLeadCallback',
  },
  FILES: {
    SEARCH_FILES: 'attachments.searchAttachments',
    UPLOAD_FILE: 'attachments.updateAttachment',
  },
  PAYMENT: {
    DEPOSIT: 'payment.deposit',
    WITHDRAW: 'payment.withdraw',
    CREDIT_IN: 'payment.creditIn',
    CREDIT_OUT: 'payment.creditOut',
    TRANSFER: 'payment.transfer',
    APPROVE: 'payment.approvePayment',
    REJECT: 'payment.rejectPayment',
    CHANGE_STATUS: 'payment.changePaymentStatus',
    CHANGE_METHOD: 'payment.changePaymentMethod',
    CHANGE_SYSTEM: 'payment.changePaymentSystem',
    CHANGE_ORIGINAL_AGENT: 'payment.changePaymentAgent',
    CHANGE_CREATION_TIME: 'payment.utils.changeDatetime',
    CHANGE_SHOW_FTD_TO_AFFILIATE: 'payment.changeShowFtdToAffiliate',
    ENABlE_SHOW_FTD_TO_AFFILIATE: 'payment.enableShowFtdToAffiliate',
    DISABLE_SHOW_FTD_TO_AFFILIATE: 'payment.disableShowFtdToAffiliate',
    SEARCH_PSP: 'payment.searchPaymentSystems',
    UPDATE_PSP: 'payment.updateBrandFavouritePaymentSystems',
  },
  PAYMENTS: {
    PAYMENTS_LIST: 'payment-view.searchPayments',
  },
  AUDIT: {
    AUDIT_LOGS: 'audit.searchAudit',
  },
  TRADING_ACTIVITY: {
    CLIENT_TRADING_ACTIVITY: 'trading-activity.searchPost',
  },
  TRADING_ACCOUNT: {
    CREATE: 'trading-account.createAccount',
    UPDATE_PASSWORD: 'trading-account.changeAccountPassword',
    READ_ONLY: 'trading-account.changeAccountReadOnly',
    RENAME_ACCOUNT: 'trading-account.renameAccount',
    UNARCHIVE: 'trading-account.unarchiveAccount',
    DOWNLOAD_REPORT: 'trading-account.getAccountReport',
  },
  TRADING_ENGINE: {
    GET_ACCOUNTS: 'we-trading.findAccounts',
  },
  NOTES: {
    ADD_NOTE: 'note.saveNote',
    VIEW_NOTES: 'note.searchNotes',
    UPDATE_NOTE: 'note.updateNote',
    DELETE_NOTE: 'note.deleteNote',
  },
  BRAND_CONFIG: {
    GET_BRAND_CONFIG: 'brand-config-service.getBrand',
    CREATE_BRAND_CONFIG: 'brand-config-service.createBrand',
    UPDATE_BRAND_CONFIG: 'brand-config-service.updateBrand',
  },
  EMAIL_TEMPLATES: {
    SEND_EMAIL: 'email.sendTemplatedEmail',
    GET_EMAIL_TEMPLATES: 'email.getAllTemplates',
    GET_EMAIL_TEMPLATE: 'email.getTemplates',
    CREATE_EMAIL_TEMPLATE: 'email.createTemplate',
    UPDATE_EMAIL_TEMPLATE: 'email.updateTemplate',
    DELETE_EMAIL_TEMPLATE: 'email.deleteTemplate',
  },
  TRADING_ACCOUNTS: {
    GET_TRADING_ACCOUNTS: 'accountview.search',
  },
  NOTIFICATION_CENTER: {
    LIST: 'notification.search',
    GET_UNREAD_COUNT: 'notification.countAllUserUnreadNotifications',
  },
  DASHBOARD: {
    LATEST_REGISTRATIONS: 'profileview.admin.getLatestRegistrations',
    DEPOSITS_COUNT: 'payment-view.getDepositCountStatistics',
    DEPOSITS_AMOUNT: 'payment-view.getDepositAmountStatistics',
    LATEST_DEPOSITS: 'payment-view.getLastDeposits',
    WITHDRAWAL_COUNT: 'payment-view.getWithdrawalCountStatistics',
    WITHDRAWAL_AMOUNT: 'payment-view.getWithdrawalAmountStatistics',
    LATEST_WITHDRAWALS: 'payment-view.getLastWithdrawals',
    FTD_COUNT: 'payment-view.getFtdCountStatistics',
    FTD_AMOUNT: 'payment-view.getFtdAmountStatistics',
    RETENTION_COUNT: 'payment-view.getRetentionCountStatistics',
    RETENTION_AMOUNT: 'payment-view.getRetentionAmountStatistics',
    FTR_COUNT: 'payment-view.getFtrCountStatistics',
    FTR_AMOUNT: 'payment-view.getFtrAmountStatistics',
    REGISTRATIONS: 'profileview.admin.getRegistrationStatistics',
    LATEST_NOTIFICATIONS: 'notification.getLastNotifications',
    SCREENER_WIDGET: 'backoffice-graphql.dashboard.getScreenerWidget',
  },
  CALL_HISTORY: {
    LIST: 'click-to-call.searchCallHistory',
  },
  CLIENTS_DISTRIBUTION: {
    LIST: 'clients-distributor.searchRules',
    CREATE_RULE: 'clients-distributor.createRule',
  },
  WE_TRADING: {
    CREDIT_IN: 'we-trading.creditCorrectionIn',
    CREDIT_OUT: 'we-trading.creditCorrectionOut',
    CORRECTION_IN: 'we-trading.balanceCorrectionIn',
    CORRECTION_OUT: 'we-trading.balanceCorrectionOut',
    MANAGER_EDIT_ORDER: 'we-trading.updateOrder',
    ADMIN_EDIT_ORDER: 'we-trading.admin.updateOrder',
    ACCOUNTS_LIST: 'we-trading.findAccounts',
    ORDERS_LIST: 'we-trading.findOrders',
    QUOTES_LIST: 'we-trading.findOrders',
    SYMBOLS_LIST: 'we-trading.findSymbols',
    GROUPS_LIST: 'we-trading.findGroups',
    SECURITIES_LIST: 'we-trading.getSecurities',
    CREATE_SYMBOL: 'we-trading.createSymbol',
    EDIT_SYMBOL: 'we-trading.updateSymbol',
    CREATE_ORDER: 'we-trading.createOrder',
    CLOSE_ORDER: 'we-trading.closeOrder',
    CREATE_CLOSED_ORDER: 'we-trading.createClosedOrder',
    CREATE_SECURITIES: 'we-trading.createSecurity',
    EDIT_SECURITIES: 'we-trading.updateSecurity',
    DELETE_SECURITY: 'we-trading.deleteSecurity',
    CREATE_GROUP: 'we-trading.createGroup',
    EDIT_GROUP: 'we-trading.updateGroup',
    DELETE_GROUP: 'we-trading.deleteGroup',
    ACCOUNT_READ_ONLY: 'we-trading.updateAccountReadOnly',
    UPDATE_ACCOUNT_GROUP: 'we-trading.updateAccountGroup',
    UPDATE_ACCOUNT_LEVERAGE: 'we-trading.updateAccountLeverage',
    TRANSACTIONS_LIST: 'we-trading.findTransactions',
    ORDER_REOPEN: 'we-trading.reopenOrder',
    ORDER_CANCEL: 'we-trading.cancelOrder',
    ORDER_CLOSE: 'we-trading.closeOrder',
    BULK_ORDER_CLOSE: 'we-trading.bulkCloseOrders',
    ORDER_ACTIVATE: 'we-trading.activateOrder',
    DELETE_SYMBOL: 'we-trading.deleteSymbol',
    OPERATORS_LIST: 'we-trading.findOperators',
    OPERATORS_ADD_NEW: 'we-trading.createOperator',
    OPERATORS_CHANGE_ROLE: 'we-trading.changeOperatorRole',
    OPERATORS_CHANGE_STATUS: 'we-trading.changeOperatorStatus',
    OPERATORS_VIEW_OPERATOR: 'we-trading.findOperators',
    OPERATORS_UPDATE_OPERATOR: 'we-trading.updateOperator',
    OPERATORS_UNLOCK: 'auth2.unlockUser',
    OPERATORS_RESET_PASSWORD: 'auth2.user.resetPassword',
    OPERATORS_CHANGE_PASSWORD: 'auth2.operator.changePassword',
    UPDATE_ACCOUNT_ENABLE: 'we-trading.updateAccountEnable',
    UPDATE_GROUP_ENABLE: 'we-trading.updateGroupEnable',
    HOLIDAYS_LIST: 'we-trading.findHolidays',
    HOLIDAYS_CREATE: 'we-trading.createHoliday',
    HOLIDAYS_EDIT: 'we-trading.updateHoliday',
    HOLIDAYS_DELETE: 'we-trading.deleteHoliday',
    DOWNLOAD_REPORT: 'we-trading.getAccountDetailedReport',
  },
  LIQUIDITY_PROVIDER_ADAPTER: {
    RESTART_STREAMING: 'liquidity-provider-adapter.admin.restartStreaming',
  },
  IP_WHITELIST: {
    LIST: 'brand-config-service.ip-white-list.search',
    ADD_IP_ADDRESS: 'brand-config-service.ip-white-list.add',
    DELETE_IP_ADDRESS: 'brand-config-service.ip-white-list.delete',
    EDIT_IP_ADDRESS_DESCRIPTION: 'brand-config-service.ip-white-list.editDescription',
  },
  DOCUMENTS: {
    SEARCH_DOCUMENT: 'attachments.searchDocuments',
    UPLOAD_DOCUMENT: 'attachments.uploadDocument',
    DELETE_DOCUMENT: 'attachments.deleteDocument',
    UPDATE_DOCUMENT: 'attachments.updateDocument',
    DOWNLOAD_DOCUMENT: 'attachments.downloadDocument',
  },
  SIDEBAR: {
    CLIENTS_LIST: 'backoffice-graphql.sidebar.clientsList',
    CLIENTS_KYC_DOCUMENTS: 'backoffice-graphql.sidebar.clientsKycDocuments',
    CLIENTS_TRADING_ACCOUNTS: 'backoffice-graphql.sidebar.clientsTradingAccounts',
    CLIENTS_CALLBACKS: 'backoffice-graphql.sidebar.clientsCallbacks',
    LEADS_LIST: 'backoffice-graphql.sidebar.leadsList',
    LEADS_CALLBACKS: 'backoffice-graphql.sidebar.leadsCallbacks',
    HIERARCHY: 'backoffice-graphql.sidebar.hierarchy',
    MANAGMENT_OFFICES: 'backoffice-graphql.sidebar.managmentOffices',
    MANAGMENT_DESKS: 'backoffice-graphql.sidebar.managmentDesks',
    MANAGMENT_TEAMS: 'backoffice-graphql.sidebar.managmentTeams',
    MANAGMENT_SALES_RULES: 'backoffice-graphql.sidebar.managmentSalesRules',
    MANAGMENT_OPERATORS: 'backoffice-graphql.sidebar.managmentOperators',
    MANAGMENT_PARTNERS: 'backoffice-graphql.sidebar.managmentPartners',
    DOCUMENTS: 'backoffice-graphql.sidebar.documents',
    PAYMENTS: 'backoffice-graphql.sidebar.payments',
    NOTIFICATIONS: 'backoffice-graphql.sidebar.notifications',
    CLIENTS_DISTIBUTION: 'backoffice-graphql.sidebar.clientsDistibution',
    IP_WHITELIST: 'backoffice-graphql.sidebar.ipWhitelist',
    SETTINGS_EMAIL_TEMPLATES: 'backoffice-graphql.sidebar.settingsEmailTemplates',
    SETTINGS_RBAC: 'backoffice-graphql.sidebar.settingsRbac',
    SETTINGS_ACQUISITION_STATUSES: 'backoffice-graphql.sidebar.settingsAcquisitionStatuses',
    SETTINGS_FEATURE_TOGGLES: 'backoffice-graphql.sidebar.settingsFeatureToggles',
    SETTINGS_PAYMENT_SYSTEMS_PROVIDER: 'backoffice-graphql.sidebar.settingsPaymentSystemsProvider',
  },
};

export default permissions;
