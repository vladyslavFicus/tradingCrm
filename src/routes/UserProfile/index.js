import ProfileRoute from './routes/Profile';
import FeedRoute from './routes/Feed';
import GameActivityRoute from './routes/GameActivity';
import FilesRoute from './routes/Files';
import DevicesRoute from './routes/Devices';
import UserPaymentsRoute from './routes/Transactions';
import UserAwardsRoute from './routes/Awards';
import LimitsRoute from './routes/Limits';
import PaymentAccountsRoute from './routes/PaymentAccounts';
import NotesRoute from './routes/Notes';
import { injectReducer } from '../../store/reducers';
import { actionCreators as usersPanelsActionCreators } from '../../redux/modules/user-panels';

const PLAYER_PROFILE_ROUTE_PREFIX = 'users';
const profilePathnameRegExp = new RegExp(`^\\/${PLAYER_PROFILE_ROUTE_PREFIX}\\/([^\\/]+)\\/?.*`, 'i');

export default store => ({
  path: PLAYER_PROFILE_ROUTE_PREFIX,
  onEnter: ({ location }, replace, cb) => {
    if (window && window.parent === window) {
      const [, playerUUID] = location.pathname.match(profilePathnameRegExp);

      if (playerUUID) {
        store.dispatch(usersPanelsActionCreators.add({
          fullName: '',
          login: '',
          uuid: playerUUID,
        }));
        replace({ pathname: `/${PLAYER_PROFILE_ROUTE_PREFIX}/list`, state: { ignoreByUsersPanel: true } });
      }
    }

    cb();
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'profile', reducer: require('./modules').default });

      cb(null, require('./container/UserProfile').default);
    }, 'player-profile');
  },

  ignoreScrollBehavior: true,
  childRoutes: [
    ProfileRoute(store),
    FeedRoute(store),
    GameActivityRoute(store),
    FilesRoute(store),
    DevicesRoute(store),
    UserPaymentsRoute(store),
    UserAwardsRoute(store),
    PaymentAccountsRoute(store),
    LimitsRoute(store),
    NotesRoute(store),
  ],
});
