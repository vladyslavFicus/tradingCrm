import permissions from '../../config/permissions';

const routePermissions = {
  '/players/list': permissions.USER_PROFILE.PROFILES_LIST,
  '/settings/cms-games': permissions.CMS_GAMES.VIEW_LIST,
  '/campaigns/list': permissions.CAMPAIGNS.LIST,
  '/campaigns/view/:id': permissions.CAMPAIGNS.VIEW,
  '/campaigns/create': permissions.CAMPAIGNS.CREATE,
  '/bonus-campaigns/list': permissions.PROMOTION.LIST,
};

export { routePermissions };
