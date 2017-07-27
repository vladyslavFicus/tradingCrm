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
import { actionCreators } from './modules';

export default store => ({
  path: 'users/:id',
  getComponent: (nextState, cb) => {
    import(/* webpackChunkName: "profileReducer" */ './modules')
      .then((module) => {
        injectReducer(store, { key: 'profile', reducer: module.default });

        return store.dispatch(actionCreators.fetchProfile(nextState.params.id));
      })
      .then((action) => {
        if (action && !action.error) {
          return import(/* webpackChunkName: "playerProfileRoute" */ './container/UserProfile');
        } else {
          return import(/* webpackChunkName: "notFoundRoute" */ '../NotFound/container/Container');
        }
      })
      .then((component) => {
        cb(null, component.default);
      });
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
