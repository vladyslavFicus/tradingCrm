import { injectReducer } from '../../../../../../store/reducers';

export default store => ({
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, {
        key: 'wageringFulfillments',
        reducer: require('../../modules').default,
      });

      cb(null, require('./container/ListContainer').default);
    }, 'wagering-fulfillments-list');
  },
});
