import { injectReducer } from 'store/reducers';
import ProfileRoute from './routes/Profile';

export default store => ({
  path: 'operators/:id',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'operatorProfile', reducer: require('./modules').default });
      cb(null, require('./container/ViewContainer').default);
    }, 'operator-profile-layout');
  },
  childRoutes: [
    ProfileRoute(store),
  ],
});
