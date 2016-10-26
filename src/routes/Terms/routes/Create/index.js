import { injectReducer } from 'store/reducers';

export default (store) => ({
  path: 'create',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, {
        key: 'termsCreate',
        reducer: require('./modules/create').default,
      });

      cb(null, require('./container/Container').default);
    }, 'terms-create');
  },
});
