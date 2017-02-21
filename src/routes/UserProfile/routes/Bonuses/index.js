import { injectReducer } from 'store/reducers';

export default (store) => ({
  path: ':id/bonuses',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'userBonusesList', reducer: require('./modules/list').default });

      cb(null, require('./container/Bonuses').default);
    }, 'user-bonuses-list');
  },
});
