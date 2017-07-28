import { injectReducer } from '../../../../store/reducers';

export default (store) => ({
  path: 'transactions/open-loops',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, {
        key: 'openLoopTransactions',
        reducer: require('./modules').default,
      });

      cb(null, require('./container/ViewContainer').default);
    }, 'open-loops-payments-list');
  },
});
