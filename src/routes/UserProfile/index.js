import ProfileRoute from './routes/Profile';
import DocumentsRoute from './routes/Documents';
import GameActivityRoute from './routes/GameActivity';
import UserPaymentsRoute from './routes/Payments';
import UserBonusesRoute from './routes/Bonuses';
import LimitsRoute from './routes/Limits';
import { injectReducer } from 'store/reducers';

export default (store) => ({
  path: 'user',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'profile', reducer: require('./modules').default });

      cb(null, require('./layouts/ProfileLayout').default);
    });
  },

  childRoutes: [
    ProfileRoute(store),
    DocumentsRoute(store),
    GameActivityRoute(store),
    UserPaymentsRoute(store),
    UserBonusesRoute(store),
    LimitsRoute(store),
  ],
});
