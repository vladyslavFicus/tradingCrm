import { injectReducer } from '../../store/reducers';
import ViewProfileRoute from './routes/View';

export default (store) => ({
  path: '/users',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, {
        key: 'usersList',
        reducer: require('./modules/users-list').default
      });

      cb(null, require('./container/Users').default)
    }, 'users-list');
  },
  childRoutes: [ViewProfileRoute(store)],
});
