import ProfileRoute from './routes/Profile';
import FeedRoute from './routes/Feed';
import FilesRoute from './routes/Files';
import DevicesRoute from './routes/Devices';
import UserPaymentsRoute from './routes/Transactions';
import UserRewardsRoute from './routes/Rewards';
import LimitsRoute from './routes/Limits';
import PaymentAccountsRoute from './routes/PaymentAccounts';
import NotesRoute from './routes/Notes';
import { injectReducer } from '../../store/reducers';
import { actionCreators } from './modules';
import { actionCreators as usersPanelsActionCreators } from '../../redux/modules/user-panels';
import Permissions from '../../utils/permissions';
import permissions from '../../config/permissions';
import { playerProfileViewTypes } from '../../constants';

const requiredPermissions = new Permissions([permissions.USER_PROFILE.PROFILE_VIEW]);
const PLAYER_PROFILE_ROUTE_PREFIX = 'users';
const profilePathnameRegExp = new RegExp(`^\\/${PLAYER_PROFILE_ROUTE_PREFIX}\\/([^\\/]+)\\/?.*`, 'i');

export default store => ({
  path: `${PLAYER_PROFILE_ROUTE_PREFIX}/:id`,
  onEnter: ({ location }, replace, cb) => {
    const { settings, auth: { brandId, uuid } } = store.getState();

    if (settings.playerProfileViewType === playerProfileViewTypes.frame) {
      if (!window.isFrame) {
        const [, playerUUID] = location.pathname.match(profilePathnameRegExp);

        if (playerUUID) {
          store.dispatch(usersPanelsActionCreators.add({
            fullName: '',
            login: '',
            uuid: playerUUID,
            path: location.pathname.replace(`/${PLAYER_PROFILE_ROUTE_PREFIX}/${playerUUID}/`, ''),
            authorId: uuid,
          }));
          replace({ pathname: `/${PLAYER_PROFILE_ROUTE_PREFIX}/list`, state: { ignoreByUsersPanel: true } });
        }
      }
    }

    cb();
  },
  getComponent(nextState, cb) {
    if (!requiredPermissions.check(store.getState().permissions.data)) {
      return cb(null, require('../Forbidden/container/Container').default);
    }

    import(/* webpackChunkName: "profileReducer" */ './modules')
      .then((module) => {
        injectReducer(store, { key: 'profile', reducer: module.default });

        return store.dispatch(actionCreators.fetchProfile(nextState.params.id));
      })
      .then((action) => {
        if (action && !action.error) {
          return import(/* webpackChunkName: "playerProfileRoute" */ './container/ProfileLayoutContainer');
        }

        return import(/* webpackChunkName: "notFoundRoute" */ '../NotFound/container/Container');
      })
      .then((component) => {
        cb(null, component.default);
      });
  },

  ignoreScrollBehavior: true,
  childRoutes: [
    ProfileRoute(store),
    FeedRoute(store),
    FilesRoute(store),
    DevicesRoute(store),
    UserPaymentsRoute(store),
    UserRewardsRoute(store),
    PaymentAccountsRoute(store),
    LimitsRoute(store),
    NotesRoute(store),
  ],
});
