import permissions from '../../config/permissions';

const routePermissions = {
  '/players/list': permissions.USER_PROFILE.PROFILES_LIST,
  '/settings/cms-games': permissions.CMS_GAMES.VIEW_LIST,
};

export { routePermissions };
