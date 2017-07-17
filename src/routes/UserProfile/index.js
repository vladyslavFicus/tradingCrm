import ProfileRoute from './routes/Profile';
import FeedRoute from './routes/Feed';
import GameActivityRoute from './routes/GameActivity';
import FilesRoute from './routes/Files';
import DevicesRoute from './routes/Devices';
import UserPaymentsRoute from './routes/Transactions';
import UserBonusesRoute from './routes/Bonuses';
import LimitsRoute from './routes/Limits';
import PaymentAccountsRoute from './routes/PaymentAccounts';
import NotesRoute from './routes/Notes';
import { injectReducer } from '../../store/reducers';

export default store => ({
  path: 'users',
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
    UserBonusesRoute(store),
    PaymentAccountsRoute(store),
    LimitsRoute(store),
    NotesRoute(store),
  ],
});
