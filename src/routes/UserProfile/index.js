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
      injectReducer(store, { key: 'userProfile', reducer: require('./modules/view').default });
      injectReducer(store, { key: 'userBonus', reducer: require('./modules/bonus').default });
      injectReducer(store, { key: 'userIp', reducer: require('./modules/ip').default });

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
