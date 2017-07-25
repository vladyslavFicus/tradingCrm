import { injectReducer } from '../../../../../../store/reducers';

export default store => ({
  path: 'free-spins',
  getComponent: (nextState, cb) => {
    require.ensure([], (require) => {
      const duxModule = require('./modules');
      injectReducer(store, { key: 'userBonusFreeSpinsList', reducer: duxModule.default });

      store
        .dispatch(duxModule.actionCreators.fetchFilters(nextState.params.id))
        .then(() => cb(null, require('./container/ViewContainer').default));
    }, 'user-bonus-free-spins-list');
  },
});
