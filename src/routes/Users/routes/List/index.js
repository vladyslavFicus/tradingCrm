import { injectReducer } from 'store/reducers';

export default (store) => ({
  path: 'list',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'usersList', reducer: require('./modules/list').default });

      cb(null, require('./container/Container').default);
    }, 'users-list');
  },
});
