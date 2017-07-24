import { injectReducer } from '../../../../../../store/reducers';

export default store => ({
  path: 'bonus',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'userBonusesList', reducer: require('./modules').default });

      cb(null, require('./container/Bonuses').default);
    }, 'user-bonuses-list');
  },
});
