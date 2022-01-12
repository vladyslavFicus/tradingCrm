import permissions from './permissions';

export const routePermissions = {
  '/clients/list': permissions.USER_PROFILE.PROFILES_LIST,
  '/clients/:id/files': permissions.USER_PROFILE.GET_FILES,
  '/clients/:id/feed': permissions.AUDIT.AUDIT_LOGS,
  '/kyc-documents': permissions.FILES.SEARCH_FILES,
  '/operators/list': permissions.OPERATORS.OPERATORS_LIST_VIEW,
  '/operators/:id': permissions.OPERATORS.PROFILE_VIEW,
  '/partners/list': permissions.PARTNERS.PARTNERS_LIST_VIEW,
  '/partners/:id': permissions.PARTNERS.PROFILE_VIEW,
  '/leads/list': permissions.LEADS.GET_LEADS,
  '/leads/:id': permissions.LEADS.GET_LEAD_BY_ID,
  '/teams/list': permissions.HIERARCHY.GET_TEAMS,
  '/teams/:id': permissions.HIERARCHY.GET_BRANCH_BY_ID,
  '/desks/list': permissions.HIERARCHY.GET_DESKS,
  '/desks/:id': permissions.HIERARCHY.GET_BRANCH_BY_ID,
  '/offices/list': permissions.HIERARCHY.GET_OFFICES,
  '/offices/:id': permissions.HIERARCHY.GET_BRANCH_BY_ID,
  '/sales-rules': permissions.SALES_RULES.GET_RULES,
  '/email-templates/list': permissions.EMAIL_TEMPLATES.GET_EMAIL_TEMPLATES,
  '/roles-and-permissions': permissions.AUTH.UPDATE_ACTIONS,

  // Trading Engine
  '/trading-engine-manager': permissions.WE_TRADING.MANAGER_EDIT_ORDER,
  '/trading-engine-admin': permissions.WE_TRADING.ADMIN_EDIT_ORDER,

  '/ip-whitelist/list': permissions.IP_WHITELIST.LIST,
  '/ip-whitelist/feed': permissions.AUDIT.AUDIT_LOGS,

};
