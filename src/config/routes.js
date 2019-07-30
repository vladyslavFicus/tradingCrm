import permissions from './permissions';
import { services } from '../constants/services';

const routeServices = {
  '/players/:id/transactions/trading-activity': services.trading_activity,
};

const routePermissions = {
  '/players/list': permissions.USER_PROFILE.PROFILES_LIST,
  '/operators/list': permissions.OPERATORS.OPERATORS_LIST_VIEW,
  '/operators/:id': permissions.OPERATORS.PROFILE_VIEW,
  '/leads/list': permissions.LEADS.GET_LEADS,
  '/leads/:id': permissions.LEADS.GET_LEAD_BY_ID,
  '/teams/list': permissions.HIERARCHY.GET_TEAMS,
  '/teams/:id': permissions.HIERARCHY.GET_BRANCH_BY_ID,
  '/desks/list': permissions.HIERARCHY.GET_DESKS,
  '/desks/:id': permissions.HIERARCHY.GET_BRANCH_BY_ID,
  '/offices/list': permissions.HIERARCHY.GET_OFFICES,
  '/offices/:id': permissions.HIERARCHY.GET_BRANCH_BY_ID,
};

export default {
  routePermissions,
  routeServices,
};
