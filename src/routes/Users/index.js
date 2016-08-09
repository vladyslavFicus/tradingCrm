import { injectReducer } from '../../store/reducers';
import childRoutes from './routes';

export default (store) => ({
  path: '/users',
  getComponent (nextState, cb) {
    console.debug(nextState);
    require.ensure([], (require) => {
      if (!!nextState.params.id) {
        injectReducer(store, { key: 'userProfile', reducer: require('./modules/view').default });

        cb(null, require('./layouts/Users').default)
      } else {
        injectReducer(store, {
          key: 'usersList',
          reducer: require('./modules/users-list').default
        });

        cb(null, require('./container/Users').default)
      }
    }, 'users-list');
  },
  childRoutes: childRoutes(store),
});
