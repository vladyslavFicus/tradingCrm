type Action = {
  action: string,
  state: boolean,
};

type Item = {
  id: string,
  actions: {
    view?: Action,
    edit?: Action,
  },
};

type RootItem = {
  permissions: Array<Item>,
  additional?: {
    permissions: Array<string>,
  },
  image?: boolean,
};

type RbackItem = Item & RootItem;

const rback: Array<RbackItem> = [
  // ============================================= //
  // =================== Dashboard =================== //
  // ============================================= //
  {
    id: 'DASHBOARD',
    actions: {
      view: {
        action: 'profileview.admin.getLatestRegistrations',
        state: false,
      },
    },
    permissions: [
      // Latest registrations from Dashboard
      {
        id: 'LATEST_REGISTRATIONS',
        actions: {
          view: {
            action: 'profileview.admin.getLatestRegistrations',
            state: false,
          },
        },
      },
      // Deposits count from Dashboard
      {
        id: 'DEPOSITS_COUNT',
        actions: {
          view: {
            action: 'payment-view.getDepositCountStatistics',
            state: false,
          },
        },
      },
      // Deposits amount from Dashboard
      {
        id: 'DEPOSITS_AMOUNT',
        actions: {
          view: {
            action: 'payment-view.getDepositAmountStatistics',
            state: false,
          },
        },
      },
      // Latest deposits from Dashboard
      {
        id: 'LATEST_DEPOSITS',
        actions: {
          view: {
            action: 'payment-view.getLastDeposits',
            state: false,
          },
        },
      },
      // Withdrawal count from Dashboard
      {
        id: 'WITHDRAWAL_COUNT',
        actions: {
          view: {
            action: 'payment-view.getWithdrawalCountStatistics',
            state: false,
          },
        },
      },
      // Withdrawal amount from Dashboard
      {
        id: 'WITHDRAWAL_AMOUNT',
        actions: {
          view: {
            action: 'payment-view.getWithdrawalAmountStatistics',
            state: false,
          },
        },
      },
      // Latest withdrawals from Dashboard
      {
        id: 'LATEST_WITHDRAWALS',
        actions: {
          view: {
            action: 'payment-view.getLastWithdrawals',
            state: false,
          },
        },
      },
      // FTD count from Dashboard
      {
        id: 'FTD_COUNT',
        actions: {
          view: {
            action: 'payment-view.getFtdCountStatistics',
            state: false,
          },
        },
      },
      // FTD amount from Dashboard
      {
        id: 'FTD_AMOUNT',
        actions: {
          view: {
            action: 'payment-view.getFtdAmountStatistics',
            state: false,
          },
        },
      },
      // Retention count from Dashboard
      {
        id: 'RETENTION_COUNT',
        actions: {
          view: {
            action: 'payment-view.getRetentionCountStatistics',
            state: false,
          },
        },
      },
      // Retention amount from Dashboard
      {
        id: 'RETENTION_AMOUNT',
        actions: {
          view: {
            action: 'payment-view.getRetentionAmountStatistics',
            state: false,
          },
        },
      },
      // FTR count from Dashboard
      {
        id: 'FTR_COUNT',
        actions: {
          view: {
            action: 'payment-view.getFtrCountStatistics',
            state: false,
          },
        },
      },
      // FTR amount from Dashboard
      {
        id: 'FTR_AMOUNT',
        actions: {
          view: {
            action: 'payment-view.getFtrAmountStatistics',
            state: false,
          },
        },
      },
      // Registrations from Dashboard
      {
        id: 'REGISTRATIONS',
        actions: {
          view: {
            action: 'profileview.admin.getRegistrationStatistics',
            state: false,
          },
        },
      },
      // Latest notifications from Dashboard
      {
        id: 'LATEST_NOTIFICATIONS',
        actions: {
          view: {
            action: 'notification.getLastNotifications',
            state: false,
          },
        },
      },
      // Screener widget from Dashboard
      {
        id: 'SCREENER_WIDGET',
        actions: {
          view: {
            action: 'backoffice-graphql.dashboard.getScreenerWidget',
            state: false,
          },
        },
      },
    ],
  },
  // ============================================= //
  // ============== Documents brand ============== //
  // ============================================= //
  {
    id: 'documents-brand',
    actions: {
      view: {
        action: 'attachments.searchDocuments',
        state: false,
      },
    },
    permissions: [
      // list documents
      {
        id: 'searchDocuments',
        actions: {
          view: {
            action: 'attachments.searchDocuments',
            state: false,
          },
        },
      },
      // add new document
      {
        id: 'uploadDocument',
        actions: {
          edit: {
            action: 'attachments.uploadDocument',
            state: false,
          },
        },
      },
      // remove document
      {
        id: 'deleteDocument',
        actions: {
          edit: {
            action: 'attachments.deleteDocument',
            state: false,
          },
        },
      },
      // update document
      {
        id: 'updateDocument',
        actions: {
          edit: {
            action: 'attachments.updateDocument',
            state: false,
          },
        },
      },
      // download document
      {
        id: 'downloadDocument',
        actions: {
          edit: {
            action: 'attachments.downloadDocument',
            state: false,
          },
        },
      },
    ],
  },
  // ============================================= //
  // ================== Clients ================== //
  // ============================================= //
  {
    id: 'clients',
    actions: {
      view: {
        action: 'profileview.admin.pageableSearch',
        state: false,
      },
    },
    additional: {
      permissions: [
        // filter-set
        'operator-config.getFilterSet',
        'operator-config.updateFilterSet',
        'operator-config.deleteFilterSet',
        'operator-config.getFilterSetsList',
        'operator-config.createFilterSet',
        'operator-config.changeFilterSetFavouriteStatus',
        // affiliate
        'affiliate.searchAffiliate',
        // operator
        'operator.searchOperators',
        // hierarchy
        'hierarchy.user.getSubordinateOperators',
        'hierarchy.branch.getUserBranches',
      ],
    },
    permissions: [
      // List of clients
      {
        id: 'list',
        actions: {
          view: {
            action: 'profileview.admin.pageableSearch',
            state: false,
          },
        },
      },
      // Client's profile
      {
        id: 'profile',
        actions: {
          view: {
            action: 'profile.admin.getProfile',
            state: false,
          },
        },
      },
      // Client's balance
      {
        id: 'balance',
        actions: {
          view: {
            action: 'backoffice-graphql.profile.field.balance',
            state: false,
          },
        },
      },
      // Make deposit transaction
      {
        id: 'payment-deposit',
        actions: {
          edit: {
            action: 'payment.deposit',
            state: false,
          },
        },
      },
      // Make withdraw transaction
      {
        id: 'payment-withdraw',
        actions: {
          edit: {
            action: 'payment.withdraw',
            state: false,
          },
        },
      },
      // Make credit in transaction
      {
        id: 'payment-creditIn',
        actions: {
          edit: {
            action: 'payment.creditIn',
            state: false,
          },
        },
      },
      // Make credit out transaction
      {
        id: 'payment-creditOut',
        actions: {
          edit: {
            action: 'payment.creditOut',
            state: false,
          },
        },
      },
      // Make transfer transaction
      {
        id: 'payment-transfer',
        actions: {
          edit: {
            action: 'payment.transfer',
            state: false,
          },
        },
      },
      // Approve payment
      {
        id: 'payment-approve',
        actions: {
          edit: {
            action: 'payment.approvePayment',
            state: false,
          },
        },
      },
      // Reject payment
      {
        id: 'payment-reject',
        actions: {
          edit: {
            action: 'payment.rejectPayment',
            state: false,
          },
        },
      },
      // Change payment status
      {
        id: 'payment-changeStatus',
        actions: {
          edit: {
            action: 'payment.changePaymentStatus',
            state: false,
          },
        },
      },
      // Change payment method
      {
        id: 'payment-changeMethod',
        actions: {
          edit: {
            action: 'payment.changePaymentMethod',
            state: false,
          },
        },
      },
      // Payment original agent
      {
        id: 'payment-changeAgent',
        actions: {
          edit: {
            action: 'payment.changePaymentAgent',
            state: false,
          },
        },
      },
      // Allow/prohibit deposit
      {
        id: 'payment-changeAllowDeposit',
        actions: {
          edit: {
            action: 'profile.admin.updateDepositEnabledConfig',
            state: false,
          },
        },
      },
      // Payment enable show FTD to affiliate
      {
        id: 'payment-enableShowFtdToAffiliate',
        actions: {
          edit: {
            action: 'payment.enableShowFtdToAffiliate',
            state: false,
          },
        },
      },
      // Reset password
      {
        id: 'resetPassword',
        actions: {
          edit: {
            action: 'auth2.user.resetPassword',
            state: false,
          },
        },
      },
      // Change password for client
      {
        id: 'changePassword',
        actions: {
          edit: {
            action: 'auth2.client.changePassword',
            state: false,
          },
        },
      },
      // Get authorities for notes
      {
        id: 'getAuthorities',
        actions: {
          view: {
            action: 'auth2.getAuthorities',
            state: false,
          },
        },
      },
      // Client's status
      {
        id: 'changeStatus',
        actions: {
          edit: {
            action: 'profile.admin.changeProfileStatus',
            state: false,
          },
        },
      },
      // Client's KYC status
      {
        id: 'changeKYCStatus',
        actions: {
          edit: {
            action: 'profile.admin.updateKycStatus',
            state: false,
          },
        },
      },
      // Client's personal information
      {
        id: 'updatePersonalInfo',
        actions: {
          edit: {
            action: 'profile.admin.updateProfilePersonalInformation',
            state: false,
          },
        },
      },
      // Client's address information
      {
        id: 'updateAddress',
        actions: {
          edit: {
            action: 'profile.admin.updateProfileAddress',
            state: false,
          },
        },
      },
      // KYC verification files
      {
        id: 'kycVerificationFiles',
        actions: {
          view: {
            action: 'attachments.getUserVerificationStatus',
            state: false,
          },
        },
      },
      // View/Download file
      {
        id: 'viewDownloadFile',
        actions: {
          view: {
            action: 'attachments.downloadFile',
            state: false,
          },
        },
      },
      // Delete file for KYC
      {
        id: 'deleteKYCFile',
        actions: {
          edit: {
            action: 'attachments.deleteAttachment',
            state: false,
          },
        },
      },
      // Upload file for KYC
      {
        id: 'uploadKYCFile',
        actions: {
          edit: {
            action: 'attachments.updateAttachment',
            state: false,
          },
        },
      },
      // Verify phone
      {
        id: 'verifyPhone',
        actions: {
          edit: {
            action: 'profile.admin.verifyPhone',
            state: false,
          },
        },
      },
      // Verify email
      {
        id: 'verifyEmail',
        actions: {
          edit: {
            action: 'profile.admin.verifyEmail',
            state: false,
          },
        },
      },
      // Profile configuration (FATCA, CRS)
      {
        id: 'updateProfileConfiguration',
        actions: {
          edit: {
            action: 'profile.admin.updateProfileConfiguration',
            state: false,
          },
        },
      },
      // Show feed tab
      {
        id: 'showFeedTab',
        actions: {
          edit: {
            action: 'audit.searchAudit',
            state: false,
          },
        },
      },
      // Client's phone
      {
        id: 'phone',
        actions: {
          view: {
            action: 'backoffice-graphql.profile.field.phone',
            state: false,
          },
          edit: {
            action: 'profile.admin.updateProfileContacts',
            state: false,
          },
        },
      },
      // Client's Converted from Lead
      {
        id: 'convertedFromLeadUuid',
        actions: {
          view: {
            action: 'backoffice-graphql.profile.field.convertedFromLeadUuid',
            state: false,
          },
        },
      },
      // Additional phone
      {
        id: 'additionalPhone',
        actions: {
          view: {
            action: 'backoffice-graphql.profile.field.additionalPhone',
            state: false,
          },
        },
      },
      // Client's email
      {
        id: 'email',
        actions: {
          view: {
            action: 'backoffice-graphql.profile.field.email',
            state: false,
          },
        },
      },
      // Additional email
      {
        id: 'additionalEmail',
        actions: {
          view: {
            action: 'backoffice-graphql.profile.field.additionalEmail',
            state: false,
          },
        },
      },
      // Select several clients on grid
      {
        id: 'bulkUpdate',
        actions: {
          edit: {
            action: 'hierarchy-updater.user.bulkUpdateAcquisitionStatus',
            state: false,
          },
        },
      },
      // List of trades
      {
        id: 'trades-list',
        actions: {
          view: {
            action: 'trading-activity.searchPost',
            state: false,
          },
        },
      },
      // Affiliate uuid
      {
        id: 'affiliate-uuid',
        actions: {
          view: {
            action: 'backoffice-graphql.profile.affiliate.field.uuid',
            state: false,
          },
        },
      },
      // Affiliate campaignId
      {
        id: 'affiliate-campaignId',
        actions: {
          view: {
            action: 'backoffice-graphql.profile.affiliate.field.campaignId',
            state: false,
          },
        },
      },
      // Affiliate referral
      {
        id: 'affiliate-referral',
        actions: {
          view: {
            action: 'backoffice-graphql.profile.affiliate.field.referral',
            state: false,
          },
        },
      },
      // Affiliate source
      {
        id: 'affiliate-source',
        actions: {
          view: {
            action: 'backoffice-graphql.profile.affiliate.field.source',
            state: false,
          },
        },
      },
      // Affiliate sms
      {
        id: 'affiliate-sms',
        actions: {
          view: {
            action: 'backoffice-graphql.profile.affiliate.field.sms',
            state: false,
          },
        },
      },
      // Referrer statistics
      {
        id: 'referrer-statistics',
        actions: {
          view: {
            action: 'referral.getReferrerStatistics',
            state: false,
          },
        },
      },
      // Referrals history
      {
        id: 'referrals-history',
        actions: {
          view: {
            action: 'referral.getReferrerIntroducedReferrals',
            state: false,
          },
        },
      },
      // Referrer uuid
      {
        id: 'referrer-uuid',
        actions: {
          view: {
            action: 'backoffice-graphql.profile.referrer.field.uuid',
            state: false,
          },
        },
      },
      // Referrer full name
      {
        id: 'referrer-fullName',
        actions: {
          view: {
            action: 'backoffice-graphql.profile.referrer.field.fullName',
            state: false,
          },
        },
      },
      // Callbacks list
      {
        id: 'callbacks-list',
        actions: {
          view: {
            action: 'callback.searchClientCallbacks',
            state: false,
          },
        },
      },
      // Create callback
      {
        id: 'create-callback',
        actions: {
          edit: {
            action: 'callback.createClientCallback',
            state: false,
          },
        },
      },
      // Update callback
      {
        id: 'update-callback',
        actions: {
          edit: {
            action: 'callback.updateClientCallback',
            state: false,
          },
        },
      },
      // Delete callback
      {
        id: 'delete-callback',
        actions: {
          edit: {
            action: 'callback.deleteClientCallback',
            state: false,
          },
        },
      },
    ],
  },
  // ============================================= //
  // =================== Leads =================== //
  // ============================================= //
  {
    id: 'leads',
    actions: {
      view: {
        action: 'lead.searchLeads',
        state: false,
      },
    },
    additional: {
      permissions: [
        // operator
        'operator.searchOperators',
        // hierarchy
        'hierarchy.user.getSubordinateOperators',
        'hierarchy.branch.getUserBranches',
      ],
    },
    permissions: [
      // List of leads
      {
        id: 'list',
        actions: {
          view: {
            action: 'lead.searchLeads',
            state: false,
          },
        },
      },
      // Lead's profile
      {
        id: 'profile',
        actions: {
          view: {
            action: 'lead.getLeadById',
            state: false,
          },
        },
      },
      // Upload leads from file
      {
        id: 'upload',
        actions: {
          edit: {
            action: 'lead-updater.uploadLeadsFromFile',
            state: false,
          },
        },
      },
      // Promote lead to client
      {
        id: 'promote',
        actions: {
          edit: {
            action: 'profile.admin.createProfile',
            state: false,
          },
        },
      },
      // Phone
      {
        id: 'phone',
        actions: {
          view: {
            action: 'backoffice-graphql.lead.field.phone',
            state: false,
          },
        },
      },
      // Mobile
      {
        id: 'mobile',
        actions: {
          view: {
            action: 'backoffice-graphql.lead.field.mobile',
            state: false,
          },
        },
      },
      // Email
      {
        id: 'email',
        actions: {
          view: {
            action: 'backoffice-graphql.lead.field.email',
            state: false,
          },
        },
      },
      // Callbacks list
      {
        id: 'callbacks-list',
        actions: {
          view: {
            action: 'callback.searchLeadCallbacks',
            state: false,
          },
        },
      },
      // Create callback
      {
        id: 'create-callback',
        actions: {
          edit: {
            action: 'callback.createLeadCallback',
            state: false,
          },
        },
      },
      // Update callback
      {
        id: 'update-callback',
        actions: {
          edit: {
            action: 'callback.updateLeadCallback',
            state: false,
          },
        },
      },
      // Delete callback
      {
        id: 'delete-callback',
        actions: {
          edit: {
            action: 'callback.deleteLeadCallback',
            state: false,
          },
        },
      },
    ],
  },
  // ============================================= //
  // ================= Operators ================= //
  // ============================================= //
  {
    id: 'operators',
    actions: {
      view: {
        action: 'operator.searchOperators',
        state: false,
      },
    },
    permissions: [
      // Create new operator
      {
        id: 'create',
        actions: {
          edit: {
            action: 'operator.createOperator',
            state: false,
          },
        },
      },
      // Operator's profile
      {
        id: 'profile',
        actions: {
          view: {
            action: 'operator.getOperatorProfileByUuid',
            state: false,
          },
        },
      },
      // List of operators
      {
        id: 'list',
        actions: {
          view: {
            action: 'operator.searchOperators',
            state: false,
          },
        },
      },
      // Add authority for user
      {
        id: 'addAuthority',
        actions: {
          edit: {
            action: 'auth2.addUserAuthority',
            state: false,
          },
        },
      },
      // Delete authority for user
      {
        id: 'deleteAuthority',
        actions: {
          edit: {
            action: 'auth2.deleteUserAuthority',
            state: false,
          },
        },
      },
      // Operator's personal details
      {
        id: 'personalDetails',
        actions: {
          edit: {
            action: 'operator.editOperatorProfile',
            state: false,
          },
        },
      },
      // Reset password for user
      {
        id: 'resetPassword',
        actions: {
          edit: {
            action: 'auth2.user.resetPassword',
            state: false,
          },
        },
      },
      // Operator's status
      {
        id: 'changeStatus',
        actions: {
          edit: {
            action: 'operator.changeOperatorStatus',
            state: false,
          },
        },
      },
      // Change password for other operator
      {
        id: 'changePassword',
        actions: {
          edit: {
            action: 'auth2.operator.changePassword',
            state: false,
          },
        },
      },
      // Get authorities on edit profile
      {
        id: 'getAuthorities',
        actions: {
          view: {
            action: 'auth2.getAuthorities',
            state: false,
          },
        },
      },
      // List of operators
      {
        id: 'list2',
        actions: {
          view: {
            action: 'hierarchy.user.getSubordinateOperators',
            state: false,
          },
        },
      },
      // User branch
      {
        id: 'updateBranch',
        actions: {
          edit: {
            action: 'hierarchy-updater.user.updateUserBranch',
            state: false,
          },
        },
      },
      // Create sales rule
      {
        id: 'createSalesRule',
        actions: {
          edit: {
            action: 'rules-profile.createOrUpdateRule',
            state: false,
          },
        },
      },
      // Delete sales rule
      {
        id: 'deleteSalesRule',
        actions: {
          edit: {
            action: 'rules-profile.deleteRule',
            state: false,
          },
        },
      },
    ],
  },
  // ============================================= //
  // ================== Partners ================= //
  // ============================================= //
  {
    id: 'partners',
    actions: {
      view: {
        action: 'affiliate.searchAffiliate',
        state: false,
      },
    },
    permissions: [
      // List of partners
      {
        id: 'list',
        actions: {
          view: {
            action: 'affiliate.searchAffiliate',
            state: false,
          },
        },
      },
      // Partner's profile
      {
        id: 'profile',
        actions: {
          view: {
            action: 'affiliate.getAffiliate',
            state: false,
          },
        },
      },
      // Create new partner
      {
        id: 'create',
        actions: {
          edit: {
            action: 'affiliate.createAffiliate',
            state: false,
          },
        },
      },
      // Partner account status
      {
        id: 'changeStatus',
        actions: {
          edit: {
            action: 'affiliate.changeAffiliateStatus',
            state: false,
          },
        },
      },
      // Partner change statuses
      {
        id: 'changeStatuses',
        actions: {
          edit: {
            action: 'affiliate.bulkChangeAffiliatesStatuses',
            state: false,
          },
        },
      },
      // Partner personal details
      {
        id: 'personalDetails',
        actions: {
          edit: {
            action: 'affiliate.updateAffiliate',
            state: false,
          },
        },
      },
      // Change password for partner
      {
        id: 'changePassword',
        actions: {
          edit: {
            action: 'auth2.operator.changePassword',
            state: false,
          },
        },
      },
      // Show feed tab
      {
        id: 'feedTab',
        actions: {
          view: {
            action: 'audit.searchAudit',
            state: false,
          },
        },
      },
      // List of sales rules
      {
        id: 'listSalesRules',
        actions: {
          view: {
            action: 'rules-profile.searchRules',
            state: false,
          },
        },
      },
      // Create sales rule
      {
        id: 'createSalesRule',
        actions: {
          edit: {
            action: 'rules-profile.createOrUpdateRule',
            state: false,
          },
        },
      },
      // Delete sales rule
      {
        id: 'deleteSalesRule',
        actions: {
          edit: {
            action: 'rules-profile.deleteRule',
            state: false,
          },
        },
      },
    ],
  },
  // ============================================= //
  // ========== Management - Hierarchy =========== //
  // ============================================= //
  {
    id: 'management-hierarchy',
    actions: {
      view: {
        action: 'hierarchy.branch.getBranchTree',
        state: false,
      },
    },
    permissions: [
      // Show hierarchy tree
      {
        id: 'tree',
        actions: {
          view: {
            action: 'hierarchy.branch.getBranchTree',
            state: false,
          },
        },
      },
      // List of Offices
      {
        id: 'listOffices',
        actions: {
          view: {
            action: 'hierarchy.branch.searchOffice',
            state: false,
          },
        },
      },
      // List of Desks
      {
        id: 'listDesks',
        actions: {
          view: {
            action: 'hierarchy.branch.searchDesk',
            state: false,
          },
        },
      },
      // List of Teams
      {
        id: 'listTeams',
        actions: {
          view: {
            action: 'hierarchy.branch.searchTeam',
            state: false,
          },
        },
      },
      // List of Operators
      {
        id: 'listOperators',
        actions: {
          view: {
            action: 'hierarchy.user.getSubordinateOperators',
            state: false,
          },
        },
      },
      // Branch page
      {
        id: 'branchPage',
        actions: {
          view: {
            action: 'hierarchy.branch.getBranchByUuid',
            state: false,
          },
        },
      },
      // Create new branch
      {
        id: 'branchCreate',
        actions: {
          edit: {
            action: 'hierarchy-updater.branch.createBranch',
            state: false,
          },
        },
      },
      // Update branch
      {
        id: 'branchUpdate',
        actions: {
          edit: {
            action: 'hierarchy-updater.branch.updateBranch',
            state: false,
          },
        },
      },
      // Delete branch
      {
        id: 'branchDelete',
        actions: {
          edit: {
            action: 'hierarchy-updater.branch.deleteBranch',
            state: false,
          },
        },
      },
      // Add branch manager
      {
        id: 'branchAddManager',
        actions: {
          edit: {
            action: 'hierarchy-updater.branch.addBranchManager',
            state: false,
          },
        },
      },
      // Remove branch manager
      {
        id: 'removeAddManager',
        actions: {
          edit: {
            action: 'hierarchy-updater.branch.removeBranchManager',
            state: false,
          },
        },
      },
      // Update acquisition
      {
        id: 'updateAcquisition',
        actions: {
          edit: {
            action: 'hierarchy-updater.user.bulkUpdateAcquisition',
            state: false,
          },
        },
      },
    ],
  },
  // ============================================= //
  // ========= Management - Sales Rules ========== //
  // ============================================= //
  {
    id: 'management-sales-rules',
    actions: {
      view: {
        action: 'rules-profile.searchRules',
        state: false,
      },
    },
    permissions: [
      // List of sales rules
      {
        id: 'salesRulesList',
        actions: {
          view: {
            action: 'rules-profile.searchRules',
            state: false,
          },
        },
      },
      // Create sales rule
      {
        id: 'salesRulesCreate',
        actions: {
          edit: {
            action: 'rules-profile.createOrUpdateRule',
            state: false,
          },
        },
      },
      // Delete sales rule
      {
        id: 'salesRulesDelete',
        actions: {
          edit: {
            action: 'rules-profile.deleteRule',
            state: false,
          },
        },
      },
    ],
  },
  // ============================================= //
  // ================== Payments ================= //
  // ============================================= //
  {
    id: 'payments',
    actions: {
      view: {
        action: 'payment-view.searchPayments',
        state: false,
      },
    },
    permissions: [
      // List of payments
      {
        id: 'list',
        actions: {
          view: {
            action: 'payment-view.searchPayments',
            state: false,
          },
        },
      },
      // Approve payment
      {
        id: 'approve',
        actions: {
          edit: {
            action: 'payment.approvePayment',
            state: false,
          },
        },
      },
      // Reject payment
      {
        id: 'reject',
        actions: {
          edit: {
            action: 'payment.rejectPayment',
            state: false,
          },
        },
      },
      // Change payment status
      {
        id: 'changeStatus',
        actions: {
          edit: {
            action: 'payment.changePaymentStatus',
            state: false,
          },
        },
      },
      // Change payment method
      {
        id: 'changeMethod',
        actions: {
          edit: {
            action: 'payment.changePaymentMethod',
            state: false,
          },
        },
      },
      // Payment original agent
      {
        id: 'changeAgent',
        actions: {
          edit: {
            action: 'payment.changePaymentAgent',
            state: false,
          },
        },
      },
      // Change payment system
      {
        id: 'changeSystem',
        actions: {
          edit: {
            action: 'payment.changePaymentSystem',
            state: false,
          },
        },
      },
    ],
  },
  // ============================================= //
  // ============== Email templates ============== //
  // ============================================= //
  {
    id: 'email-templates',
    actions: {
      view: {
        action: 'email.getAllTemplates',
        state: false,
      },
    },
    permissions: [
      // List of templates
      {
        id: 'list',
        actions: {
          view: {
            action: 'email.getAllTemplates',
            state: false,
          },
        },
      },
      // Create template
      {
        id: 'create',
        actions: {
          edit: {
            action: 'email.createTemplate',
            state: false,
          },
        },
      },
      // Send email
      {
        id: 'send',
        actions: {
          edit: {
            action: 'email.sendTemplatedEmail',
            state: false,
          },
        },
      },
    ],
  },
  // ============================================= //
  // ================ KYC documents ============== //
  // ============================================= //
  {
    id: 'kyc-documents',
    actions: {
      view: {
        action: 'attachments.searchAttachments',
        state: false,
      },
    },
    permissions: [
      // List of KYC documents
      {
        id: 'list',
        actions: {
          view: {
            action: 'attachments.searchAttachments',
            state: false,
          },
        },
      },
    ],
  },
  // ============================================= //
  // =============== Trading accounts ============ //
  // ============================================= //
  {
    id: 'trading-accounts',
    actions: {
      view: {
        action: 'accountview.search',
        state: false,
      },
    },
    permissions: [
      // List of trading accounts
      {
        id: 'list',
        actions: {
          view: {
            action: 'accountview.search',
            state: false,
          },
        },
      },
      // Create trading account
      {
        id: 'create',
        actions: {
          edit: {
            action: 'trading-account.createAccount',
            state: false,
          },
        },
      },
      // Unarchive trading account
      {
        id: 'unarchive',
        actions: {
          edit: {
            action: 'trading-account.unarchiveAccount',
            state: false,
          },
        },
      },
      // Trading account password
      {
        id: 'changePassword',
        actions: {
          edit: {
            action: 'trading-account.changeAccountPassword',
            state: false,
          },
        },
      },
      {
        id: 'rename',
        actions: {
          edit: {
            action: 'trading-account.renameAccount',
            state: false,
          },
        },
      },
      {
        id: 'toggleDisabled',
        actions: {
          edit: {
            action: 'trading-account.changeAccountReadOnly',
            state: false,
          },
        },
      },
    ],
  },
  // ============================================= //
  // ==================== Notes ================== //
  // ============================================= //
  {
    id: 'notes',
    actions: {
      view: {
        action: 'note.searchNotesPost',
        state: false,
      },
    },
    permissions: [
      // Notes tab
      {
        id: 'list',
        actions: {
          view: {
            action: 'note.searchNotesPost',
            state: false,
          },
        },
      },
      // Create note
      {
        id: 'create',
        actions: {
          edit: {
            action: 'note.saveNote',
            state: false,
          },
        },
      },
      // Update note
      {
        id: 'update',
        actions: {
          edit: {
            action: 'note.updateNote',
            state: false,
          },
        },
      },
      // Delete note
      {
        id: 'delete',
        actions: {
          edit: {
            action: 'note.deleteNote',
            state: false,
          },
        },
      },
    ],
  },
  // ============================================= //
  // ================ Notifications ============== //
  // ============================================= //
  {
    id: 'notifications',
    actions: {
      view: {
        action: 'notification.search',
        state: false,
      },
    },
    permissions: [
      // List of notifications
      {
        id: 'list',
        actions: {
          view: {
            action: 'notification.search',
            state: false,
          },
        },
      },
      // Get unread count
      {
        id: 'unreadCount',
        actions: {
          view: {
            action: 'notification.countAllUserUnreadNotifications',
            state: false,
          },
        },
      },
    ],
  },
  // ============================================= //
  // ============ Clients Distribution =========== //
  // ============================================= //
  // {
  //   id: 'clients-distribution',
  //   actions: {
  //     view: {
  //       action: 'clients-distributor.searchRules',
  //       state: false,
  //     },
  //   },
  //   permissions: [
  //     // List of distribution rules
  //     {
  //       id: 'list',
  //       actions: {
  //         view: {
  //           action: 'clients-distributor.searchRules',
  //           state: false,
  //         },
  //       },
  //     },
  //     // Create rule
  //     {
  //       id: 'create',
  //       actions: {
  //         edit: {
  //           action: 'clients-distributor.createRule',
  //           state: false,
  //         },
  //       },
  //     },
  //   ],
  // },
  // ============================================= //
  // ============== Payment methods ============== //
  // ============================================= //
  {
    id: 'payments-methods',
    image: false,
    actions: {
      view: {
        action: 'payment.getManualPaymentMethods',
        state: false,
      },
    },
    permissions: [
      {
        id: 'BONUS',
        actions: {
          view: {
            action: 'backoffice-graphql.payment.field.manual-methods.values.BONUS',
            state: false,
          },
        },
      },
      {
        id: 'CHARGEBACK',
        actions: {
          view: {
            action: 'backoffice-graphql.payment.field.manual-methods.values.CHARGEBACK',
            state: false,
          },
        },
      },
      {
        id: 'CREDIT_CARD',
        actions: {
          view: {
            action: 'backoffice-graphql.payment.field.manual-methods.values.CREDIT_CARD',
            state: false,
          },
        },
      },
      {
        id: 'ELECTRONIC',
        actions: {
          view: {
            action: 'backoffice-graphql.payment.field.manual-methods.values.ELECTRONIC',
            state: false,
          },
        },
      },
      {
        id: 'EXTERNAL',
        actions: {
          view: {
            action: 'backoffice-graphql.payment.field.manual-methods.values.EXTERNAL',
            state: false,
          },
        },
      },
      {
        id: 'INTERNAL_TRANSFER',
        actions: {
          view: {
            action: 'backoffice-graphql.payment.field.manual-methods.values.INTERNAL_TRANSFER',
            state: false,
          },
        },
      },
      {
        id: 'MIGRATION',
        actions: {
          view: {
            action: 'backoffice-graphql.payment.field.manual-methods.values.MIGRATION',
            state: false,
          },
        },
      },
      {
        id: 'PAYRETAILERS',
        actions: {
          view: {
            action: 'backoffice-graphql.payment.field.manual-methods.values.PAYRETAILERS',
            state: false,
          },
        },
      },
      {
        id: 'RECALL',
        actions: {
          view: {
            action: 'backoffice-graphql.payment.field.manual-methods.values.RECALL',
            state: false,
          },
        },
      },
      {
        id: 'SYSTEM',
        actions: {
          view: {
            action: 'backoffice-graphql.payment.field.manual-methods.values.SYSTEM',
            state: false,
          },
        },
      },
      {
        id: 'WIRE',
        actions: {
          view: {
            action: 'backoffice-graphql.payment.field.manual-methods.values.WIRE',
            state: false,
          },
        },
      },
    ],
  },
  // ============================================= //
  // ============ IP White List =========== //
  // ============================================= //
  {
    id: 'ip-white-list',
    actions: {
      view: {
        action: 'brand-config-service.ip-white-list.search',
        state: false,
      },
    },
    permissions: [
      // List Ips in Whitelist
      {
        id: 'list',
        actions: {
          view: {
            action: 'brand-config-service.ip-white-list.search',
            state: false,
          },
        },
      },
      // add new IP address to whitelist
      {
        id: 'create',
        actions: {
          edit: {
            action: 'brand-config-service.ip-white-list.add',
            state: false,
          },
        },
      },
      // remove IP adddress from whitelist
      {
        id: 'delete',
        actions: {
          edit: {
            action: 'brand-config-service.ip-white-list.delete',
            state: false,
          },
        },
      },
      {
        id: 'editDescription',
        actions: {
          edit: {
            action: 'brand-config-service.ip-white-list.editDescription',
            state: false,
          },
        },
      },
    ],
  },
  // ============================================= //
  // ============ Acquisition statuses =========== //
  // ============================================= //
  {
    id: 'acquisition-statuses',
    actions: {
      view: {
        action: 'hierarchy-updater.acquisition.getStatuses',
        state: false,
      },
    },
    permissions: [
      // List acquisition statuses
      {
        id: 'list',
        actions: {
          view: {
            action: 'hierarchy-updater.acquisition.getStatuses',
            state: false,
          },
        },
      },
      // Add new acquisition status
      {
        id: 'create',
        actions: {
          edit: {
            action: 'hierarchy-updater.acquisition.addStatusForBrand',
            state: false,
          },
        },
      },
      // Delete acquisition status
      {
        id: 'delete',
        actions: {
          edit: {
            action: 'hierarchy-updater.acquisition.deleteStatusForBrand',
            state: false,
          },
        },
      },
    ],
  },
];

export default rback;
