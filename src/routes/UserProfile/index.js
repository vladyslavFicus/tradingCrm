import ProfileRoute from './routes/Profile';
import GameActivityRoute from './routes/GameActivity';
import FilesRoute from './routes/Files';
import UserPaymentsRoute from './routes/Transactions';
import UserBonusesRoute from './routes/Bonuses';
import LimitsRoute from './routes/Limits';
import NotesRoute from './routes/Notes';
import { injectReducer } from '../../store/reducers';

export default store => ({
  path: 'users',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'profile', reducer: require('./modules').default });

      cb(null, require('./container/UserProfile').default);
    });
  },

  childRoutes: [
    ProfileRoute(store),
    GameActivityRoute(store),
    FilesRoute(store),
    UserPaymentsRoute(store),
    UserBonusesRoute(store),
    LimitsRoute(store),
    NotesRoute(store),
  ],
});
