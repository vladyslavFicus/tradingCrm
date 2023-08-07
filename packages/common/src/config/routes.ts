import permissions from './permissions';

type RoutesPermissions = Record<string, Array<string>>;

const routesPermissions: RoutesPermissions = {
  // =======================
  // ======= Clients =======
  // =======================

  // Clients: List
  '/clients/list': [
    permissions.SIDEBAR.CLIENTS_LIST,
    permissions.USER_PROFILE.PROFILES_LIST,
  ],

  // Client: Details
  '/clients/:id/*': [permissions.SIDEBAR.CLIENTS_LIST],
  '/clients/:id/files': [permissions.USER_PROFILE.GET_FILES],
  '/clients/:id/feed': [permissions.AUDIT.AUDIT_LOGS],

  // Clients: KYC documents
  '/clients/kyc-documents': [
    permissions.SIDEBAR.CLIENTS_KYC_DOCUMENTS,
    permissions.FILES.SEARCH_FILES,
  ],

  // Clients: Trading accounts
  '/trading-accounts': [permissions.SIDEBAR.CLIENTS_TRADING_ACCOUNTS],

  // Clients: Callbacks list
  '/clients/callbacks/*': [permissions.SIDEBAR.CLIENTS_CALLBACKS],

  // =====================
  // ======= Leads =======
  // =====================

  // Leads: List
  '/leads/list': [
    permissions.SIDEBAR.LEADS_LIST,
    permissions.LEADS.GET_LEADS,
  ],

  // Lead: Details
  '/leads/:id/*': [
    permissions.SIDEBAR.LEADS_LIST,
    permissions.LEADS.GET_LEAD_BY_ID,
  ],

  // Leads: Callbacks list
  '/leads/callbacks/*': [permissions.SIDEBAR.LEADS_CALLBACKS],

  // =========================
  // ======= Hierarchy =======
  // =========================

  '/hierarchy': [permissions.SIDEBAR.HIERARCHY],

  // ==========================
  // ======= Management =======
  // ==========================

  // Management: Offices
  '/offices/*': [permissions.SIDEBAR.MANAGMENT_OFFICES],
  '/offices/list': [permissions.HIERARCHY.GET_OFFICES],
  '/offices/:id': [permissions.HIERARCHY.GET_BRANCH_BY_ID],

  // Management: Desks
  '/desks/*': [permissions.SIDEBAR.MANAGMENT_DESKS],
  '/desks/list': [permissions.HIERARCHY.GET_DESKS],
  '/desks/:id': [permissions.HIERARCHY.GET_BRANCH_BY_ID],

  // Management: Teams
  '/teams/*': [permissions.SIDEBAR.MANAGMENT_TEAMS],
  '/teams/list': [permissions.HIERARCHY.GET_TEAMS],
  '/teams/:id': [permissions.HIERARCHY.GET_BRANCH_BY_ID],

  // Management: Sales rules
  '/sales-rules': [
    permissions.SIDEBAR.MANAGMENT_SALES_RULES,
    permissions.SALES_RULES.GET_RULES,
  ],

  // Management: Operators
  '/operators/*': [permissions.SIDEBAR.MANAGMENT_OPERATORS],
  '/operators/list': [permissions.OPERATORS.OPERATORS_LIST_VIEW],
  '/operators/:id/*': [permissions.OPERATORS.PROFILE_VIEW],

  // Management: Partners
  '/partners/*': [permissions.SIDEBAR.MANAGMENT_PARTNERS],
  '/partners/list': [permissions.PARTNERS.PARTNERS_LIST_VIEW],
  '/partners/:id/*': [permissions.PARTNERS.PROFILE_VIEW],

  // =========================
  // ======= Documents =======
  // =========================

  '/documents/*': [permissions.SIDEBAR.DOCUMENTS],
  '/documents/list': [permissions.DOCUMENTS.SEARCH_DOCUMENT],
  '/documents/feed': [permissions.AUDIT.AUDIT_LOGS],

  // ========================
  // ======= Payments =======
  // ========================

  '/payments': [permissions.SIDEBAR.PAYMENTS],

  // =============================
  // ======= Notifications =======
  // =============================

  '/notifications': [permissions.SIDEBAR.NOTIFICATIONS],

  // ============================
  // ======= Distribution =======
  // ============================

  '/distribution': [permissions.SIDEBAR.CLIENTS_DISTIBUTION],

  // ============================
  // ======= IP whitelist =======
  // ============================

  // IP whitelist
  '/ip-whitelist/*': [permissions.SIDEBAR.IP_WHITELIST],
  '/ip-whitelist/list': [permissions.IP_WHITELIST.LIST],
  '/ip-whitelist/feed': [permissions.AUDIT.AUDIT_LOGS],

  // ========================
  // ======= Settings =======
  // ========================

  // Settings: Email templates
  '/email-templates/*': [
    permissions.SIDEBAR.SETTINGS_EMAIL_TEMPLATES,
    permissions.EMAIL_TEMPLATES.CREATE_EMAIL_TEMPLATE,
  ],

  // Settings: Roles and permissions
  '/roles-and-permissions/*': [permissions.SIDEBAR.SETTINGS_RBAC],
  '/roles-and-permissions/permissions': [permissions.AUTH.UPDATE_ACTIONS],
  '/roles-and-permissions/feed': [permissions.AUDIT.AUDIT_LOGS],

  // Settings: Acquisition statuses
  '/acquisition-statuses': [
    permissions.SIDEBAR.SETTINGS_ACQUISITION_STATUSES,
    permissions.HIERARCHY.GET_ACQUISITION_STATUSES,
  ],

  // Settings: Feature toggles
  '/feature-toggles/*': [permissions.SIDEBAR.SETTINGS_FEATURE_TOGGLES],
  '/feature-toggles/features': [permissions.BRAND_CONFIG.GET_BRAND_CONFIG],
  '/feature-toggles/feed': [permissions.AUDIT.AUDIT_LOGS],

  // Settings: PSP
  '/psp/*': [permissions.SIDEBAR.SETTINGS_PAYMENT_SYSTEMS_PROVIDER],
  '/psp/list': [permissions.PAYMENT.SEARCH_PSP],
  '/psp/feed': [permissions.AUDIT.AUDIT_LOGS],

  // ==============================
  // ======= Trading Engine =======
  // ==============================

  '/trading-engine/accounts': [permissions.WE_TRADING.ACCOUNTS_LIST],
  '/trading-engine/accounts/:id/orders': [permissions.WE_TRADING.ORDERS_LIST],
  '/trading-engine/orders': [permissions.WE_TRADING.ORDERS_LIST],
  '/trading-engine/quotes': [permissions.WE_TRADING.SYMBOLS_LIST],
  '/trading-engine/symbols': [permissions.WE_TRADING.SYMBOLS_LIST],
  '/trading-engine/symbols/new': [permissions.WE_TRADING.CREATE_SYMBOL],
  '/trading-engine/symbols/:id': [permissions.WE_TRADING.EDIT_SYMBOL],
  '/trading-engine/groups': [permissions.WE_TRADING.GROUPS_LIST],
  '/trading-engine/groups/new': [permissions.WE_TRADING.CREATE_GROUP],
  '/trading-engine/groups/:id': [permissions.WE_TRADING.EDIT_GROUP],
  '/trading-engine/securities': [permissions.WE_TRADING.SECURITIES_LIST],
  '/trading-engine/accounts/:id/transactions': [permissions.WE_TRADING.TRANSACTIONS_LIST],
  '/trading-engine/accounts/:id/feed': [permissions.AUDIT.AUDIT_LOGS],
  '/trading-engine/operators': [permissions.WE_TRADING.OPERATORS_LIST],
};

export default routesPermissions;
