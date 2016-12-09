import { injectReducer } from 'store/reducers';

export default (store) => ({
  path: 'create(/:uuid)',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, {
        key: 'bonusCreate',
        reducer: require('./modules/create').default,
      });

      cb(null, require('./container/Container').default);
    }, 'bonus-create');
  },
});
