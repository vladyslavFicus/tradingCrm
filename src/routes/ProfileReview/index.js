import { injectReducer } from 'store/reducers';
import ViewRoute from './routes/View';

export default store => ({
  path: 'profiles-review',
  getComponents(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, {
        key: 'reviewList',
        reducer: require('./modules/list').default,
      });

      cb(null, require('./layouts/ProfileReview').default);
    }, 'user-list');
  },
  childRoutes: [
    ViewRoute(store),
  ],
});
