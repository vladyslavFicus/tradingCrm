import { injectReducer } from 'store/reducers';

export default (store) => ({
  path: 'dormant',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'dormantUserList', reducer: require('./modules/list').default });

      cb(null, require('./container/Container').default);
    }, 'dormant-users-list');
  },
});
