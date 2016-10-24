import { injectReducer } from 'store/reducers';
import CreateRoute from './routes/Create';

export default (store) => ({
  path: '/terms-and-conditions',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, {
        key: 'termsAndConditionsList',
        reducer: require('./modules/list').default,
      });

      cb(null, require('./layouts/Terms').default);
    }, 'terms-list');
  },

  childRoutes: [
    CreateRoute(store),
  ],
});
