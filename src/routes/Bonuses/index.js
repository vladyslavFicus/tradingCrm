import { injectReducer } from 'store/reducers';

export default (store) => ({
  path: '/bonuses',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, {
        key: 'bonusesList',
        reducer: require('./modules/list').default,
      });

      cb(null, require('./layouts/Bonuses').default);
    }, 'bonuses-list');
  },
});
