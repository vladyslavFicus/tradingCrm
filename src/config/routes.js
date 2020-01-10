import permissions from './permissions';

export const routePermissions = {
  '/players/list': permissions.USER_PROFILE.PROFILES_LIST,
  '/clients/:id/feed': permissions.AUDIT.PROFILE_AUDIT_LOGS,
  '/operators/list': permissions.OPERATORS.OPERATORS_LIST_VIEW,
  '/operators/:id': permissions.OPERATORS.PROFILE_VIEW,
  '/leads/list': permissions.LEADS.GET_LEADS,
  '/leads/:id': permissions.LEADS.GET_LEAD_BY_ID,
  '/teams/list': permissions.HIERARCHY.GET_TEAMS,
  '/teams/:id': permissions.HIERARCHY.GET_BRANCH_BY_ID,
  '/sales-rules': permissions.SALES_RULES.GET_RULES,
  '/desks/list': permissions.HIERARCHY.GET_DESKS,
  '/desks/:id': permissions.HIERARCHY.GET_BRANCH_BY_ID,
  '/offices/list': permissions.HIERARCHY.GET_OFFICES,
  '/offices/:id': permissions.HIERARCHY.GET_BRANCH_BY_ID,
};
