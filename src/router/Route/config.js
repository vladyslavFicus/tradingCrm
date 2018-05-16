import permissions from '../../config/permissions';

const routePermissions = {
  '/players/list': permissions.USER_PROFILE.PROFILES_LIST,
};

export { routePermissions };
