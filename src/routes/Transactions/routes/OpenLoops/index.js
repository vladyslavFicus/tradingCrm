import { injectReducer } from 'store/reducers';

export default (store) => ({
  path: 'open-loops',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, {
        key: 'openLoopPaymentsList',
        reducer: require('./modules/list').default,
      });

      cb(null, require('./container/ViewContainer').default);
    }, 'open-loops-payments-list');
  },
});
