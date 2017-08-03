import { injectReducer } from '../../../../store/reducers';

export default store => ({
  path: 'paymentAccounts',
  getComponent(nextState, cb) {
    injectReducer(store, { key: 'userPaymentAccounts', reducer: require('./modules').default });

    require.ensure([], (require) => {
      cb(null, require('./container/ViewContainer').default);
    }, 'user-payments-view');
  },
});
