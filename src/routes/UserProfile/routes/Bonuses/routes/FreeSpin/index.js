import { injectReducer } from '../../../../../../store/reducers';

export default store => ({
  path: 'free-spins',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'userBonusFreeSpinsList', reducer: require('./modules').default });

      cb(null, require('./container/ViewContainer').default);
    }, 'user-bonus-free-spins-list');
  },
});
