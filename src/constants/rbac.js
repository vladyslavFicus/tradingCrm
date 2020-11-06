export default [
  // ============================================= //
  // =================== Leads =================== //
  // ============================================= //
  {
    id: 'leads',
    permissions: [
      {
        id: 'list',
        actions: {
          // List of leads
          view: {
            action: 'lead.searchLeads',
            state: false,
          },
        },
      },
      {
        id: 'profile',
        actions: {
          // Lead's profile
          view: {
            action: 'lead.getLeadById',
            state: false,
          },
        },
      },
      {
        id: 'promote',
        actions: {
          // Promote lead to client
          edit: {
            action: 'profile.admin.createProfile',
            state: false,
          },
        },
      },
      {
        id: 'phone',
        actions: {
          // Phone
          view: {
            action: 'backoffice-graphql.lead.field.phone',
            state: false,
          },
        },
      },
      {
        id: 'mobile',
        actions: {
          // Mobile
          view: {
            action: 'backoffice-graphql.lead.field.mobile',
            state: false,
          },
        },
      },
      {
        id: 'email',
        actions: {
          // Email
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
      {
        id: 'create',
        actions: {
          // Create new operator
          edit: {
            action: 'operator.createOperator',
            state: false,
          },
        },
      },
      {
        id: 'profile',
        actions: {
          // Operator's profile
          view: {
            action: 'operator.getOperatorProfileByUuid',
            state: false,
          },
        },
      },
      {
        id: 'list',
        actions: {
          // List of operators
          view: {
            action: 'operator.searchOperators',
            state: false,
          },
        },
      },
      {
        id: 'addAuthority',
        actions: {
          // Add authority for user
          edit: {
            action: 'auth2.addUserAuthority',
            state: false,
          },
        },
      },
      {
        id: 'deleteAuthority',
        actions: {
          // Delete authority for user
          edit: {
            action: 'auth2.deleteUserAuthority',
            state: false,
          },
        },
      },
      {
        id: 'personalDetails',
        actions: {
          // Operator's personal details
          edit: {
            action: 'operator.editOperatorProfile',
            state: false,
          },
        },
      },
      {
        id: 'resetPassword',
        actions: {
          // Reset password for user
          edit: {
            action: 'auth2.user.resetPassword',
            state: false,
          },
        },
      },
      {
        id: 'changeStatus',
        actions: {
          // Operator's status
          edit: {
            action: 'operator.changeOperatorStatus',
            state: false,
          },
        },
      },
      {
        id: 'changePassword',
        actions: {
          // Change password for other operator
          edit: {
            action: 'auth2.operator.changePassword',
            state: false,
          },
        },
      },
      {
        id: 'getAuthorities',
        actions: {
          // Get authorities on edit profile
          view: {
            action: 'auth2.getAuthorities',
            state: false,
          },
        },
      },
      {
        id: 'list2',
        actions: {
          // List of Operators
          view: {
            action: 'hierarchy.user.getSubordinateOperators',
            state: false,
          },
        },
      },
      {
        id: 'updateBranch',
        actions: {
          // User branch
          edit: {
            action: 'hierarchy-updater.user.updateUserBranch',
            state: false,
          },
        },
      },
      {
        id: 'createSalesRule',
        actions: {
          // Create sales rule
          edit: {
            action: 'rules-profile.createOrUpdateRule',
            state: false,
          },
        },
      },
      {
        id: 'deleteSalesRule',
        actions: {
          // Delete sales rule
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
      {
        id: 'list',
        actions: {
          // List of partners
          view: {
            action: 'affiliate.searchAffiliate',
            state: false,
          },
        },
      },
      {
        id: 'profile',
        actions: {
          // Partner's profile
          view: {
            action: 'affiliate.getAffiliate',
            state: false,
          },
        },
      },
      {
        id: 'create',
        actions: {
          // Create new partner
          edit: {
            action: 'affiliate.createAffiliate',
            state: false,
          },
        },
      },
      {
        id: 'changeStatus',
        actions: {
          // Partner account status
          edit: {
            action: 'affiliate.changeAffiliateStatus',
            state: false,
          },
        },
      },
      {
        id: 'personalDetails',
        actions: {
          // Partner personal details
          edit: {
            action: 'affiliate.updateAffiliate',
            state: false,
          },
        },
      },
      {
        id: 'changePassword',
        actions: {
          // Change password for partner
          edit: {
            action: 'auth2.operator.changePassword',
            state: false,
          },
        },
      },
      {
        id: 'feedTab',
        actions: {
          // Show feed tab
          view: {
            action: 'audit.searchAudit',
            state: false,
          },
        },
      },
      {
        id: 'listSalesRules',
        actions: {
          // List of sales rules
          view: {
            action: 'rules-profile.searchRules',
            state: false,
          },
        },
      },
      {
        id: 'createSalesRule',
        actions: {
          // Create sales rule
          edit: {
            action: 'rules-profile.createOrUpdateRule',
            state: false,
          },
        },
      },
      {
        id: 'deleteSalesRule',
        actions: {
          // Delete sales rule
          edit: {
            action: 'rules-profile.deleteRule',
            state: false,
          },
        },
      },
    ],
  },
];
