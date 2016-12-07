import { injectReducer } from 'store/reducers';

export default (store) => ({
  path: '/reports/revenue',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, {
        key: 'revenueReport',
        reducer: require('./modules/index').default,
      });

      cb(null, require('./container/Container').default);
    }, 'revenue-report');
  },
});
