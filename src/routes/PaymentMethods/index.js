import { injectReducer } from '../../store/reducers';

export default store => ({
  path: 'paymentMethods',
  getComponent(nextState, cb) {
    injectReducer(store, { key: 'paymentMethodsList', reducer: require('./modules').default });

    require.ensure([], (require) => {
      cb(null, require('./container/ViewContainer').default);
    }, 'methods-list');
  },
});
