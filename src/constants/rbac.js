export default [
  // ============================================= //
  // =================== Leads =================== //
  // ============================================= //
  {
    id: 'leads',
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
    ],
  },
  // ============================================= //
  // ================= Operators ================= //
  // ============================================= //
  {
    id: 'operators',
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
    ],
  },
  // ============================================= //
  // ========= Management - Sales Rules ========== //
  // ============================================= //
  {
    id: 'management-sales-rules',
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
    permissions: [
      // List of payments
      {
        id: 'list',
        actions: {
          view: {
            action: 'payment.searchPayments',
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
    ],
  },
  // ============================================= //
  // ================== Callbacks ================ //
  // ============================================= //
  {
    id: 'callbacks',
    permissions: [
      // List of callbacks
      {
        id: 'list',
        actions: {
          view: {
            action: 'callback.searchCallbacks',
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
    ],
  },
  // ============================================= //
  // ==================== Notes ================== //
  // ============================================= //
  {
    id: 'notes',
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
  {
    id: 'clients-distribution',
    permissions: [
      // List of distribution rules
      {
        id: 'list',
        actions: {
          view: {
            action: 'clients-distributor.searchRules',
            state: false,
          },
        },
      },
      // Create rule
      {
        id: 'create',
        actions: {
          edit: {
            action: 'clients-distributor.createRule',
            state: false,
          },
        },
      },
    ],
  },
];
