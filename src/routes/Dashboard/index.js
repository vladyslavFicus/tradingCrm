import Permissions from '../../utils/permissions';
import permissions from '../../config/permissions';

export default store => ({
  path: '/',
  onEnter(nextState, replace, cb) {
    const { permissions: { data: currentPermissions } } = store.getState();

    if ((new Permissions(permissions.USER_PROFILE.PROFILES_LIST)).check(currentPermissions)) {
      replace({ pathname: '/users/list' });
    }

    cb();
  },
});
