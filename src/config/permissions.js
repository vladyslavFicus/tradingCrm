export default {
  AUTH: {
    GET_AUTHORITIES: 'auth2.getAuthorities',
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
    PARTNERS_LIST_VIEW: 'affiliate.searchAffiliate',
    PROFILE_VIEW: 'affiliate.getAffiliate',
    CREATE: 'affiliate.createAffiliate',
    ADD_AUTHORITY: 'auth2.addUserAuthority',
    DELETE_AUTHORITY: 'auth2.deleteUserAuthority',
    UPDATE_PROFILE: 'affiliate.updateAffiliate',
    UPDATE_STATUS: 'affiliate.changeAffiliateStatus',
    CHANGE_PASSWORD: 'auth2.operator.changePassword',
  },
  LEADS: {
    GET_LEADS: 'lead.searchLeads',
    GET_LEAD_BY_ID: 'lead.getLeadById',
    PROMOTE_LEAD: 'profile.admin.createProfile',
  },
  HIERARCHY: {
    GET_TREE: 'hierarchy.branch.getBranchTree',
    GET_DESKS: 'hierarchy.branch.searchDesk',
    GET_TEAMS: 'hierarchy.branch.searchTeam',
    GET_OFFICES: 'hierarchy.branch.searchOffice',
    GET_OPERATORS: 'hierarchy.user.getSubordinateOperators',
    GET_BRANCH_BY_ID: 'hierarchy.branch.getBranchByUuid',
    CREATE_BRANCH: 'hierarchy-updater.branch.createBranch',
    ADD_BRAND_MANAGER: 'hierarchy-updater.branch.addBranchManager',
    REMOVE_BRAND_MANAGER: 'hierarchy-updater.branch.removeBranchManager',
    UPDATE_USER_BRANCH: 'hierarchy-updater.user.updateUserBranch',
  },
  SALES_RULES: {
    GET_RULES: 'rules-profile.searchRules',
    CREATE_RULE: 'rules-profile.createOrUpdateRule',
    REMOVE_RULE: 'rules-profile.deleteRule',
  },
  USER_PROFILE: {
    STATUS: 'profile.admin.changeProfileStatus',
    PROFILES_LIST: 'profileview.admin.pageableSearch',
    KYC_UPDATE: 'profile.admin.updateKycStatus',
    UPDATE_PERSONAL_INFORMATION: 'profile.admin.updateProfilePersonalInformation',
    UPDATE_ADDRESS: 'profile.admin.updateProfileAddress',
    UPDATE_CONTACTS: 'profile.admin.updateProfileContacts',
    UPDATE_EMAIL: 'profile.admin.updateProfileEmail',
    VERIFY_PHONE: 'profile.admin.verifyPhone',
    VERIFY_EMAIL: 'profile.admin.verifyEmail',
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
    FIELD_PHONE: 'backoffice-graphql.profile.field.phone',
    FIELD_ADDITIONAL_PHONE: 'backoffice-graphql.profile.field.additionalPhone',
    FIELD_EMAIL: 'backoffice-graphql.profile.field.email',
    FIELD_ADDITIONAL_EMAIL: 'backoffice-graphql.profile.field.additionalEmail',
  },
  LEAD_PROFILE: {
    FIELD_PHONE: 'backoffice-graphql.lead.field.phone',
    FIELD_MOBILE: 'backoffice-graphql.lead.field.mobile',
    FIELD_EMAIL: 'backoffice-graphql.lead.field.email',
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
    CHANGE_ORIGINAL_AGENT: 'payment.changePaymentAgent',
  },
  PAYMENTS: {
    PAYMENTS_LIST: 'payment.searchPayments',
  },
  AUDIT: {
    AUDIT_LOGS: 'audit.searchAudit',
  },
  TRADING_ACTIVITY: {
    CLIENT_TRADING_ACTIVITY: 'trading-activity.searchGet',
  },
  TRADING_ACCOUNT: {
    CREATE: 'trading-account.createAccount',
    UPDATE_PASSWORD: 'trading-account.changeAccountPassword',
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
    REGISTRATION_STATISTICS: 'profileview.admin.getRegistrationStatistics',
    PAYMENT_STATISTICS: 'payment.getStatistics',
    PAYMENTS_LIST: 'payment.searchPayments',
    PROFILES_LIST: 'profileview.admin.pageableSearch',
  },
  CALLBACKS: {
    LIST: 'callback.searchCallbacks',
  },
};
