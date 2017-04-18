import { injectReducer } from '../../../../store/reducers';

export default store => ({
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, {
        key: 'transactions',
        reducer: require('./modules').default,
      });

      cb(null, require('./container/ViewContainer').default);
    }, 'payments-list');
  },
});
