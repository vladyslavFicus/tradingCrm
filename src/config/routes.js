import permissions from './permissions';
import { services } from '../constants/services';

const routeServices = {
  '/players/:id/transactions/trading-activity': services.trading_activity,
  '/players/:id/transactions/game-activity': services.gaming_activity,
};

const routePermissions = {
  '/players/list': permissions.USER_PROFILE.PROFILES_LIST,
  '/operators/list': permissions.OPERATORS.OPERATORS_LIST_VIEW,
  '/operators/:id': permissions.OPERATORS.PROFILE_VIEW,
  '/leads/list': permissions.LEADS.GET_LEADS,
  '/leads/:id': permissions.LEADS.GET_LEAD_BY_ID,
  '/teams/list': permissions.HIERARCHY.GET_TEAMS,
  '/teams/:id': permissions.HIERARCHY.GET_TEAMS,
  '/desks/list': permissions.HIERARCHY.GET_DESKS,
  '/desks/:id': permissions.HIERARCHY.GET_DESKS,
  '/offices/list': permissions.HIERARCHY.GET_OFFICES,
  '/offices/:id': permissions.HIERARCHY.GET_OFFICES,
};

export default {
  routePermissions,
  routeServices,
};
