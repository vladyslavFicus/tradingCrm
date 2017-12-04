import { injectReducer } from '../../../../../../store/reducers';

export default store => ({
  path: 'payments(/:paymentUUID)',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'userTransactions', reducer: require('./modules').default });

      cb(null, require('./container/ViewContainer').default);
    }, 'player-transactions-view');
  },
});