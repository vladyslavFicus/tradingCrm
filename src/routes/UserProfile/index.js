import ProfileRoute from './routes/Profile';
import FeedRoute from './routes/Feed';
import GameActivityRoute from './routes/GameActivity';
import UserPaymentsRoute from './routes/Transactions';
import UserBonusesRoute from './routes/Bonuses';
import LimitsRoute from './routes/Limits';
import { injectReducer } from 'store/reducers';

export default (store) => ({
  path: 'users',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'profile', reducer: require('./modules').default });

      cb(null, require('./container/UserProfile').default);
    });
  },

  childRoutes: [
    ProfileRoute(store),
    FeedRoute(store),
    GameActivityRoute(store),
    UserPaymentsRoute(store),
    UserBonusesRoute(store),
    LimitsRoute(store),
  ],
});
