import { injectReducer } from 'store/reducers';

export default (store) => ({
  path: ':id/payments',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'userPayments', reducer: require('./modules/view').default });

      cb(null, require('./container/ViewContainer').default);
    }, 'transactions-view');
  },
});
