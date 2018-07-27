import permissions from './permissions';
import { services } from '../constants/services';

const routeServices = {
  '/players/:id/transactions/trading-activity': services.trading_activity,
  '/players/:id/transactions/game-activity': services.gaming_activity,
};

const routePermissions = {
  '/players/list': permissions.USER_PROFILE.PROFILES_LIST,
  '/campaigns/list': permissions.CAMPAIGNS.LIST,
  '/campaigns/view/:id': permissions.CAMPAIGNS.VIEW,
  '/campaigns/create': permissions.CAMPAIGNS.CREATE,
  '/bonus-campaigns/list': permissions.PROMOTION.LIST,
  '/operators/list': permissions.OPERATORS.OPERATORS_LIST_VIEW,
  '/operators/:id': permissions.OPERATORS.PROFILE_VIEW,
};

export default {
  routePermissions,
  routeServices,
};
