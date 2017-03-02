import { injectReducer } from 'store/reducers';

export default (store) => ({
  path: ':id/transactions',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'userTransactions', reducer: require('./modules/view').default });

      cb(null, require('./container/ViewContainer').default);
    }, 'transactions-view');
  },
});
